/**
 * @module store
 */

import { State } from '@/store/state'
import { RunDataObject, projectDataObject, Job, ProjectObject, Run } from '@/types/dataTypes'
import { Serie, IdentifiedSerie } from '@/types/graphTypes'
// @ts-ignore
import api from '@molgenis/molgenis-api-client'
import { createDateRange, formatDate, dayMs } from '@/helpers/dates'
import { countJobStatus, countProjectFinishedCopying, getProjectDataStatus } from '@/helpers/utils';

/**
 * 
 * Calls all actions that recieves and converts Track and trace data
 * See [[getRunData]],
 * [[getProjectData]],
 * [[getJobData]],
 * [[convertRawData]]
 * @event
 * @category TrackAndTrace
 * @return {Promise<void>}
 */
function getTrackerData ({ dispatch }: { dispatch: any }): Promise<void> {
  return new Promise((resolve, reject) => {
    Promise.all([dispatch('getRunData'), dispatch('getProjectData'), dispatch('getJobData')])
    .then(() => {
      dispatch('convertRawData')
      resolve()
    })
    .catch(() => {
      reject('Could not retrieve Track&Trace data from MOLGENIS!')
    })
  })
}

  /**
 * retrieves run data from overview table and commits changes to state
 * See [[getTrackerData]]
 * @category TrackAndTrace
 * @return {Promise<void>}
 */
