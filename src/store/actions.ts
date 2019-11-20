import axios from 'axios'
import { State } from './state'
import { pipelineType, RunDataObject, projectDataObject, Job, ProjectObject, Run } from '@/types/dataTypes'
import { Serie } from '@/types/graphTypes'
// @ts-ignore
import api from '@molgenis/molgenis-api-client'
import { createDateRange, formatDate, dayMs } from '@/helpers/dates'
import { countJobStatus, countProjectFinishedCopying, getProjectDataStatus } from '@/helpers/utils';

export default {
  /**
   * Gets data from MOLGENIS database for Track and trace
   */
  async getTrackerData ({ dispatch }: { dispatch: any }) {
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
  },

  async getRunData({ commit, state }: {commit: any, state: State}) {
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
  },

  async getProjectData({ commit, state }: {commit: any, state: State}) {
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
  },

  async getJobData({ commit, state }: {commit: any, state: State}) {
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
  },

  /**
   * Gets the runtime data for each given machine
   *
   * @param machines - array of machine id's
   *
   */
  async getMachineData ({ commit, state }: { commit: any, state: State }, { machines, range }: { machines: string[], range: number }) {
    return new Promise((resolve, reject) => {
      let sampleCounts: Record<string, number[]> = {}
      let machineSeriesGrouped: Record<string, Serie[]> = {}

      machines.forEach(async (machine: string) => {
        state.pipelineTypes.forEach(async (pipelineType: string) => {
          if (!Object.keys(machineSeriesGrouped).includes(pipelineType)) {
            machineSeriesGrouped[pipelineType] = [] as Serie[]
          }
          let query = `machine==${machine};total_hours=gt=0;project=like=${pipelineType}`
          api.get(`/api/v2/${state.timingTable}?num=${range}&sort=finishedTime:desc&q=${query}`)
            .then(function (response: { items: Object[] }) {
              if (response.items.length > 0) {
                machineSeriesGrouped[pipelineType].push(new Serie(machine, Array.from(response.items, (x:any) => { return x.total_hours })))
                sampleCounts[machine] = Array.from(response.items, (x: any) => x.numberofSamples as number).reverse()
              }
            })
            .catch(function (error: any) {
              reject(error)
            })
        })
      })
      commit('setMachineRuntimes', machineSeriesGrouped)
      commit('setMachineSampleCounts', sampleCounts)
      resolve()
  })
  },

  async getPipelineData ({ commit, state }: { commit:any, state: State }, range: number) {
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
  },

  /**
   * Gets the data from MOLGENIS for the runtime statistics table
   *
   * @param {Number} range - amount of results to get
   */
  async getTimingData ({ dispatch, state }: { dispatch: any, state: State }, range: number) {
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
  },

  /**
   * Gets the Sequencer spread statistics
   */
  async getSequencerStatistics ({ commit, state }: { commit: any, state: State }) {
    api.get(`/api/v2/${state.sampleTable}?aggs=x==sequencer;distinct==externalSampleID`)
      .then(function (response: { aggs: { matrix: Array<number[]>, xLabels: string[] } }) {
        const Aggregates = response.aggs
        commit('setSequencerStatisticsSeries', Array.from(Aggregates.matrix, (x: number[]) => x[0]))
        commit('setSequencerStatisticsLabels', Aggregates.xLabels)
      })
      .catch(function (error: any) {
        console.error(error)
      })
  },

  /**
   * Gets a sample total in a date range
   * @param {[String, String]} range - Array in format [date1, date2] where date = yyyy-mm-dd
   * @returns total samples in range
   */
  async getSamplesInDateRange ({ state }: { state: State }, range: [string, string]): Promise<number> {
    const query = `sequencingStartDate=rng=(${range[0]}, ${range[1]})`
    return api.get(`/api/v2/${state.sampleTable}?q=${query}&num=1`)
      .then(function (response: any) {
        const responseJson = response.json()
        return responseJson.total
      }).catch(function (error: any) {
        return Promise.reject(error)
      })
  },

  /**
   * Gets Sample counts in the scopes: yearly, montly, weekly, daily
   */
  async getSampleNumbers ({ commit, state }:{ commit: any, state: State }): Promise<void> {
    api.get(`/api/v2/${state.sampleTable}?num=1`)
      .then(function (response: any) {
        commit('setTotalSamples', response.json().total)
      })
    const now = new Date()

    this.getSamplesInDateRange({ state: state }, createDateRange(new Date(now.getTime() - (356 * dayMs)), now)).then(function (response: number) { commit('setYearlySampleCounts', response) })
    this.getSamplesInDateRange({ state: state }, createDateRange(new Date(now.getTime() - (31 * dayMs)), now)).then(function (response: number) { commit('setMonthlySampleCounts', response) })
    this.getSamplesInDateRange({ state: state }, createDateRange(new Date(now.getTime() - (7 * dayMs)), now)).then(function (response: number) { commit('setWeeklySampleCounts', response) })
    this.getSamplesInDateRange({ state: state }, createDateRange(new Date(now.getTime() - (dayMs)), now)).then(function (response: number) { commit('setDailySampleCounts', response) })
  },
  async getLastYearSampleSequencedNumbers ({ commit, state }: { commit: any, state: State }): Promise<void> {
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
  },
  async getProjectComment ({ state }: { state: State }, project: string): Promise<any> {
    return api.get(`/api/v1/${state.projectsTable}/${project}/comment`)
  },
  async updateProjectComment ({ state }: { state: State }, { project, comment }: { project: string, comment: string }) {
    return api.put(`/api/v1/${state.projectsTable}/${project}/comment`, { body: JSON.stringify(comment) })
  },
  async handleCommentSubmit ({ dispatch }: { dispatch: any, commit: any }, { project, oldComment, newComment, validation}: {project: string, oldComment: string, newComment: string, validation: boolean }) {
    return new Promise((resolve, reject) => {
      if (validation) {
        dispatch('checkForCommentUpdates', { project: project, oldComment: oldComment, newComment: newComment }).then((resolveMessage: string) => { resolve(resolveMessage) }, (reason: string) => { reject(reason) })
      } else {
        reject('Comment is invalid')
      }
    })
  },

  async checkForCommentUpdates({ dispatch, state }: { dispatch: any, state: State }, {project, oldComment, newComment}: { project: string, oldComment: string, newComment: string }) {
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
  },

  async convertRawData({ dispatch, commit, getters }: { dispatch: any, commit: any, getters: any }) {
    return new Promise((resolve) => {
      dispatch('convertProjects').then(() => {
        dispatch('constructRunObjects').then(() => {
          commit('updateFinishedRuns', getters.getFinishedRuns)
          resolve()
        })
      })
  })
  },

  async convertProjects({ commit, state, getters }: { commit: any, state: State, getters: any}) {
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
  },

  async constructRunObjects({ commit, state, getters }: { commit: any, state: State, getters: any}) {
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
}
