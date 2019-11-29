import { Job, ProjectObject, projectDataObject } from '@/types/dataTypes';

/**
 * crops given title by the provided lenght
 * @param {String} title - title to crop
 * @param {Number} lenght - maxlenght
 * @returns {String}
 */
export function cropTitle (title: string, length: number): string {
  
  if (title.length > length) {
    return title.substring(0, length) + '...'
  }

  return title
}

/**
 * returns array of items that is not in the other array
 * 
 * @param arrayToFilter 
 * @param arrayToCheck 
 */
export function getFilteredArray (arrayToFilter: Array<any>, arrayToCheck: Array<any>): Array<any> {
  return arrayToFilter.filter((item) => { return !arrayToCheck.includes(item) })
}

/**
 * Coutns status occurence in a job Array
 *
 * @returns {Number} - status count
 */
export function countJobStatus (jobs: Job[], status: string): number {
  return jobs.filter(function (x) { return x.status === status }).length
}

/**
 * returns number of finished projects
 * @param {ProjectObject[]} projects - projects to check
 * 
 * @returns {Number}
 */
export function countProjectStartedCopying (projects: ProjectObject[]): {finished: boolean, total: number} {
  const finishedProjects = projects.filter(function (x) {
    return x.resultCopyStatus === 'finished'
  })
  const startedProjects = projects.filter(function (x) {
    return x.resultCopyStatus === 'started'
  })
  return projects.length === finishedProjects.length ? {finished: true, total: finishedProjects.length} : {finished: false, total: finishedProjects.length + startedProjects.length}  
}

/**
 * gets the project status
 * @param {projectDataObject} project - project
 * @param {Job[]} jobs - project jobs
 * 
 * @returns {String} - status
 */
export function getProjectDataStatus (project: projectDataObject, jobs: Job[]): string {
  if (project.copy_results_prm === 'finished' || countJobStatus(jobs, 'finished') === jobs.length) {
    return 'finished'
  } else if (countJobStatus(jobs, 'started') >= 1) {
    return 'started'
  } else {
    return 'Waiting'
  }
}