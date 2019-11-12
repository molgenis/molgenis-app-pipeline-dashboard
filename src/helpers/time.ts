/**
 * formats a time number to a number in string form with two characters
 * @param {Number} timeNumber - number to format
 * 
 * @returns {String(2)}
 */
export function formatTime(timeNumber: number): string {

  if (timeNumber > 60) {
    throw new Error(`Number cannot be time digit, ${timeNumber} > 60`)
  } else if (timeNumber < 0) {
    throw new Error('Number is negative')
  }

  return timeNumber < 10 ? '0' + timeNumber.toString() : timeNumber.toString()
}

/**
 * Calculates hours from milliseconds
 * @param {Number} milliseconds - time number in milliseconds
 * 
 * @returns {Number} - Hours
 */
export function calculateHours(milliseconds: number): number {
  return Math.floor((milliseconds / 1000) / 3600)
}

/**
 * Calculates minutes from milliseconds 
 * @param {Number} milliseconds - time number in milliseconds
 * 
 * @returns {Number} minutes
 */
export function calculateMinutes(milliseconds: number): number {
  return Math.floor((((milliseconds / (1000 * 60))% 60)))
}

/**
 * Calculates seconds from milliseconds
 * @param {Number} milliseconds - time number in milliseconds
 * 
 * @returns {Number} - seconds
 */
export function calculateSeconds(milliseconds: number): number {
  return Math.sqrt(Math.pow(Math.round(((milliseconds / 1000) % 3600) % 60), 2))
}
