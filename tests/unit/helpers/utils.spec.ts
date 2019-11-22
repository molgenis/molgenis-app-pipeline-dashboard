import { cropTitle, getFilteredArray, countJobStatus} from '@/helpers/utils'
import { Job } from '@/types/dataTypes'

describe('cropTitle', () => {
  test('shortens given string with stated amount', () => {
    const text = 'Hello, this is a test string'

    expect(cropTitle(text, 5)).toEqual('Hello...')
  })

  test('string is already smaller than given lenght', () => {
    const text = 'test' // lenght 4

    expect(cropTitle(text, 4)).toEqual(text)
  })
})

describe('getFilteredArray', () => {
  test('returns array without items that are contained in other array', () => {
    const array1 = ['test1', 'test2', 'test3']
    const array2 = ['test2', 'test3']

    expect(getFilteredArray(array1, array2)).not.toContain(['test2','test3'])
  })
})

describe('countJobStatus', () => {
  let jobs: Job[] = []
  beforeAll(() => {
    const jobNames = ['create', 'move', 'done']
    let counter = 0
    jobs = jobNames.map((name): Job => {
      counter += 1
      return {
        project_job: `test${counter}_${name}`,
        job: name,
        project: `test${counter}`,
        url: 'test.org',
        status: 'finished',
        step: name,
        started_date: `2019-09-0${counter}T08:00:00`,
        finished_date: `2019-09-0${counter + 1}T09:00:00`,
      }
    })
  })
  test('counts the correct job statusus', () => {
    expect(countJobStatus(jobs, 'finished')).toEqual(3)
    expect(countJobStatus(jobs, 'started')).not.toBeGreaterThan(0)
  })
})
