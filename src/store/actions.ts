import axios from 'axios'
import { State } from './state';
import { pipelineType } from '@/types/dataTypes';
import { Serie } from '@/types/graphTypes';

export default {
  /**
   * Gets data from MOLGENIS database for Track and trace
   * 
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
  async getTimingData({commit, state}: {commit: any, state: State}, range: number) {
    const ApiInstance = axios.create({
      baseURL: state.APIv2,
      headers: {
        'x-molgenis-token': state.AccessToken,
        'Content-Type': 'application/json'
      }
    })
    await ApiInstance.get(`${state.timingTable}`, {
      params: {
        aggs: 'x==machine;distinct==unique_id'
      }
    }).then(function (response) {
      const machines = response.data.xLables
      let machineSeries: Serie[] = []
      machines.forEach(async (machine: string) => {
        await ApiInstance.get(`${state.timingTable}`, {
          params: {
            num: range,
            sort: 'finishedTime:desc',
            q: `machine==${machine};total_hours=gt=0`
          }
        }).then(function (response) {
          if (response.data.items.length > 0) {
            machineSeries.push(new Serie(machine, Array.from(response.data.items, (x: any) => x.total_hours)))
          }
        })
        .catch(function (error) {
          console.error(error)
        })
      })
      commit('setMachineRuntimes', machineSeries)

    })
    .catch(function (error) {
      console.error(error)
    })

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
        if (ResponseData.length > 0) {
          commit('setRuntimeStatistics', ResponseData)
        } else {
          commit('setRuntimeStatisticsEmpty')
        }
      })
      .catch(function (error) {
        console.error(error)
      })
    })
  }
}