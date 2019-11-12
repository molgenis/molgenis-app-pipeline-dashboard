import { getSD, calculateMean, calculateMeanWithoutOutliers } from '@/helpers/statistics'

describe('getSD', () => {
  it('Calculates standard deviation', () => {
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
  it('Calculates mean value correctly', () => {
    const numbers = [6, 7, 8, 4, 6, 7]
    const sum = 6 + 7 + 8 + 4 + 6 + 7
    const expectedMean = sum / 6

    expect(calculateMean(numbers)).toEqual(expectedMean)
  })
})

describe('calculateMeanWithoutOutliers', () => {
  it('Throws error when SD less than 1', () => {
    function zeroSD() {
      const numbers = Array.from({length: 40}, () => Math.floor(Math.random() * 40))
      calculateMeanWithoutOutliers(numbers, 0)
    }
    
    expect(zeroSD).toThrow('Given standard deviation less than 1')
  })

  it('removes outliers then calculates mean', () => {
    const numbers = [1,2,1,2,1,2,1,2,30]
    const shouldNotEqual = calculateMean(numbers)
    const shouldEqual = calculateMean(numbers.slice(0, - 1))

    expect(calculateMeanWithoutOutliers(numbers)).toEqual(shouldEqual)
  })
})