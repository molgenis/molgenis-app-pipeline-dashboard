/**-
 * Formats a Date object to yyyy-mm-dd
 * 
 * @param {Date} date - date to format
 * 
 * @returns Date string as yyyy-mm-dd
 */
export function formatDate(date: Date): string {
  let day = date.getDay().toString()
  let month = date.getMonth().toString()
  const year = date.getFullYear()
  if (parseInt(month) < 10) {
    month = '0' + month
  }
  if (parseInt(day) < 10) {
    day = '0' + day
  }
  return year + '-' + month + '-' + day
}

export function createDateRange(rangeStart: Date, rangeEnd: Date): [string, string] {
  return [formatDate(rangeStart), formatDate(rangeEnd)]
}