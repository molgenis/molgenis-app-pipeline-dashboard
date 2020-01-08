/**
 * @module store
 */

import  { State } from '@/store/state'
import { RunDataObject, ProjectDataObject, parseStatus, statusCode, dateSearch, SampleResponse, Sample } from '@/types/dataTypes'
import { Serie, IdentifiedSerie, RawDurationStatistics, DurationStatisticsStorage } from '@/types/graphTypes'

import api from '@molgenis/molgenis-api-client'
import { createDateRange, formatDate, dayMs } from '@/helpers/dates'
import { max } from '@/helpers/statistics'

import { RunData, ProjectData, JobCounter, JobCounts, constructSteps } from '@/types/Run'

/**
 *
 * Calls all actions that recieves and converts Track and trace data
 *
 * Waits for each table to load,  then converts to usable objects
 *
 * See:
 * * [[getRunData]]
 * * [[getProjectData]]
 * * [[getJobAggregates]]
 * * [[convertRawData]] 
 * @event
 * @param __namedParameters - vuex instance
 * @param __namedParameters.dispatch - call to mutations
 * @category TrackAndTrace
 * @return {Promise<void>}
 */
export function getTrackerData ({ dispatch }: { dispatch: (action: string, params?: object) => Promise<RunDataObject[]> }): Promise<void> {
  return new Promise((resolve, reject) => {
    dispatch('getRunData').then((result: RunDataObject[]) => {
      const runs = result.map((run) => {
        return `'${run.run_id}'`
      })
      Promise.all([dispatch('getProjectData', {runIDs: runs}), dispatch('getJobAggregates'), dispatch('getClusterPings')])
      .then((results) => {
        dispatch('convertRawData', { runs: result, projects: results[0] }).then(() => {
          resolve()
        })
    }).catch(() => {
      reject(new Error('Could not retrieve Track&Trace data from MOLGENIS!')) 
    })
  }).catch(() => {
    reject(new Error('Could not retrieve Track&Trace data from MOLGENIS!'))
  })
})
}

/**
 * Retrieves run data from overview table and commits changes to state
 *
 * Waits for response then calls mutation to update state: [[setRuns]]
 *
 * See [[getTrackerData]]
 *
 * @param __namedParameters - vuex instance
 * @param __namedParameters.commit - call to mutations
 * @param __namedParameters.state - application state
 * @param __namedParameters.state.overviewTable - run table api identifier
 * @category TrackAndTrace
 * @return {Promise<void>}
 */
export async function getRunData ({ commit, state: { overviewTable } }: {commit: (mutation: string) => void; state: State}): Promise<RunDataObject[]> {
  return new Promise((resolve, reject) => {
    const date = new Date()
    date.setMonth(date.getMonth() - 1)
    const dateQuery = formatDate(date)
    api.get(`/api/v2/${overviewTable}?num=10000&q=date=gt=${dateQuery}`)
      .then(function (response: {items: RunDataObject[]}) {
        commit('runsLoaded')
        resolve(response.items)
      })
      .catch(() => {
        reject(new Error(`Failed to retrieve runs from ${overviewTable}`))
      })
  })
}

/**
 * retrieves project data from projects table and commits changes to state
 * See [[getTrackerData]]
 * @param __namedParameters - vuex instance
 * @param __namedParameters.commit - call to mutations
 * @param __namedParameters.state - application state
 * @category TrackAndTrace
 * @return {Promise<void>}
 */
export async function getProjectData ({ commit, state: { projectsTable } }: {commit: (mutation: string) => void; state: State}, params: {runIDs: string[]}): Promise<ProjectDataObject[]> {
  return new Promise((resolve, reject) => {
    api.get(`/api/v2/${projectsTable}?num=10000&q=run_id=in=(${params.runIDs.join(',')})`)
      .then(function (response: {items: ProjectDataObject[]}) {
        commit('projectsLoaded')
        resolve(response.items)
      })
      .catch(() => {
        reject(new Error(`Failed to retrieve projects from ${projectsTable}`))
      })
  })
}

/**
 * Finds the maximum lenght of a IdentifiedSerie array
 * @param seriesArray - array of series
 * @param length - current array lenght
 */
