import axios from 'axios'
import { State } from './state';
import { pipelineType } from '@/types/dataTypes';
import { Serie } from '@/types/graphTypes';
// @ts-ignore
import api from '@molgenis/molgenis-api-client'

import { createDateRange } from '@/helpers/dates'

export default {
  /**
   * Gets data from MOLGENIS database for Track and trace 
   */
  async getTrackerData ({commit, state}: {commit: any, state: State}) {
    const ApiInstance = axios.create({
      baseURL: state.APIv2,
      headers: {
        'x-molgenis-token': state.AccessToken,
        'Content-Type': 'application/json'
      }
    })
    await ApiInstance.get(`${state.overviewTable}`, {
      params: {
        num: 10000
      }
    })
    .then(function (response) {
      const tableContent = response.data.items
      if (tableContent.length > 0) {
        commit('setRuns', tableContent)
      }
    }).catch(function (error) {
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

    await ApiInstance.get(`${state.projectsTable}`, {
      params: {
        num: 10000
      }
    })
    .then(function (response) {
      const tableContent = response.data.items
      if (tableContent.length > 0) {
        commit('setProjects', tableContent)
      }
    }).catch(function (error) {
      console.error('Failed fetching projects! Caused by:', error)
    })

    await ApiInstance.get(`${state.jobTable}`, {
      params: {
        num: 10000
      }
    })
    .then(function (response) {
      const tableContent = response.data.items
      if (tableContent.length > 0) {
        commit('setJobs', tableContent)
      }
    }).catch(function (error) {
      console.error('Failed fetching jobs! Caused by:', error)
    })
  },
  /**
   * Gets the data from MOLGENIS for the runtime statistics table
   * @param {Number} range - amount of results to get
   */
  async getTimingData({commit, state}: {commit: any, state: State}, range: number) {
    const ApiInstance = axios.create({
      baseURL: state.APIv2,
      headers: {
        'x-molgenis-token': state.AccessToken,
        'Content-Type': 'application/json'
      }
    })
    // Data per machine
    await ApiInstance.get(`${state.timingTable}`, {
      params: {
        aggs: 'x==machine;distinct==unique_id'
      }
    }).then(function (response) {
      let machines = response.data.aggs.xLabels as string[]
      machines = machines.filter((x) => { return x !== null }).sort()
      let machineSeries: Serie[] = []
      let sampleCounts: Record<string, number[]> = {}
      let machineSeriesGrouped: Record<string, Serie[]> = {}
      machines.forEach(async (machine: string) => {
        state.pipelineTypes.forEach(async (pipelineType: string) => {
          if (!Object.keys(machineSeriesGrouped).includes(pipelineType)) {
            machineSeriesGrouped[pipelineType] = [] as Serie[]
          }
          await ApiInstance.get(`${state.timingTable}`, {
            params: {
              num: range,
              sort: 'finishedTime:desc',
              q: `machine==${machine};total_hours=gt=0;project=like=${pipelineType}`
            }
          }).then(function (response) {
            if (response.data.items.length > 0) {
                machineSeriesGrouped[pipelineType].push(new Serie(machine, Array.from(response.data.items, (x:any) => {return x.total_hours} )))
                sampleCounts[machine] = Array.from(response.data.items, (x: any) => x.numberofSamples as number).reverse()
              }})
              .catch(function (error) {
                console.error(error)
              })
            })
          })
      commit('setMachineRuntimes', machineSeriesGrouped)
      commit('setMachineSampleCounts', sampleCounts)
    })
    .catch(function (error) {
      console.error(error)
    })
    let pipelineSeries: Serie[] = []
    state.pipelineTypes.forEach(async (pipelineType: string) => {
      await ApiInstance.get(`${state.timingTable}`, {
        params: {
          num: range,
          sort: 'finishedTime:desc',
          q: `project=like=${pipelineType};total_hours=gt=0`
        }
      })
      .then(function (response) {
        const ResponseData = response.data.items
        pipelineSeries.push(new Serie(pipelineType, Array.from(ResponseData, (x: any) => Math.round(x.pipelineDuration / 60)).reverse()))
      })
      .catch(function (error) {
        console.error(error)
      })
    })
    commit('setPipelineData', pipelineSeries)
  },
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
  async getSampleNumbers({commit, state}:{commit: any, state: State}): Promise<void> {
    api.get(`/api/v2/${state.sampleTable}?num=1`)
    .then(function (response: any) {
      commit('setTotalSamples', response.json().total)
    })
    const now = new Date()
    const dayMs = 24 * 60 * 60 * 1000
    this.getSamplesInDateRange({state: state}, createDateRange(new Date(now.getTime() - (356 * dayMs)), now)).then(function (response: number) {commit('setYearlySampleCounts'), response})
    this.getSamplesInDateRange({state: state}, createDateRange(new Date(now.getTime() - (31 * dayMs)), now)).then(function (response: number) {commit('setMonthlySampleCounts'), response})
    this.getSamplesInDateRange({state: state}, createDateRange(new Date(now.getTime() - (7 * dayMs)), now)).then(function (response: number) {commit('setWeeklySampleCounts'), response})
    this.getSamplesInDateRange({state: state}, createDateRange(new Date(now.getTime() - (dayMs)), now)).then(function (response: number) {commit('setDailySampleCounts'), response})
    
  }
}