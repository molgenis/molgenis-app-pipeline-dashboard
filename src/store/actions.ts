/**
 * @module store
 */

import state, { State } from '@/store/state'
import { RunDataObject, projectDataObject, Job, ProjectObject, Run } from '@/types/dataTypes'
import { Serie, IdentifiedSerie } from '@/types/graphTypes'
// @ts-ignore
import api from '@molgenis/molgenis-api-client'
import { createDateRange, formatDate, dayMs } from '@/helpers/dates'
import { countJobStatus, countProjectStartedCopying, getProjectDataStatus } from '@/helpers/utils';
import { max } from '@/helpers/statistics';

/**
 * 
 * Calls all actions that recieves and converts Track and trace data
 *  
 * Waits for each table to load,  then converts to usable objects
 * 
 * See: 
 * * [[getRunData]]
 * * [[getProjectData]]
 * * [[getJobData]]
 * * [[convertRawData]]
 * @event
 * @param __namedParameters - vuex instance
 * @param __namedParameters.dispatch - call to mutations
 * @category TrackAndTrace
 * @return {Promise<void>}
 */
function getTrackerData ({ commit, dispatch }: { commit: any, dispatch: any }): Promise<void> {
  return new Promise((resolve, reject) => {
    Promise.all([dispatch('getRunData'), dispatch('getProjectData'), dispatch('getJobData')])
    .then(() => {
      dispatch('convertRawData').then(() => {
        commit('clearRawData')
      }
      )
      resolve()
    })
    .catch(() => {
      reject('Could not retrieve Track&Trace data from MOLGENIS!')
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
async function getRunData({ commit, state: {overviewTable} }: {commit: any, state: State}): Promise<void> {
  return new Promise((resolve, reject) => {
  api.get(`/api/v2/${overviewTable}?num=10000`)
    .then(function (response: {items: RunDataObject[]}) {
      const tableContent = response.items
      if (tableContent.length > 0) {
        commit('setRuns', tableContent)
      }
      resolve()
    })
    .catch(function (error: any) {
      reject('Could not update runs')
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
async function getProjectData({ commit, state }: {commit: any, state: State}): Promise<void> {
  return new Promise((resolve, reject) => {
    api.get(`/api/v2/${state.projectsTable}?num=10000`)
    .then(function (response: {items: projectDataObject[]}) {
      const tableContent = response.items
      if (tableContent.length > 0) {
        commit('setProjects', tableContent)
      }
      resolve()
    })
    .catch(function (error: any) {
      reject('Could not update projects')
    })
  })
}

/**
 * retrieves jobs data from job table and commits changes to state
 * 
 * See [[getTrackerData]]
 * @param __namedParameters - vuex instance
 * @param __namedParameters.commit - call to mutations
 * @param __namedParameters.state - application state
 * @param __namedParameters.state.jobTable - job table api identifier
 * @category TrackAndTrace
 * @returns {Promise<void>}
 */
async function getJobData({ commit, state: {jobTable} }: {commit: any, state: State}): Promise<void> {
  return new Promise((resolve, reject) => {
    api.get(`/api/v2/${jobTable}?num=10000`)
    .then(function (response: {items: Job[]}) {
      const tableContent = response.items
      if (tableContent.length > 0) {
        commit('setJobs', tableContent)
      }
      resolve()
    })
    .catch(function (error: any) {
      reject('Could not update jobs')
    })
  })
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
async function getMachineData ({ commit, state: {pipelineTypes, timingTable} }: { commit: any, state: State}, { machines, range }: { machines: string[], range: number }): Promise<void> {
  return new Promise((resolve, reject) => {
    let machineSeriesGrouped: Record<string, IdentifiedSerie[]> = {}
    machines.forEach(async (machine: string) => {
      pipelineTypes.forEach(async (pipelineType: string) => {
        if (!Object.keys(machineSeriesGrouped).includes(pipelineType)) {
          machineSeriesGrouped[pipelineType] = [] as IdentifiedSerie[]
        }
        
        let query = `machine==${machine};total_hours=gt=0;project=like=${pipelineType}`
        await api.get(`/api/v2/${timingTable}?num=${range}&sort=finishedTime:desc&q=${query}`)
          .then(function (response: { items: Object[] }) {
            if (response.items.length > 0) {

              let seriesData = Array.from(response.items.reverse(), (x:any) => { return { projectID: x.project, number: x.total_hours} })
              
              machineSeriesGrouped[pipelineType].push(new IdentifiedSerie(machine, seriesData))
            }
          })
          .catch(function (error: any) {
            reject(error)
          })
          machineSeriesGrouped[pipelineType] = fillToEqualLenghts(machineSeriesGrouped[pipelineType])
      })
    })
    commit('setMachineRuntimes', machineSeriesGrouped)

    resolve()
})
}

/**
 * Finds the maximum lenght of a IdentifiedSerie array
 * @param seriesArray - array of series
 * @param length - current array lenght
 */
function findMax(seriesArray: IdentifiedSerie[], length: number): number {
  if (length === 1) {
    return seriesArray[0].getLenght()
  }
    return max(findMax(seriesArray, length - 1), seriesArray[length - 1].getLenght() )
  }

function fillToEqualLenghts(groupedData: IdentifiedSerie[]) {
    const maximum = findMax(groupedData, groupedData.length)
    const newSeries = groupedData.map((series) => {
      const nullFilledArray = new Array(maximum - series.getLenght()).fill({projectID: null, number: null})
      return series.getLenght() < maximum ? new IdentifiedSerie(name, [...nullFilledArray, ...series.combinedData]) : series
    })
  return newSeries
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
async function getPipelineData ({ commit, state: { pipelineTypes, timingTable } }: { commit:any, state: State }, range: number): Promise<void> {
  let pipelineSeries: Serie[] = []

  pipelineTypes.map(async (pipelineType: string) => {
    let query = `project=like=${pipelineType};total_hours=gt=0`
    api.get(`/api/v2/${timingTable}?num=${range}&sort=finishedTime:desc&q=${query}`)
      .then(function (response: {items: Object[]}) {
        const ResponseData = response.items
        pipelineSeries.push(new Serie(pipelineType, Array.from(ResponseData, (x: any) => Math.round(x.pipelineDuration / 60)).reverse()))
      })
      .catch(function (error: any) {
        console.error(error)
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
async function getSequencerStatistics ({ commit, state: {sampleTable} }: { commit: any, state: State }): Promise<void> {
  return new Promise((resolve, reject) => {
    api.get(`/api/v2/${sampleTable}?aggs=x==sequencer;distinct==externalSampleID`)
      .then(function (response: { aggs: { matrix: Array<number[]>, xLabels: string[] } }) {
        const Aggregates = response.aggs
        commit('setSequencerStatisticsSeries', Array.from(Aggregates.matrix, (x: number[]) => x[0]))
        commit('setSequencerStatisticsLabels', Aggregates.xLabels)
        resolve()
      })
      .catch(function (error: any) {
        reject(error)
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
async function getTimingData ({ dispatch, state: {timingTable} }: { dispatch: any, state: State }, range: number): Promise<void> {
  return new Promise((resolve, reject) => {
    api.get(`/api/v2/${timingTable}?aggs=x==machine;distinct==unique_id`)
      .then(async function (response: { aggs: { matrix: Array<number[]>, xLabels: string[] } }) {
        let machines = response.aggs.xLabels as string[]
        machines = machines.filter((x) => { return x !== null }).sort()
        dispatch('getMachineData', { machines: machines, range: range })
      })
      .catch(function (error: any) {
        reject(error)
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
async function getSamplesInDateRange ({ state: {sampleTable} }: { dispatch: any, state: State }, range: [string, string]): Promise<number> {
  const query = `sequencingStartDate=rng=(${range[0]}, ${range[1]})`
  return api.get(`/api/v2/${sampleTable}?q=${query}&num=1`)
    .then(function (response: any) {
      const responseJson = response.json()
      return responseJson.total
    }).catch(function (error: any) {
      return Promise.reject(error)
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
async function getSampleNumbers ({ dispatch, commit, state: {sampleTable} }:{ dispatch: any, commit: any, state: State }): Promise<void> {
  api.get(`/api/v2/${sampleTable}?num=1`)
    .then(function (response: any) {
      commit('setTotalSamples', response.json().total)
    })
  const now = new Date()

  dispatch('getSamplesInDateRange', createDateRange(new Date(now.getTime() - (356 * dayMs)), now)).then(function (response: number) { commit('setYearlySampleCounts', response) }) // yearly
  dispatch('getSamplesInDateRange', createDateRange(new Date(now.getTime() - (31 * dayMs)), now)).then(function (response: number) { commit('setMonthlySampleCounts', response) }) //monthly
  dispatch('getSamplesInDateRange', createDateRange(new Date(now.getTime() - (7 * dayMs)), now)).then(function (response: number) { commit('setWeeklySampleCounts', response) }) // weekly
  dispatch('getSamplesInDateRange', createDateRange(new Date(now.getTime() - (dayMs)), now)).then(function (response: number) { commit('setDailySampleCounts', response) }) //daily
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
async function getLastYearSampleSequencedNumbers ({ commit, state: {sampleTable} }: { commit: any, state: State }): Promise<void> {
  return new Promise((resolve, reject) => {
    const Now = new Date()
    const lastYear = formatDate(new Date(Now.getTime() - (375 * dayMs)))

    api.get(`/api/v2/${sampleTable}?aggs=x==sequencingStartDate;distinct==externalSampleID&q=sequencingStartDate=ge=${lastYear}`)
      .then(function (result: any) {
        let resultedData = { counts: [] as number[], labels: [] as string[] }
        resultedData.counts = Array.from(result.aggs.matrix, (nestedNumber: number[]) => nestedNumber[0])
        resultedData.labels = result.aggs.xLabels
        commit('setSequencedSampleNumbers', resultedData)
        resolve()
      })
      .catch(function (error: any) {
        reject(error)
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
async function getProjectComment ({ state: {projectsTable} }: { state: State }, project: string): Promise<string> {
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
async function updateProjectComment ({ state: {projectsTable} }: { state: State }, { project, comment }: { project: string, comment: string }): Promise<void> {
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
async function handleCommentSubmit ({ dispatch }: { dispatch: any }, { project, oldComment, newComment, validation}: {project: string, oldComment: string, newComment: string, validation: boolean }): Promise<string> {
  return new Promise((resolve, reject) => {
    if (validation) {
      dispatch('checkForCommentUpdates', { project: project, oldComment: oldComment, newComment: newComment }).then((resolveMessage: string) => { resolve(resolveMessage) }, (reason: string) => { reject(reason) })
    } else {
      reject('Comment is invalid')
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
async function checkForCommentUpdates({ dispatch, state: {projectsTable} }: { dispatch: any, state: State }, {project, oldComment, newComment}: { project: string, oldComment: string, newComment: string }): Promise<string> {
  return new Promise((resolve, reject) => {
    api.get(`/api/v1/${projectsTable}/${project}/comment`)
    .then((result: { href: string, comment: string }) => {
      console.log(result.comment, oldComment, newComment)
      if (!result.comment || result.comment === oldComment) {
        dispatch('updateProjectComment', { project: project, comment: newComment })
        resolve('dispatched comment to database')
      } else {
        reject('Could not update comment, updated by other user')
      }
      
    })
    .catch((error: any) => {
      reject('Network error occured')
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
async function convertRawData({ dispatch, commit, getters: {getFinishedRuns} }: { dispatch: any, commit: any, getters: any }) {
  return new Promise((resolve) => {
    dispatch('convertProjects').then(() => {
      dispatch('constructRunObjects').then(() => {
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
async function convertProjects({ commit, state: { projects }, getters: { getJobsByProjectID } }: { commit: any, state: State, getters: any}) {
  return new Promise((resolve) => {
    let mappedProjects: Record<string, ProjectObject[]> = {}
    projects.forEach((project: projectDataObject) => {
      const runID = project.run_id
      if (!(runID in mappedProjects)) { // if runID doesn't have an entry, make one
        mappedProjects[runID] = [] as ProjectObject[]
      }
      const projectJobs: Job[] = getJobsByProjectID(project.project)
      const status = getProjectDataStatus(project, projectJobs)
      mappedProjects[runID].push(new ProjectObject(project.project, projectJobs, project.pipeline, status, project.copy_results_prm, project.comment))
    })
    commit('setProjectObjects', mappedProjects)
    resolve()
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
async function constructRunObjects({ commit, state: { runs, projectObjects }, getters: { getProjectsByRunID } }: { commit: any, state: State, getters: any}) {
  return new Promise((resolve) => {
    const Runs = runs.map(({run_id, demultiplexing, copy_raw_prm}) => {
      let projects = getProjectsByRunID(run_id)
      if (!projects) {
        projects = []
      }
      function processErrors (projects: ProjectObject[], demultiplexing: string, rawDataStatus: string) {
        const errors = projects.map((project: ProjectObject) => { return countJobStatus(project.jobs, 'error')})
        const errorsInJobs =  errors.length > 0 ? errors.reduce((accumulator: number, currentValue: number) => accumulator + currentValue) >= 1 : false
        const errorsInDemultiplexing = demultiplexing === 'error'
        const errorsInRawCopy = rawDataStatus === 'error'
        return errorsInJobs || errorsInDemultiplexing || errorsInRawCopy
      }
      const length = projects.length
      
      const resultCopyStatus = countProjectStartedCopying(projects)

      return new Run(run_id, demultiplexing, copy_raw_prm, length, processErrors(projects, demultiplexing, copy_raw_prm ), resultCopyStatus.total, resultCopyStatus.finished)  
    })
    commit('setRunObjects', Runs)
    resolve()
  })
}

export default {
  checkForCommentUpdates,
  constructRunObjects,
  convertProjects,
  convertRawData,
  getJobData,
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
  updateProjectComment
}
