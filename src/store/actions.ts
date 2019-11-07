import axios from 'axios'
import { State } from './state';
import { pipelineType, RunDataObject, projectDataObject, Job } from '@/types/dataTypes';
import { Serie } from '@/types/graphTypes';
// @ts-ignore
import api from '@molgenis/molgenis-api-client'
import { createDateRange, formatDate, dayMs } from '@/helpers/dates'

export default {
  /**
   * Gets data from MOLGENIS database for Track and trace 
   */
  async getTrackerData ({commit, state}: {commit: any, state: State}) {
    api.get(`/api/v2/${state.overviewTable}?num=10000`)
    .then(function (response: {items: RunDataObject[]}) {
      const tableContent = response.items
      if (tableContent.length > 0) {
        commit('setRuns', tableContent)
      }
    }).catch(function (error: any) {
      if (error.response) {
        console.error(error.response.data)
        console.error(error.response.status)
        console.error(error.response.headers)
      } else if (error.request) {
        console.error(error.request)
      } else {
        console.error('Error', error.message)
      }
      console.error(error)
    })

    api.get(`/api/v2/${state.projectsTable}?num=10000`)
    .then(function (response: {items: projectDataObject[]}) {
      const tableContent = response.items
      if (tableContent.length > 0) {
        commit('setProjects', tableContent)
      }
    }).catch(function (error: any) {
      console.error('Failed fetching projects! Caused by:', error)
    })

    api.get(`/api/v2/${state.jobTable}?num=10000`)
    .then(function (response: {items: Job[]}) {
      const tableContent = response.items
      if (tableContent.length > 0) {
        commit('setJobs', tableContent)
      }
    }).catch(function (error: any) {
      console.error('Failed fetching jobs! Caused by:', error)
    })
  },

  /**
   * Gets the data from MOLGENIS for the runtime statistics table
   * 
   * @param {Number} range - amount of results to get
   */
  async getTimingData({commit, state}: {commit: any, state: State}, range: number) {
    // Data per machine
    api.get(`/api/v2/${state.timingTable}?aggs=x==machine;distinct==unique_id`)
    .then(function (response: {aggs: {matrix: Array<number[]>, xLabels: string[]}}) {
      let machines = response.aggs.xLabels as string[]
      machines = machines.filter((x) => { return x !== null }).sort()

      let sampleCounts: Record<string, number[]> = {}
      let machineSeriesGrouped: Record<string, Serie[]> = {}

       machines.forEach(async (machine: string) => {
        state.pipelineTypes.forEach(async (pipelineType: string) => {
          if (!Object.keys(machineSeriesGrouped).includes(pipelineType)) {
            machineSeriesGrouped[pipelineType] = [] as Serie[]
          }
          let query = `machine==${machine};total_hours=gt=0;project=like=${pipelineType}`
          await api.get(`/api/v2/${state.timingTable}?num=${range}&sort=finishedTime:desc&q=${query}`)
          .then(function (response: {items: Object[]}) {
            if (response.items.length > 0) {
                machineSeriesGrouped[pipelineType].push(new Serie(machine, Array.from(response.items, (x:any) => {return x.total_hours} )))
                sampleCounts[machine] = Array.from(response.items, (x: any) => x.numberofSamples as number).reverse()
              }})
              .catch(function (error: any) {
                console.error(error)
              })
            })
          })
      commit('setMachineRuntimes', machineSeriesGrouped)
      commit('setMachineSampleCounts', sampleCounts)
    })
    .catch(function (error: any) {
      console.error(error)
    })
    let pipelineSeries: Serie[] = []
    
    state.pipelineTypes.forEach(async (pipelineType: string) => {
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
   * Gets the Sequencer spread statistics
   * 
   */
  async getSequencerStatistics ({commit, state}: {commit: any, state: State}) {
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
  async getSamplesInDateRange({state}: {state: State}, range: [string, string]): Promise<number> {
    const query = `sequencingStartDate=rng=(${range[0]}, ${range[1]})`
    return await api.get(`/api/v2/${state.sampleTable}?q=${query}&num=1`)
    .then(function (response: any) {
      const responseJson = response.json()
      return responseJson.total
    }).catch(function (error: any) {
      console.error(error)
      return Promise.reject()
    })
  },

  /**
   * Gets Sample counts in the scopes: yearly, montly, weekly, daily
   *  
   */
  async getSampleNumbers({commit, state}:{commit: any, state: State}): Promise<void> {
    api.get(`/api/v2/${state.sampleTable}?num=1`)
    .then(function (response: any) {
      commit('setTotalSamples', response.json().total)
    })
    const now = new Date()
    

    this.getSamplesInDateRange({state: state}, createDateRange(new Date(now.getTime() - (356 * dayMs)), now)).then(function (response: number) {commit('setYearlySampleCounts'), response})
    this.getSamplesInDateRange({state: state}, createDateRange(new Date(now.getTime() - (31 * dayMs)), now)).then(function (response: number) {commit('setMonthlySampleCounts'), response})
    this.getSamplesInDateRange({state: state}, createDateRange(new Date(now.getTime() - (7 * dayMs)), now)).then(function (response: number) {commit('setWeeklySampleCounts'), response})
    this.getSamplesInDateRange({state: state}, createDateRange(new Date(now.getTime() - (dayMs)), now)).then(function (response: number) {commit('setDailySampleCounts'), response})
    
  },
  async getLastYearSampleSequencedNumbers({ commit, state }: {commit: any, state: State}): Promise<void> {
    const Now = new Date()
    const lastYear = formatDate(new Date(Now.getTime() - (375 * dayMs)))

    api.get(`/api/v2/${state.sampleTable}?aggs=x==sequencingStartDate;distinct==externalSampleID&q=sequencingStartDate=ge=${lastYear}`)
    .then(function (result: any) {
      let resultedData = {counts: [] as number[], labels: [] as string[]}
      resultedData.counts = Array.from(result.aggs.matrix, (nestedNumber: number[]) => nestedNumber[0])
      resultedData.labels = result.aggs.xLabels
      commit('setSequnecedSampleNumbers', resultedData)
    })
    .catch(function (error: any) {
      console.error(error)
    })
  }
}