export function findMax (seriesArray: IdentifiedSerie[], length: number): number {
  if (length === 1) {
    return seriesArray[0].getLenght()
  }
  return max(findMax(seriesArray, length - 1), seriesArray[length - 1].getLenght())
}

/**
 * fills a new series to keep proportions right in the graph
 * @param groupedData series with unique ids
 */
export function fillToEqualLenghts (groupedData: IdentifiedSerie[]): IdentifiedSerie[] {
  const maximum = findMax(groupedData, groupedData.length)
  const newSeries = groupedData.map((series) => {
    const nullFilledArray = new Array(maximum - series.getLenght()).fill({ projectID: null, number: null })
    return series.getLenght() < maximum ? new IdentifiedSerie(name, [...nullFilledArray, ...series.combinedData]) : series
  })
  return newSeries
}

/**
 * retrieves the runtime data for each given machine from database and commits changes to state
 * @param __namedParameters0 - vuex instance
 * @param __namedParameters0.commit - call to mutations
 * @param __namedParameters0.state - application state
 * @param __namedParameters0.state.pipelineTypes - available piplinetypes from configuration
 * @param __namedParameters0.state.timingTable - timing table api identifier
 * @param __namedParameters1 - function input
 * @param __namedParameters1.machines - array of machine id's
 * @param __namedParameters1.range - number of records to get
 * @param range - number of responses to get
 * @requires IdentifiedSerie from types/graphTypes
 * @category Runtime
 * @return Promise: resolve when sucessful, reject when not
 */
export async function getMachineData ({ commit, state: { pipelineTypes, timingTable } }: { commit: (mutation: string, params: object) => void; state: State}, { machines, range }: { machines: string[]; range: number }): Promise<void> {
  return new Promise((resolve, reject) => {
    const machineSeriesGrouped: Record<string, IdentifiedSerie[]> = {}
    machines.forEach(async (machine: string) => {
      pipelineTypes.forEach(async (pipelineType: string) => {
        if (!Object.keys(machineSeriesGrouped).includes(pipelineType)) {
          machineSeriesGrouped[pipelineType] = [] as IdentifiedSerie[]
        }

        const query = `machine==${machine};total_hours=gt=0;project=like=${pipelineType}`
        await api.get(`/api/v2/${timingTable}?num=${range}&sort=finishedTime:desc&q=${query}`)
          .then(function (response: { items: {project: string; total_hours: number}[] }) {
            if (response.items.length > 0) {
              const seriesData = Array.from(response.items.reverse(), (x) => { return { projectID: x.project, number: x.total_hours } })

              machineSeriesGrouped[pipelineType].push(new IdentifiedSerie(machine, seriesData))
            }
          })
          .catch(() => {
            reject(new Error(`Failed to get machine run times from ${timingTable}`))
          })
        machineSeriesGrouped[pipelineType] = fillToEqualLenghts(machineSeriesGrouped[pipelineType])
      })
    })
    commit('setMachineRuntimes', machineSeriesGrouped)

    resolve()
  })
}



/**
 * retrieves pipeline data from timing table and commits changes to state
 *
 * When data is recieved saves it to state by calling mutation [[setPipelineData]]
 * @param __namedParameters - vuex instance
 * @param __namedParameters.commit - calls to mutations
 * @param __namedParameters.state - application state
 * @param __namedParameters.state.pipelineTypes - available pipeline types from configuration
 * @param __namedParameters.state.timingTable - timing table identifier for api
 * @param range - number of records to retrieve
 * @requires Serie from types/graphTypes
 * @category Runtime
 * @return Promise: resolve on sucess, reject on error
 */
export async function getPipelineData ({ commit, state: { pipelineTypes, timingTable } }: { commit: (mutation: string, params: object) => void; state: State }, range: number): Promise<void> {
  const pipelineSeries: Serie[] = []

  pipelineTypes.map(async (pipelineType: string) => {
    const query = `project=like=${pipelineType};total_hours=gt=0`
    api.get(`/api/v2/${timingTable}?num=${range}&sort=finishedTime:desc&q=${query}`)
      .then(function (response: {items: {pipelineDuration: number}[]}) {
        const ResponseData = response.items
        pipelineSeries.push(new Serie(pipelineType, Array.from(ResponseData, (x: {pipelineDuration: number}) => Math.round(x.pipelineDuration / 60)).reverse()))
      })
      .catch(() => {
        throw new Error('Failed retrieving pipelineTypes')
      })
  })
  commit('setPipelineData', pipelineSeries)
}

