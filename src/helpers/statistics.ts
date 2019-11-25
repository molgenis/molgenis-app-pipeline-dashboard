/**
 * Calculates Standard deviation
 * 
 * calculates sum of numbers first then calculates sd
 * 
 * @param {Number[]} numberSeries - Array with numbers
 * @param {Number} mean - average
 * 
 * @returns {Number} - Standard deviation
 */
export function getSD (numberSeries: number[], mean: number): number {
  let sumOfDistance = 0

  numberSeries.forEach((number) => {
    sumOfDistance += Math.pow(number - mean, 2)
  })

  return Math.sqrt(sumOfDistance / (numberSeries.length - 1))
}

/**
 * Calculates mean of numeric array
 * @param {Number} numberSeries - array of numbers to calculate average
 * 
 * @return numberSeries mean
 */
export function calculateMean (numberSeries: number[]): number {
  
  const arrayLenght = numberSeries.length
  if (arrayLenght > 0) {
    return sumArray(numberSeries) / arrayLenght
  }
  return 0
}

/**
 * Sums up array of numbers
 * @param array - Array of numbers
 * 
 * @return {Number} Sum
 */
export function sumArray (array: number[]): number {
  return array.reduce((total: number, number: number): number => { return total + number})
}


/**
 * Calculates mean of numeric array excluding outliers
 * @param {Number[]} numberSeries - Average without any outliers
 * @throws Error when given standard deviations is negative or 0
 * @returns {Number}
 */
export function calculateMeanWithoutOutliers (numberSeries: number[], standardDeviations = 1): number {

  const mean = calculateMean(numberSeries)
  const SD = getSD(numberSeries, mean)

  if (standardDeviations < 1) {
    throw new Error(`Given standard deviation(${standardDeviations}) is ${standardDeviations < 0 ? 'negative' : 'less than 1'}`)
  }

  const cutOff = SD * Math.floor(standardDeviations)

  const lowerThreshold = mean - cutOff
  const upperThreshold = mean + cutOff
  const filteredSeries = numberSeries.filter((number) => { return number > lowerThreshold && number < upperThreshold })

  return calculateMean(filteredSeries)
}

/**
 * returns maximum number
 * @param n1 - number 1
 * @param n2 - number 2
 */
export function max(n1:number, n2:number): number {
  return n1 > n2 ? n1 : n2
}