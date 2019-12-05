import { formatDate, dayMs, dateIsLastYear, createDateRange } from '@/helpers/dates'

describe('formatDate', () => {
  test('formats the given date with a single digit month and double digit day', () => {
    const date = new Date()

    date.setDate(12)
    date.setFullYear(2019)
    // js months are formatted to 11, january is 0, December is 11 etc
    date.setMonth(7)

    const ExpectedDateFormatString = '2019-08-12'
    expect(formatDate(date)).toEqual(ExpectedDateFormatString)
  })

  test('formats the given date with a single digit date and double digit month', () => {
    const date = new Date()

    date.setDate(2)
    date.setFullYear(2019)
    date.setMonth(10)

    const ExpectedDateFormatString = '2019-11-02'
    expect(formatDate(date)).toEqual(ExpectedDateFormatString)
  })
})

describe('dateIsLastYear', () => {
  const startDate = new Date()
  startDate.setMonth(4)
  startDate.setDate(2)
  startDate.setFullYear(2018)

  const endDate = new Date()
  endDate.setDate(5)
  endDate.setMonth(7)
  endDate.setFullYear(2019)

  test('Creates a formatted date range', () => {
    const ExpectedRange = ['2018-05-02', '2019-08-05']
    expect(createDateRange(startDate, endDate)).toEqual(ExpectedRange)
  })

  test('throws error when dates are reversed', () => {
    function reversedDates () {
      createDateRange(endDate, startDate)
    }

    expect(reversedDates).toThrow('End date is not before start date')
  })
})

describe('dateIsLastYear', () => {
  const now = new Date()
  const dateWithinLastYear = new Date(now.getTime() - (dayMs * 200))
  const dateOutsideLastYear = new Date(now.getTime() - (dayMs * 500))
  const edgeCaseOutside = new Date(now.getTime() - 3600 - (dayMs * 365))
  const edgeCaseInside = new Date(now.getTime() + 3600 - (dayMs * 365))
  const edgeCaseExact = new Date(now.getTime() - (dayMs * 365))

  it('Correctly confirms date is within last year', () => {
    expect(dateIsLastYear(dateWithinLastYear, now)).toBeTruthy()
    expect(dateIsLastYear(edgeCaseInside, now)).toBeTruthy()
  })

  test('Correctly confirms date is not within last year', () => {
    expect(dateIsLastYear(dateOutsideLastYear, now)).toBeFalsy()
    expect(dateIsLastYear(edgeCaseOutside, now)).toBeFalsy()
  })

  test('handles exactly 1 year ago as true', () => {
    expect(dateIsLastYear(edgeCaseExact, now)).toBeTruthy()
  })
})