/**
 * retrieves sequencer statistics information from sample table
 *
 * when data is retrieved saves the series & labels to state by calling [[setSequencerStatisticsSeries]] & [[setSequencerStatisticsLabels]]
 * @param __namedParameters - vuex instance
 * @param __namedParameters.commit - calls to mutations
 * @param __namedParameters.state - application state
 * @param __namedParameters.state.sampleTable - sample table identifier for api
 * @category Statistics
 */
export async function getSequencerStatistics ({ commit, state: { sampleTable } }: { commit: (mutation: string, params: object) => void; state: State }): Promise<void> {
  return new Promise((resolve, reject) => {
    api.get(`/api/v2/${sampleTable}?aggs=x==sequencer;distinct==externalSampleID`)
      .then(function (response: { aggs: { matrix: Array<number[]>; xLabels: string[] } }) {
        const Aggregates = response.aggs
        commit('setSequencerStatisticsSeries', Array.from(Aggregates.matrix, (x: number[]) => x[0]))
        commit('setSequencerStatisticsLabels', Aggregates.xLabels)
        resolve()
      })
      .catch(() => {
        reject(new Error(`Failed retieving sequencer statistics from ${sampleTable}`))
      })
  })
}

/**
 * retrieves the timing information from timing table for each unique machine
 *
 * See:
 * * [[getMachineData]]
 * * [[getPipelineData]]
 * @param __namedParameters - vuex instance
 * @param __namedParameters.dispatch - calls to actions
 * @param __namedParameters.state - application state
 * @param __namedParameters.state.timingTable - timing table identifier for api
 * @param  range - amount of results to get
 * @event
 * @category Runtime
 * @return Promise: resolve on sucess, reject on error
 */
export async function getTimingData ({ dispatch, state: { timingTable } }: { dispatch: (action: string, params: object | number) => void; state: State }, range: number): Promise<void> {
  return new Promise((resolve, reject) => {
    api.get(`/api/v2/${timingTable}?aggs=x==machine;distinct==unique_id`)
      .then(async function (response: { aggs: { matrix: Array<number[]>; xLabels: string[] } }) {
        let machines = response.aggs.xLabels as string[]
        machines = machines.filter((x) => { return x !== null }).sort()
        dispatch('getMachineData', { machines: machines, range: range })
      })
      .catch(() => {
        reject(new Error(`Failed retrieving machineData from ${timingTable}`))
      })
    dispatch('getPipelineData', range)
    resolve()
  })
}

/**
 * retrieves sample counts within the given range
 * @typeparam [string, string] range [startdate, enddate]
 * @param __namedParameters - vuex instance
 * @param __namedParameters.state - application state
 * @param __namedParameters.state.sampleTable - sample table identifier for api
 * @param range - array of length 2 whet startdate, and enddate
 * @category Statistics
 * @return Promise with number when resolved
 */
export async function getSamplesInDateRange ({ state: { sampleTable } }: { state: State }, range: [string, string]): Promise<number> {
  const query = `sequencingStartDate=rng=(${range[0]}, ${range[1]})`
  return api.get(`/api/v2/${sampleTable}?q=${query}&num=1`)
    .then(function (response: {total: number}) {
      return response.total
    }).catch(() => {
      return Promise.reject(new Error(`Failed retrieving data within ranges ${range[0]} - ${range[1]} from ${sampleTable}`))
    })
}

/**
 * retrieves sample numbers for the ranges; yearly, monthly, weekly, daily
 *
 * See:
 * * [[getSamplesInDateRange]]
 * * [[setYearlySampleCount]]
 * * [[setMonthlySampleCount]]
 * * [[setWeeklySampleCount]]
 * * [[setDailySampleCount]]
 * @param __namedParameters - vuex instance
 * @param __namedParameters.dispatch - calls to actions
 * @param __namedParameters.commit - calls to mutations
 * @param __namedParameters.state - application state
 * @param __namedParameters.state.sampleTable - sample table identifier for api
 * @requires createDateRange from helpers/dates
 * @requires dayMs from helpers/dates
 * @category Statistics
 * @return Promise
 */
