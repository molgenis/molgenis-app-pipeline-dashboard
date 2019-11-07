/**-
 * Formats a Date object to yyyy-mm-dd
 * 
 * @param {Date} date - date to format
 * 
 * @returns Date string as yyyy-mm-dd
 */
export function formatDate(date: Date): string {
  
  let day = date.getDate().toString()
  let month = (date.getMonth() + 1).toString()
  const year = date.getFullYear()
  if (parseInt(month) < 10) {
    month = '0' + month
  }
  if (parseInt(day) < 10) {
    day = '0' + day
  }
  return year + '-' + month + '-' + day
}

/**
 * 
 * @param {Date} rangeStart - Start date
 * @param {Date} rangeEnd - End date
 * 
 * @returns {[String, String]} - [yyyy-mm-dd, yyyy-mm-ddd]
 */
export function createDateRange(rangeStart: Date, rangeEnd: Date): [string, string] {
  return [formatDate(rangeStart), formatDate(rangeEnd)]
}

/**
 * Calculates if given date falls within last year
 * @param {Date} date - date to verify
 * @param {Date} now - Current date
 * 
 * @returns {Boolean}
 */
export function dateIsLastYear(date: Date, now: Date) {
  return (date.getMonth() <= now.getMonth() && date.getFullYear() === now.getFullYear()) || (date.getMonth() > now.getMonth() && date.getFullYear() === (now.getFullYear() - 1))
}

export const dayMs = 24 * 60 * 60 * 1000