import axios from 'axios'
import { State } from './state';

export default {
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
      console.log(response.data)
      if (tableContent.length > 0) {
        commit('setRuns', tableContent)
      }
    }).catch(function (error) {
      console.error(`Failed fetching runs! Using instance ${ApiInstance.defaults.baseURL} Caused by:`, error)
      
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
  }
}