/**
 * @module store
 */

import { State } from '@/store/state'
import { Job, ProjectObject, Run, statusCode } from '@/types/dataTypes'
import { ProjectData } from '@/types/Run';
/**
 * Dashboard getters
 * @requires Job,ProjectObject,Run,statusCode
 */
const getters = {
  getProjectsByRunID: (state: State) => {
    return (runID: string) => { return state.projectObjects[runID] }
  },
  getRunObjectByID: (state: State) => (id: string) => {
    const run = state.runObjects.find((run: Run) => { return run.run_id === id })
    return run
  },
  getFinishedRuns: (state: State) => {
    return state.runObjects.filter((run: Run) => {
      return state.projectObjects[run.run_id] ? state.projectObjects[run.run_id].filter((project: ProjectData) => {
        return project.jobs.getStatus() === statusCode.finished
      }).length === run.len : true
    }).map((run: Run) => {
      return run.run_id
    })
  }
}
export default getters
