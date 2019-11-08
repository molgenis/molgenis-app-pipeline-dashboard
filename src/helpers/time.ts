/**
 * formats a time number to a number in string form with two characters
 * @param {Number} timeNumber - number to format
 * 
 * @returns {String(2)}
 */
export function formatTime(timeNumber: number): string {
  if (timeNumber < 10) {
    return '0' + timeNumber.toString()
  }
  return timeNumber.toString()
}

/**
 * Calculates hours from milliseconds
 * @param {Number} milliseconds - time number in milliseconds
 * 
 * @returns {Number} - Hours
 */
export function calculateHours(milliseconds: number): number {
  return Math.round((milliseconds / 1000) / 3600)
}

/**
 * Calculates minutes from milliseconds
 * @param {Number} milliseconds - time number in milliseconds
 * 
 * @returns {Number} minutes
 */
export function calculateMinutes(milliseconds: number): number {
  return Math.sqrt(Math.pow(Math.round(((milliseconds / 1000) / 3600) % 60), 2))
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