export async function getSampleNumbers ({ dispatch, commit, state: { sampleTable } }: { dispatch: (action: string, params: object) => Promise<number>; commit: (mutation: string, params: number) => void; state: State }): Promise<void> {
  api.get(`/api/v2/${sampleTable}?num=1`)
    .then(function (response: {total: number}) {
      commit('setTotalSamples', response.total)
    })
  const now = new Date()

  dispatch('getSamplesInDateRange', createDateRange(new Date(now.getTime() - (356 * dayMs)), now)).then(function (response: number) { commit('setYearlySampleCounts', response) }) // yearly
  dispatch('getSamplesInDateRange', createDateRange(new Date(now.getTime() - (31 * dayMs)), now)).then(function (response: number) { commit('setMonthlySampleCounts', response) }) // monthly
  dispatch('getSamplesInDateRange', createDateRange(new Date(now.getTime() - (7 * dayMs)), now)).then(function (response: number) { commit('setWeeklySampleCounts', response) }) // weekly
  dispatch('getSamplesInDateRange', createDateRange(new Date(now.getTime() - (dayMs)), now)).then(function (response: number) { commit('setDailySampleCounts', response) }) // daily
}

/**
 * retrieves sample counts for the last year
 *
 * gets sample sequenced counts from last year, then saves them to state [[setSequencedSampleNumbers]]
 *
 * Uses [[formatDate]] to create a date string that complies with api
 * @param __namedParameters - vuex instance
 * @param __namedParameters.commit - calls to mutations
 * @param __namedParameters.state - application state
 * @param __namedParameters.state.sampleTable - sample table identifier for api
 * @requires formatDate from helpers/dates
 * @category Statistics
 */
export async function getLastYearSampleSequencedNumbers ({ commit, state: { sampleTable } }: { commit: (mutation: string, params: object) => void; state: State }): Promise<void> {
  return new Promise((resolve, reject) => {
    const Now = new Date()
    const lastYear = formatDate(new Date(Now.getTime() - (375 * dayMs)))

    api.get(`/api/v2/${sampleTable}?aggs=x==sequencingStartDate;distinct==externalSampleID&q=sequencingStartDate=ge=${lastYear}`)
      .then(function (result: {aggs: {matrix: number[][]; xLabels: string[]}}) {
        const resultedData = { counts: [] as number[], labels: [] as string[] }
        resultedData.counts = Array.from(result.aggs.matrix, (nestedNumber: number[]) => nestedNumber[0])
        resultedData.labels = result.aggs.xLabels
        commit('setSequencedSampleNumbers', resultedData)
        resolve()
      })
      .catch(() => {
        reject(new Error(`Failed retrieving last years sequenced sample numbers from ${sampleTable}`))
      })
  })
}
/**
 * retrieves comments for the given project
 * @param __namedParameters - vuex instance
 * @param __namedParameters.state - application state
 * @param __namedParameters.state.projectsTable - projects table identifier for api
 * @param project - project id
 * @category TrackAndTrace
 * @return Promise with comment data
 */
export async function getProjectComment ({ state: { projectsTable } }: { state: State }, project: string): Promise<string> {
  return api.get(`/api/v1/${projectsTable}/${project}/comment`)
}
/**
 * pushes a new comment to database for the given project
 * @param __namedParameters0 - vuex instance
 * @param __namedParameters0.state - application state
 * @param __namedParameters0.state.projectsTable - projects table identifier for api
 * @param __namedParameters1 - function arguments
 * @param __namedParameters1.project - project id
 * @param __namedParameters1.comment - new comment content
 * @category TrackAndTrace
 */
