/**
 * sets the maximum numbers for a time unit
 *
 * * Hours can be infinitly large
 * * minutes can't be longer than one hour
 * * seconds can't be longer than one minute
 */
export enum timeUnit {
  hours = Infinity,
  minutes = 60,
  seconds = 60
}

/**
 * formats a time number to a number in string form with two characters
 * @param {Number} timeNumber - number to format
 *
 * @throws Error when time number is not in the correct format
 * @throws Error when time number is negative
 * @returns {String(2)}
 */
export function formatTime (timeNumber: number, unit: timeUnit): string {
  if (timeNumber > unit) {
    throw new Error(`Number cannot be time digit, ${timeNumber} > ${unit}`)
  } else if (timeNumber < 0) {
    throw new Error('Number is negative')
  }

  return timeNumber < 10 ? '0' + timeNumber.toString() : timeNumber.toString() // if single digit return '0' + number
}

/**
 * Calculates hours from milliseconds
 * @param {Number} milliseconds - time number in milliseconds
 *
 * @returns {Number} - Hours
 */
export function calculateHours (milliseconds: number): number {
  return Math.floor((milliseconds / 1000) / 3600)
}

/**
 * Calculates minutes from milliseconds
 * @param {Number} milliseconds - time number in milliseconds
 *
 * @returns {Number} minutes
 */
export function calculateMinutes (milliseconds: number): number {
  return Math.floor((((milliseconds / (1000 * 60)) % 60)))
}

/**
 * Calculates seconds from milliseconds
 * @param {Number} milliseconds - time number in milliseconds
 *
 * @returns {Number} - seconds
 */
export function calculateSeconds (milliseconds: number): number {
  return Math.abs(Math.round(((milliseconds / 1000) % 3600) % 60))
}