async function getRunData({ commit, state }: {commit: any, state: State}): Promise<void> {
  return new Promise((resolve, reject) => {
  api.get(`/api/v2/${state.overviewTable}?num=10000`)
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
 * See [[getTrackerData]]
 * @category TrackAndTrace
 * @returns {Promise<void>}
 */
async function getJobData({ commit, state }: {commit: any, state: State}): Promise<void> {
  return new Promise((resolve, reject) => {
    api.get(`/api/v2/${state.jobTable}?num=10000`)
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
 * @param machines - array of machine id's
 * @param range - number of responses to get
 * @category Runtime
 * @return Promise: resolve when sucessful, reject when not
 */
async function getMachineData ({ commit, state }: { commit: any, state: State }, { machines, range }: { machines: string[], range: number }): Promise<void> {
  return new Promise((resolve, reject) => {
    let machineSeriesGrouped: Record<string, IdentifiedSerie[]> = {}
    machines.forEach(async (machine: string) => {
      state.pipelineTypes.forEach(async (pipelineType: string) => {
        if (!Object.keys(machineSeriesGrouped).includes(pipelineType)) {
          machineSeriesGrouped[pipelineType] = [] as IdentifiedSerie[]
        }
        let query = `machine==${machine};total_hours=gt=0;project=like=${pipelineType}`
        api.get(`/api/v2/${state.timingTable}?num=${range}&sort=finishedTime:desc&q=${query}`)
          .then(function (response: { items: Object[] }) {
            if (response.items.length > 0) {
              machineSeriesGrouped[pipelineType].push(new IdentifiedSerie(machine, Array.from(response.items, (x:any) => { return { projectID: x.project, number: x.total_hours} })))
            }
          })
          .catch(function (error: any) {
            reject(error)
          })
      })
    })
    commit('setMachineRuntimes', machineSeriesGrouped)

    resolve()
})
}

/**
 * retrieves pipeline data from timing table and commits changes to state
 * @param range - number of records to retrieve
 * @category Runtime
 * @return Promise: resolve on sucess, reject on error
 */
async function getPipelineData ({ commit, state }: { commit:any, state: State }, range: number): Promise<void> {
  let pipelineSeries: Serie[] = []

  state.pipelineTypes.map(async (pipelineType: string) => {
    let query = `project=like=${pipelineType};total_hours=gt=0`
    api.get(`/api/v2/${state.timingTable}?num=${range}&sort=finishedTime:desc&q=${query}`)
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
 * @category Statistics
 */
async function getSequencerStatistics ({ commit, state }: { commit: any, state: State }): Promise<void> {
  api.get(`/api/v2/${state.sampleTable}?aggs=x==sequencer;distinct==externalSampleID`)
    .then(function (response: { aggs: { matrix: Array<number[]>, xLabels: string[] } }) {
      const Aggregates = response.aggs
      commit('setSequencerStatisticsSeries', Array.from(Aggregates.matrix, (x: number[]) => x[0]))
      commit('setSequencerStatisticsLabels', Aggregates.xLabels)
    })
    .catch(function (error: any) {
      console.error(error)
    })
}


/**
 * retrieves the timing information from timing table for each unique machine
 * See [[getMachineData]]
 * See [[getPipelineData]]
 * @param  range - amount of results to get
 * @event
 * @category Runtime
 * @return Promise: resolve on sucess, reject on error
 */
async function getTimingData ({ dispatch, state }: { dispatch: any, state: State }, range: number): Promise<void> {
  return new Promise((resolve, reject) => {
    api.get(`/api/v2/${state.timingTable}?aggs=x==machine;distinct==unique_id`)
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
 * @param range - array of length 2 whet startdate, and enddate
 * @category Statistics
 * @return Promise with number when resolved
 */
async function getSamplesInDateRange ({ state }: { state: State }, range: [string, string]): Promise<number> {
  const query = `sequencingStartDate=rng=(${range[0]}, ${range[1]})`
  return api.get(`/api/v2/${state.sampleTable}?q=${query}&num=1`)
    .then(function (response: any) {
      const responseJson = response.json()
      return responseJson.total
    }).catch(function (error: any) {
      return Promise.reject(error)
    })
}

/**
 * retrieves sample numbers for the ranges; yearly, monthly, weekly, daily
 * See [[getSamplesInDateRange]]
 * @category Statistics
 * @return Promise
 */
async function getSampleNumbers ({ commit, state }:{ commit: any, state: State }): Promise<void> {
  api.get(`/api/v2/${state.sampleTable}?num=1`)
    .then(function (response: any) {
      commit('setTotalSamples', response.json().total)
    })
  const now = new Date()

  getSamplesInDateRange({ state: state }, createDateRange(new Date(now.getTime() - (356 * dayMs)), now)).then(function (response: number) { commit('setYearlySampleCounts', response) })
  getSamplesInDateRange({ state: state }, createDateRange(new Date(now.getTime() - (31 * dayMs)), now)).then(function (response: number) { commit('setMonthlySampleCounts', response) })
  getSamplesInDateRange({ state: state }, createDateRange(new Date(now.getTime() - (7 * dayMs)), now)).then(function (response: number) { commit('setWeeklySampleCounts', response) })
  getSamplesInDateRange({ state: state }, createDateRange(new Date(now.getTime() - (dayMs)), now)).then(function (response: number) { commit('setDailySampleCounts', response) })
}

/**
 * retrieves sample counts for the last year
 * @param __namedParameters - Object
 * @category Statistics
 */
async function getLastYearSampleSequencedNumbers ({ commit, state }: { commit: any, state: State }): Promise<void> {
  const Now = new Date()
  const lastYear = formatDate(new Date(Now.getTime() - (375 * dayMs)))

  api.get(`/api/v2/${state.sampleTable}?aggs=x==sequencingStartDate;distinct==externalSampleID&q=sequencingStartDate=ge=${lastYear}`)
    .then(function (result: any) {
      let resultedData = { counts: [] as number[], labels: [] as string[] }
      resultedData.counts = Array.from(result.aggs.matrix, (nestedNumber: number[]) => nestedNumber[0])
      resultedData.labels = result.aggs.xLabels
      commit('setSequnecedSampleNumbers', resultedData)
    })
    .catch(function (error: any) {
      console.error(error)
    })
}
/**
 * retrieves comments for the given project
 * @param project - project to get comment for 
 * @category TrackAndTrace
 * @return Promise
 */
async function getProjectComment ({ state }: { state: State }, project: string): Promise<any> {
  return api.get(`/api/v1/${state.projectsTable}/${project}/comment`)
}
/**
 * pushes a new comment to database for the given project
 * @typeparam payload {project: project ID, comment: comment-content}
 * @param payload - project id with the new comment
 * @category TrackAndTrace
 */
async function updateProjectComment ({ state }: { state: State }, { project, comment }: { project: string, comment: string }): Promise<void> {
  return api.put(`/api/v1/${state.projectsTable}/${project}/comment`, { body: JSON.stringify(comment) })
}
/**
 * handles new comment submit from user
 * See [[checkForCommentUpdates]]
 * @typeparam payload {project: project ID, oldComment: local comment, newComment: updated comment content, validation: validated ? true : false}
 * @param payload - Submit data containing project id, old comment, the updated comment and if its been validated locally
 * @category TrackAndTrace
 * @return Promise when sucessful
 */
async function handleCommentSubmit ({ dispatch }: { dispatch: any, commit: any }, { project, oldComment, newComment, validation}: {project: string, oldComment: string, newComment: string, validation: boolean }): Promise<string> {
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
 * See [[updateProjectComment]]
 * @typeparam payload {project: project ID, oldComment: local comment, newComment: updated comment content}
 * @param payload - project id, old comment, locally updated comment
 * @category TrackAndTrace
 * @returns Promise, resolves when sucessful
 */
async function checkForCommentUpdates({ dispatch, state }: { dispatch: any, state: State }, {project, oldComment, newComment}: { project: string, oldComment: string, newComment: string }): Promise<string> {
  return new Promise((resolve, reject) => {
    api.get(`/api/v1/${state.projectsTable}/${project}/comment`)
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
 * See [[getTrackerData]]
 * @category TrackAndTrace
 * @return Promise: resolves always, when done
 */
async function convertRawData({ dispatch, commit, getters }: { dispatch: any, commit: any, getters: any }) {
  return new Promise((resolve) => {
    dispatch('convertProjects').then(() => {
      dispatch('constructRunObjects').then(() => {
        commit('updateFinishedRuns', getters.getFinishedRuns)
        resolve()
      })
    })
})
}

/**
 * converts raw project data to ProjectObjects and commits them to state
 * See [[convertRawData]]
 * @category TrackAndTrace
 * @return Promise: resolves always, when done
 */
async function convertProjects({ commit, state, getters }: { commit: any, state: State, getters: any}) {
  return new Promise((resolve) => {
    let mappedProjects: Record<string, ProjectObject[]> = {}
    state.projects.forEach((project: projectDataObject) => {
      const runID = project.run_id
      if (!(runID in mappedProjects)) {
        mappedProjects[runID] = [] as ProjectObject[]
      }
      const projectJobs: Job[] = getters.getJobsByProjectID(project.project)
      const status = getProjectDataStatus(project, projectJobs)
      mappedProjects[runID].push(new ProjectObject(project.project, projectJobs, project.pipeline, status, project.copy_results_prm, project.comment))
    })
    commit('setProjectObjects', mappedProjects)
    resolve()
  })
}

/**
 * converts raw run data from overview table to Run objects and commits them to state
 * See [[convertRawData]]
 * @category TrackAndTrace
 * @return Promise: resolves always, when done
 */
async function constructRunObjects({ commit, state, getters }: { commit: any, state: State, getters: any}) {
  return new Promise((resolve) => {
    const Runs = state.runs.map((run: RunDataObject) => {
      const projects = getters.getProjectsByRunID(run.run_id)
      const length = projects.length
      const errors = projects.map((project: ProjectObject) => { return countJobStatus(project.jobs, 'error')})
      const containsErrors = errors.reduce((accumulator: number, currentValue: number) => accumulator + currentValue) >= 1
      return new Run(run.run_id, run.demultiplexing, run.copy_raw_prm, length, containsErrors, countProjectFinishedCopying(projects))  
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
