import { formatTime, calculateHours, calculateMinutes, calculateSeconds, timeUnit} from '@/helpers/time'

describe('formatTime', () => {
  test('formats a single digit number to double digit', () => {
    expect(formatTime(2, timeUnit.hours)).toEqual('02')
    expect(formatTime(22, timeUnit.hours)).toEqual('22')
  })

  test('throws error when digit is not in time format', () => {
    function largeNumber() {
      formatTime(123, timeUnit.minutes)
    }
    function negativeNumber() {
      formatTime(-1, timeUnit.minutes)
    }

    expect(largeNumber).toThrowError('Number cannot be time digit, 123 > 60')
    expect(negativeNumber).toThrowError('Number is negative')
  })
})

describe('calculateHours', () => {
  test('converts miliseconds to full hours', () => {
    expect(calculateHours(3600000)).toEqual(1)
    expect(calculateHours(3599999)).toEqual(0)
  })
})

describe('calculateMinutes', () => {
  test('converts milliseconds to minutes', () => {
    expect(calculateMinutes(60000)).toEqual(1)
    expect(calculateMinutes(120000)).toEqual(2)
    expect(calculateMinutes(3599999)).toEqual(59)
  })
  test('recalculates from zero when 1 hour has passed', () => {
    const hour = 3600000
    expect(calculateMinutes(hour)).toEqual(0)
    expect(calculateMinutes(hour * 5 - 1)).toEqual(59)
  })
})

describe('calculateSeconds', () => {
  test('converts milliseconds to seconds', () => {
    expect(calculateSeconds(20000)).toEqual(20)
  })

  test('recalculates from zero when 1 or more minutes have passed', () => {
    expect(calculateSeconds(61000)).toEqual(1)
  })
})