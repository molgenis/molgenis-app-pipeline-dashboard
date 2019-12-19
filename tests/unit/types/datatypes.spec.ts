import { RunTime, AverageData, Comment, statusCode, parseStatus } from '../../../src/types/dataTypes'

describe('parseStatus', () => {
  
  function randomCapitalization (word: string): string {
    return word.split('').map(function (character: string) {
      return Math.round(Math.random()) ? character.toUpperCase() : character.toLowerCase()
    }).join('')
  }

  test('parseStatus can match waiting', () => {
    expect(parseStatus('waiting')).toBe(statusCode.waiting)
    expect(parseStatus('Waiting')).toBe(statusCode.waiting)
    expect(parseStatus(randomCapitalization('waiting'))).toBe(statusCode.waiting)
    expect(parseStatus(randomCapitalization('waiting'))).toBe(statusCode.waiting)
    expect(parseStatus(randomCapitalization('waiting'))).toBe(statusCode.waiting)
  })

  test('parseStatus can match finished', () => {
    expect(parseStatus('finished')).toBe(statusCode.finished)
    expect(parseStatus('Finished')).toBe(statusCode.finished)
    expect(parseStatus(randomCapitalization('finished'))).toBe(statusCode.finished)
    expect(parseStatus(randomCapitalization('finished'))).toBe(statusCode.finished)
    expect(parseStatus(randomCapitalization('finished'))).toBe(statusCode.finished)
  })

  test('parseStatus can match started', () => {
    expect(parseStatus('started')).toBe(statusCode.started)
    expect(parseStatus('Started')).toBe(statusCode.started)
    expect(parseStatus(randomCapitalization('started'))).toBe(statusCode.started)
    expect(parseStatus(randomCapitalization('started'))).toBe(statusCode.started)
    expect(parseStatus(randomCapitalization('started'))).toBe(statusCode.started)
  })

  test('parseStatus can match error', () => {
    expect(parseStatus('error')).toBe(statusCode.error)
    expect(parseStatus('error')).toBe(statusCode.error)
    expect(parseStatus(randomCapitalization('error'))).toBe(statusCode.error)
    expect(parseStatus(randomCapitalization('error'))).toBe(statusCode.error)
    expect(parseStatus(randomCapitalization('error'))).toBe(statusCode.error)
  })

  test('parseStatus returns other when corrupt or incorectly added', () => {
    expect(parseStatus('not any status')).toBe(statusCode.other)
  })
})


describe('Runtime class', () => {
  test('Runtime class is constructed correctly', () => {
    const runtime = new RunTime('test-run', 5400000)

    expect(runtime.runId).toEqual('test-run')
    expect(runtime.runtime).toEqual(1.5)
  })
})

describe('AverageData class', () => {
  test('AverageData class is constructed correctly', () => {
    const constructedAverageData = new AverageData(5.7, 3.3, 2.2, 9.2)
    const fakeAverageData = {
      ONCO: 5.7 as number,
      PCS: 3.3 as number,
      Exoom: 2.2 as number,
      SVP: 9.2 as number
    }

    expect(constructedAverageData).toEqual(fakeAverageData)
  })
})

describe('Comment constructor', () => {
  test('comment is constructed correctly', () => {
    const constructedComment = new Comment('testComment', 'Hello this is a comment')
    const fakeComment = {
      name: 'testComment',
      comment: 'Hello this is a comment'
    }

    expect(constructedComment).toEqual(fakeComment)
  })
})
