/**
 * Formats a Date object to yyyy-mm-dd
 * 
 * @param {Date} date - date to format
 * 
 * @return yyyy-mm-dd date as string
 */
export function formatDate(date: Date): string {
  
  let day = date.getDate().toString()
  let month = (date.getMonth() + 1).toString()
  const year = date.getFullYear()
  
  if (parseInt(month) < 10) { // if number is single digit
    month = '0' + month
  }
  if (parseInt(day) < 10) { // if number is single digit
    day = '0' + day
  }
  return year + '-' + month + '-' + day
}

/**
 * Creates a range of dates formatted to api standard using [[formatDate]]
 * 
 * @param {Date} rangeStart - Start date
 * @param {Date} rangeEnd - End date
 * @throws Error when end-date is before start date
 * @returns {[String, String]} date range
 */
export function createDateRange(rangeStart: Date, rangeEnd: Date): [string, string] {
  if (rangeStart > rangeEnd) {
    throw new Error('End date is not before start date')
  }
  return [formatDate(rangeStart), formatDate(rangeEnd)]
}

/**
 * Calculates if given date falls within last year
 * @param {Date} date - date to verify
 * @param {Date} now - Current date
 */
export function dateIsLastYear(date: Date, now: Date): boolean {
  const lastYear = new Date(now.getTime() - 365 * dayMs)
  return date >= lastYear
}

/**
 * Milliseconds in a day
 */
export const dayMs = 24 * 60 * 60 * 1000