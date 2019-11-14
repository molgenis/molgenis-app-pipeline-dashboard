import { Job } from '@/types/dataTypes';

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