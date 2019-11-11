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
  return arrayToFilter.filter((run) => { return !arrayToCheck.includes(run.run) })
}