export async function updateProjectComment ({ state: { projectsTable } }: { state: State }, { project, comment }: { project: string; comment: string }): Promise<void> {
  return api.put(`/api/v1/${projectsTable}/${project}/comment`, { body: JSON.stringify(comment) })
}
/**
 * handles new comment submit from user
 *
 * If comment has been validated, checks for updates in the database [[checkForCommentUpdates]]
 *
 * @param __namedParameters0 - vuex instance
 * @param __namedParameters0.dispatch - calls to actions
 * @param __namedParameters1.project - project id
 * @param __namedParameters1.oldComment - locally stored comment
 * @param __namedParameters1.newComment - comment user wants to change it to
 * @param __namedParameters1.validation - if the comment was validated by the form
 * @category TrackAndTrace
 * @return Promise with message
 */
export async function handleCommentSubmit ({ dispatch }: { dispatch: (action: string, params: object) => Promise<string> }, { project, oldComment, newComment, validation }: {project: string; oldComment: string; newComment: string; validation: boolean }): Promise<string> {
  return new Promise((resolve, reject) => {
    if (validation) {
      dispatch('checkForCommentUpdates', { project: project, oldComment: oldComment, newComment: newComment }).then((resolveMessage: string) => { resolve(resolveMessage) }, (reason: string) => { reject(reason) })
    } else {
      reject(new Error('Comment is invalid'))
    }
  })
}

/**
 * Queries database to check if the new comment was not updated by another user
 *
 * If the comment is not updated in the database, new comment is pushed by calling [[updateProjectComment]]
 *
 * See [[updateProjectComment]]
 * @param __namedParameters0 - vuex instance
 * @param __namedParameters0.dispatch - calls to actions
 * @param __namedParameters0.state - application state
 * @param __namedParameters.state.projectsTable - projects table identifier for api
 * @param __namedParameters1 - function parameters
 * @param __namedParameters1.project - project id
 * @param __namedParameters1.oldComment - locally stored comment
 * @param __namedParameters1.newComment - comment content user wants to change
 * @category TrackAndTrace
 */
export async function checkForCommentUpdates ({ commit, dispatch, state: { projectsTable, loadedProjectInfo } }: { commit: (mutation: string, params: object) => void; dispatch: (action: string, params: object) => Promise<object>; state: State }, { project, oldComment, newComment }: { project: string; oldComment: string; newComment: string }): Promise<string> {
  return new Promise((resolve, reject) => {
    api.get(`/api/v1/${projectsTable}/${project}/comment`)
      .then((result: { href: string; comment: string }) => {
        if (!result.comment || result.comment === oldComment) {
          dispatch('updateProjectComment', { project: project, comment: newComment }).then(() => {
            commit('addNewProjectInfo', {comment: newComment, project: project, samples: loadedProjectInfo[project] ? loadedProjectInfo[project].samples : [] as Sample[]})
          })
          resolve('dispatched comment to database')
        } else {
          reject(new Error('Could not update comment, updated by other user'))
        }
      })
      .catch(() => {
        reject(new Error('Network error occured'))
      })
  })
}

/**
 * Converts raw data from database to data objects usable by the application
 *
 * First converts projects by calling [[convertProjects]] then converts raw runs by calling [[constructRunObjects]] and finally updates finished status of runs [[updateFinishedRuns]]
 *
 * See [[getTrackerData]]
 * @param __namedParameters - vuex instance
 * @param __namedParameters.dispatch - calls to actions
 * @param __namedParameters.commit - calls to mutations
 * @param __namedParameters.getters - state getters
 * @param __namedParameters.getters.getFinishedRuns - string array with finished runs
 * @category TrackAndTrace
 * @return Promise: always resolves
 */
export async function convertRawData ({ dispatch }: { dispatch: (action: string, params: object) => Promise<Record<string, ProjectData[]>> }, { runs, projects }: {runs: RunDataObject[]; projects: ProjectDataObject[]}): Promise<void> {
  return new Promise((resolve) => {
    dispatch('convertProjects', projects).then((result: Record<string, ProjectData[]>) => {
      Promise.all([dispatch('constructRunObjects', { runs: runs, projects: result }), dispatch('getProjectDates', result)]).then(() => {
        resolve()
      })
    })
  })
}

