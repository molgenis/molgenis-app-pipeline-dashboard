
/**
 * Milliseconds in a day
 */
export const dayMs = 24 * 60 * 60 * 1000

/**
 * Formats a Date object to yyyy-mm-dd
 *
 * @param {Date} date - date to format
 *
 * @return yyyy-mm-dd date as string
 */
export function formatDate (date: Date): string {
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
 * Gets a label for the date, given amount of days in the past
 * @param days number of days back
 * @returns {'dayOfMonth/Month'}
 */
export function getDateLabel (days: number): string {
  const now = Date.now()
  const d = new Date(now - dayMs * days)
  return `${d.getDate()}/${d.getMonth() + 1}`
}

/**
 * Creates a range of dates formatted to api standard using [[formatDate]]
 *
 * @param {Date} rangeStart - Start date
 * @param {Date} rangeEnd - End date
 * @throws Error when end-date is before start date
 * @returns {[String, String]} date range
 */
export function createDateRange (rangeStart: Date, rangeEnd: Date): [string, string] {
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
export function dateIsLastYear (date: Date, now: Date): boolean {
  const lastYear = new Date(now.getTime() - 365 * dayMs)
  return date >= lastYear
}

/**
 * Sequencers gives date in format yymmdd
 * 
 * @param date 
 * @returns yymmdd
 */
export function createSampleDate(date: Date): string {
  let day = date.getDate().toString()
  let month = (date.getMonth() + 1).toString()
  const year = date.getFullYear()

  if (parseInt(month) < 10) { // if number is single digit
    month = '0' + month
  }
  if (parseInt(day) < 10) { // if number is single digit
    day = '0' + day
  }
  return `${year.toString().substr(2)}${month}${day}`
}

/**
 * Convert date from sample entity back to a normal date
 * 
 * @param date 
 * @returns yyyy-mm-dd
 */
 export function convertSampleDate(sampleDate: number): string {
  const convertedSampleDate = sampleDate.toString()
  const day = convertedSampleDate.substr(4)
  const month = convertedSampleDate.substr(2,2)
  const year = `20${convertedSampleDate.substr(0,2)}` 
  return year + '-' + month + '-' + day
}
