/**
 * gets standard deviation
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
 * @returns {Number}
 */
export function calculateMean (numberSeries: number[]): number {
  
  const arrayLenght = numberSeries.length
  if (arrayLenght > 0) {
    const sum = numberSeries.reduce((total: number, number: number): number => { return total + number})
    return sum / arrayLenght
  }
  return 0
}


/**
 * Calculates mean of numeric array excluding outliers
 * @param {Number[]} numberSeries - Average without any outliers
 * 
 * @returns {Number}
 */
export function calculateMeanWithoutOutliers (numberSeries: number[], standardDeviations = 1): number {

  const mean = calculateMean(numberSeries)
  const SD = getSD(numberSeries, mean)

  if (standardDeviations < 1) {
    throw new Error('Given standard deviation less than 1')
    standardDeviations = 1
  }

  const cutOff = SD * Math.floor(standardDeviations)

  const lowerThreshold = mean - cutOff
  const upperThreshold = mean + cutOff
  const filteredSeries = numberSeries.filter((number) => { return number > lowerThreshold && number < upperThreshold })

  return calculateMean(filteredSeries)
}