/**
 * Converts [[projectDataObject]] array in the store to [[ProjectObject]] Array and calls mutation [[setProjectObjects]]
 *
 * When calld the raw data objects will be converterd to usable projectObjects. when converstion is complete saves it to the state.
 *
 * See [[convertRawData]]
 * @param __namedParameters - vuex instance
 * @param __namedParameters.commit - calls to mutations
 * @param __namedParameters.state - application state
 * @param __namedParameters.state.projects - raw project objects
 * @param __namedParameters.getters - state getters
 * @param __namedParameters.getters.getJobsByProjectID - function that returns Jobs of given projects
 * @requires ProjectObject from types/dataTypes
 * @requires projectDataObject from types/dataTypes
 * @requires Job from types/dataTypes
 * @category TrackAndTrace
 * @return Promise, always resolves
 */
export async function convertProjects ({ state: { jobAggregates } }: {state: State}, projects: ProjectDataObject[]): Promise<Record<string, ProjectData[]>> {
  return new Promise((resolve) => {
    const mappedProjects: Record<string, ProjectData[]> = {}
    projects.forEach((project: ProjectDataObject) => {
      const runID = project.run_id
      if (!(runID in mappedProjects)) { // if runID doesn't have an entry, make one
        mappedProjects[runID] = [] as ProjectData[]
      }

      mappedProjects[runID].push(new ProjectData(project.project, parseStatus(project.copy_results_prm), jobAggregates[project.project], !!project.comment))
    })

    resolve(mappedProjects)
  })
}

/**
 * converts [[RunDataObject]] from overview table to [[Run]] object array and calls [[setRunObjects]] mutation
 *
 * When conversion of run data is complete, saves them to state
 *
 * See [[convertRawData]]
 * @param __namedParameters - vuex instance
 * @param __namedParameters.commit - calls to mutations
 * @param __namedParameters.state - application state
 * @param __namedParameters.state.runs - raw run objects
 * @param __namedParameters.getters - state getters
 * @param __namedParameters.getters.getProjectsByRunID - returns projects belonging to given run
 * @requires countJobStatus from helpers/utils
 * @requires Run from types/dataTypes
 * @category TrackAndTrace
 * @return Promise: always resolves
 */
export async function constructRunObjects ({ commit }: { commit: (mutation: string, params: object) => void}, { runs, projects }: {runs: RunDataObject[]; projects: Record<string, ProjectData[]>}): Promise<void> {
  return new Promise((resolve) => {
    const RunsV2: Record<string, RunData> = {}
    runs.forEach(({ run_id, demultiplexing, copy_raw_prm }) => {
      const projectData = projects[run_id] ? projects[run_id] : []
      const running = { finished: 0, started: 0, waiting: 0 }
      const copying = { finished: 0, started: 0, waiting: 0 }
      projectData.forEach(project => {
        const status = project.getStatus()
        if (status === statusCode.finished) {
          running.finished += 1
        } else if (status === statusCode.started || status === statusCode.error) {
          running.started += 1
        } else {
          running.waiting += 1
        }
        const resultsCopyStatus = project.resultCopyStatus
        if (resultsCopyStatus === statusCode.finished) {
          copying.finished += 1
        } else if (resultsCopyStatus === statusCode.started || resultsCopyStatus === statusCode.error) {
          copying.started += 1
        } else {
          copying.waiting += 1
        }
      })

      const finished = {
        total: projectData.length, finished: copying.finished
      }
      RunsV2[run_id] = new RunData(projectData, constructSteps(parseStatus(demultiplexing), parseStatus(copy_raw_prm), running, copying, finished))
    })
    commit('setRunV2s', RunsV2)
    resolve()
  })
}

/**
 * Gets all job status numbers from api
 * 
 * commits a Record<string, {started: number, waiting: number, Error: number, finished: number}> with the job status counts
 * 
 * @param __namedParameters - vuex instance
 * @param __namedParameters.commit - mutations
 * @param __namedParameters.state - application state
 * @param __namedParameters.state.jobTable - job table api location
 * 
 * @throws {Error} when data couldn't be fetched
 * @category TrackAndTrace
 * @returns {Promise<void>}
 */
