/**
 * @module store
 */

import { State } from '@/store/state'
import { Job, ProjectObject, Run, statusCode } from '@/types/dataTypes'
/**
 * Dashboard getters
 * @requires Job,ProjectObject,Run,statusCode
 */
const getters = {
  getProjectsByRunID: (state: State) => {
    return (runID: string) => { return state.projectObjects[runID] }
  },
  getJobsByProjectID: (state: State) => {
    return (projectID: string) => {
      return state.jobs.filter(function (x: Job) {
        return x.project === projectID
      })
    }
  },
  getRunObjectByID: (state: State) => (id: string) => {
    const run = state.runObjects.find((run: Run) => { return run.run_id === id })
    return run
  },
  getFinishedRuns: (state: State) => {
    return state.runObjects.filter((run: Run) => {
      return state.projectObjects[run.run_id].filter((project: ProjectObject) => {
        return project.status === statusCode.finished
      }).length === run.len
    }).map((run: Run) => {
      return run.run_id
    })
  }
}
export default getters
