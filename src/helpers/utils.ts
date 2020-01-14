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
export function getFilteredArray (arrayToFilter: unknown[], arrayToCheck: unknown[]): unknown[] {
  return arrayToFilter.filter((item) => { return !arrayToCheck.includes(item) })
}