export async function getJobAggregates ({ commit, state: { jobTable } }: {commit: (mutation: string, params: object) => void; state: State}): Promise<void> {
  return new Promise((resolve, reject) => {
    api.get(`/api/v2/${jobTable}?aggs=x==status;y==project;distinct==project_job`)
      .then((result: {aggs: {matrix: number[][]; xLabels: string[]; yLabels: string[]}}) => {
        const projectCounters: Record<string, JobCounts> = {}
        result.aggs.yLabels.forEach((project: string, index: number) => {
          const statusType: JobCounter = new JobCounter({ waiting: 0, started: 0, finished: 0, error: 0 })
          result.aggs.xLabels.forEach((status, xLabelIndex) => {
            statusType[parseStatus(status)] = result.aggs.matrix[xLabelIndex][index]
          })
          projectCounters[project] = statusType
        })
        commit('setJobAggregates', projectCounters)
        resolve()
      }).catch(() => {
        reject(new Error(`Failed retrieving job aggragates from ${jobTable}`))
      })
  })
}

/**
 * Gets a started or finished date for a project
 * 
 * @param __namedParameters - vuex instance
 * @param __namedParameters.state - application state
 * @param __namedParameters.state.jobTable - job table api location
 * @param __namedParameters0 - function params
 * @param __namedParameters0.projectID - project id to get dates for
 * @param __namedParameters0.type - date type to get: started or finished date
 * 
 * @throws {Error} when data couldn't be fetched
 * @category TrackAndTrace
 * @returns {Promise<Date>}
 */
export async function getDate ({ state: { jobTable } }: {state: State}, { projectID, type }: {projectID: string; type: dateSearch}): Promise<Date> {
  return new Promise((resolve, reject) => {
    api.get(`/api/v2/${jobTable}?attrs=project_job,${type}&sort=${type}:${type === dateSearch.started ? 'asc' : 'desc'}&num=1&q=project=='${projectID}';${type}!=''`).then((result: {items: {started_date: string; finished_date: string}[]}) => {
      if (result.items.length === 0) {
        resolve(undefined)
      }
      const date = result.items[0][type]
      resolve(date ? new Date(date) : undefined)
    }).catch((error: Error) => {
      reject(error)
    })
  })
}

/**
 * Gets the started and if its finished the finished date of a project and commits them to state
 * 
 * See
 * * [[getDate]]
 * 
 * @param __namedParameters - vuex instance
 * @param __namedParameters.state - application state
 * @param __namedParameters.state.jobAggregates - job status counts
 * @param __namedParameters.dispatch - actions
 * @param __namedParameters.commit - mutations
 * @category TrackAndTrace
 */
export async function getProjectDates ({ state: { jobAggregates }, dispatch, commit }: {state: State; dispatch: (action: string, params: object) => Promise<Date>; commit: (mutation: string, params: object) => void}): Promise<void> {
  Object.keys(jobAggregates).forEach((projectID) => {
    const jobs = jobAggregates[projectID]
    if (jobs.getStatus() === statusCode.finished) {
      Promise.all([dispatch('getDate', { projectID: projectID, type: dateSearch.started }), dispatch('getDate', { projectID: projectID, type: dateSearch.finished })]).then(
        (result) => { commit('updateProjectDates', { projectID: projectID, startedDate: result[0], finishedDate: result[1] }) }
      )
    } else if (jobs.getStatus() === statusCode.started || jobs.getStatus() === statusCode.error) {
      dispatch('getDate', { projectID: projectID, type: dateSearch.started }).then(
        (result: Date) => { commit('updateProjectDates', { projectID: projectID, startedDate: result, finishedDate: undefined }) }
      )
    }
  })
}

/**
 * Loads Extra project details when needed
 * @param param0 - state data
 * @param param0.projectsTable - project table location
 * @param param0.sampleTable - Sample stable location
 * @param projectID - Project to get the info for
 * @category TrackAndTrace
 * @returns project comment and samples
 */
export async function getExtraProjectInfo ({ state: { projectsTable, sampleTable }, commit }: {state: State; commit: (mutation: string, params: object) => void}, projectID: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const comment = api.get(`/api/v2/${projectsTable}/${projectID}?attrs=comment`)
    const samples = api.get(`/api/v2/${sampleTable}?attrs=lane,sequencer,Gender,archiveLocation&q=project=='${projectID}'`)

    Promise.all([comment, samples]).then(
      (results: [{comment?: string}, {items: SampleResponse[]}]) => {
        const comment = results[0].comment ? results[0].comment : ''
        const sampleInfo = results[1].items.map((sample) => {
          return new Sample(sample)
        })
        commit('addNewProjectInfo', { project: projectID, comment: comment, samples: sampleInfo })
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
  })
}

