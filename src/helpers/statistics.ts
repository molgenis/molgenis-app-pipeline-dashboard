/**
 * gets standard deviation
 * @param {Number[]} numArray - Array with numbers
 * @param {Number} average - average
 * 
 * @returns {Number} - Standard deviation
 */
export function getSD (numArray: number[], average: number): number {
  let sumOfDistance = 0

  numArray.forEach((x) => {
    sumOfDistance += Math.pow(x - average, 2)
  })

  return Math.sqrt(sumOfDistance / numArray.length)
}

/**
 * gets the average of array
 * @param {Number} numArray - array of numbers to calculate average
 * @returns {Number}
 */
export function findAverage (numArray: number[]): number {
  let sum = 0

  numArray.forEach((x) => {
    sum += x
  })

  return sum / numArray.length
}


/**
 * Removes outliers from array, then calculates average
 * @param {Number[]} numArray - Average without any outliers
 * 
 * @returns {Number}
 */
export function findAverageOfNormalValues (numArray: number[]): number {
  const average = findAverage(numArray)
  const SD = getSD(numArray, average)
  const cutOff = SD
  const lower = average - cutOff
  const higher = average + cutOff
  const filteredArray = numArray.filter((x) => { return x > lower && x < higher })

  return findAverage(filteredArray)
}