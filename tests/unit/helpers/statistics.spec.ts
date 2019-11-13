import { getSD, calculateMean, calculateMeanWithoutOutliers } from '@/helpers/statistics'

describe('getSD', () => {
  test('Calculates standard deviation', () => {
    const numbers = [8,2,9,5,3]
    const sum = 8 + 2 + 9 + 5 + 3
    const mean = sum / 5

    const sumArray = (accumulator: number, currentValue: number) => accumulator + currentValue
    const expectedSD = Math.sqrt(numbers.map((x) => {
      return (x - mean) * (x - mean)
    }).reduce(sumArray, 0) / 4)

    const result = getSD(numbers, mean)

    expect(result).toEqual(expectedSD)
  })
})

describe('calculateMean', () => {
  test('Calculates mean value correctly', () => {
    const numbers = [6, 7, 8, 4, 6, 7]
    const sum = 6 + 7 + 8 + 4 + 6 + 7
    const expectedMean = sum / 6

    expect(calculateMean(numbers)).toEqual(expectedMean)
  })

  test('does nothing when array is empty', () => {
    expect(calculateMean([])).toEqual(0)
  })
})

describe('calculateMeanWithoutOutliers', () => {
  test('Throws error when SD is not usable', () => {
    function zeroSD() {
      const numbers = Array.from({length: 40}, () => Math.floor(Math.random() * 40))
      calculateMeanWithoutOutliers(numbers, 0)
    }
    function negativeSD() {
      const numbers = Array.from({length: 40}, () => Math.floor(Math.random() * 40))
      calculateMeanWithoutOutliers(numbers, -21)
    }
    
    expect(zeroSD).toThrow(`Given standard deviation(0) is less than 1`)
    expect(negativeSD).toThrow(`Given standard deviation(-21) is negative`)
  })

  test('removes outliers then calculates mean', () => {
    const numbers = [1,2,1,2,1,2,1,2,30]
    const shouldEqual = calculateMean(numbers.slice(0, - 1))

    expect(calculateMeanWithoutOutliers(numbers)).toEqual(shouldEqual)
  })
})