/**
 * Gets the most recent pings of the clusters to display in ServerStatus
 * 
 * @param __namedParameters - vuex instance
 * @param __namedParameters.state - application state
 * @param __namedParameters.state.clusterTable - api cluster table location
 * 
 * @category TrackAndTrace
 * @returns {Promise<void>} 
 */
export async function getClusterPings ({ state: { clusterTable }, commit }: {state: State; commit: (mutation: string, params: object) => void}): Promise<void> {
  return new Promise((resolve, reject) => {
    api.get(`/api/v2/${clusterTable}`).then((result: {items: {cluster_name: string; latest_ping_timestamp: string}[]}) => {
      commit('updateClusterPings', result.items)
      resolve()
    }).catch((error: Error) => {
      reject(error)
    })
  })
}

/**
 * Gets the duration statistics from the timing table and builds the series
 * 
 * @param __namedParameters - vuex instance
 * @param __namedParameters.state - application state
 * @param __namedParameters.state.timingTable - timing table api location
 * @param __namedParameters.commit - mutations
 * 
 * @category Statistics
 * @returns {Promise<void>} 
 */
export async function getDurationStatistics ({ state: { timingTable }, commit }: {state: State; commit: (mutation: string, params: object) => void}): Promise<void> {
  return new Promise((resolve, reject) => {
    api.get(`/api/v2/${timingTable}?attrs=unique_id,total_min,copyProjectDataToPrmTiming,pipelineDuration,copyRawDataToPrmDuration,finishedTime&q=total_min=gt=0&num=10000&sort=finishedTime:asc`)
      .then((result: {items: RawDurationStatistics[]}) => {
        const pipelineTypeIDRegex = /-[a-zA-Z]+_[vV]\d+/g
        const isolatedPipelineTypeRegEx = /[a-z]+/i
        const durationStatistics: Record<string, DurationStatisticsStorage> = {}
        const TimeSeries: Record<string, Record<string, number>> = {}

        result.items.forEach(({ unique_id, copyRawDataToPrmDuration, pipelineDuration, copyProjectDataToPrmTiming, finishedTime }) => {
          const parsedIDArray = unique_id.match(pipelineTypeIDRegex)
          const firstParsedID = parsedIDArray ? parsedIDArray[0] : undefined
          const pipelineTypeMatchArray = firstParsedID ? firstParsedID.match(isolatedPipelineTypeRegEx) : undefined
          const pipelineType = pipelineTypeMatchArray ? pipelineTypeMatchArray[0] : 'Other'

          const date = formatDate(new Date(finishedTime))
          if (!TimeSeries[date]) {
            TimeSeries[date] = {}
          }
          if (!TimeSeries[date][pipelineType]) {
            TimeSeries[date][pipelineType] = 0
            TimeSeries[date][pipelineType + 'Times'] = 0
          }
          TimeSeries[date][pipelineType] += pipelineDuration
          TimeSeries[date][pipelineType + 'Times'] += 1
          if (!durationStatistics[pipelineType]) {
            durationStatistics[pipelineType] = new DurationStatisticsStorage()
          }
          durationStatistics[pipelineType].addStatistic(copyRawDataToPrmDuration, pipelineDuration, copyProjectDataToPrmTiming)
        })
        commit('setDurationStatistics', durationStatistics)
        commit('setTimingStatistics', TimeSeries)
        resolve()
      }).catch((error: Error) => {
        reject(error)
      })
  })
}

export default {
  checkForCommentUpdates,
  constructRunObjects,
  convertProjects,
  convertRawData,
  getLastYearSampleSequencedNumbers,
  getMachineData,
  getPipelineData,
  getProjectComment,
  getProjectData,
  getRunData,
  getSampleNumbers,
  getSamplesInDateRange,
  getSequencerStatistics,
  getTimingData,
  getTrackerData,
  handleCommentSubmit,
  updateProjectComment,
  getJobAggregates,
  getDate,
  getProjectDates,
  getClusterPings,
  getDurationStatistics,
  getExtraProjectInfo
}
