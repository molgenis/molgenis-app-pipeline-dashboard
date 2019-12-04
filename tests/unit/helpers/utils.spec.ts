import { cropTitle, getFilteredArray, countJobStatus, countProjectStartedCopying, getProjectDataStatus } from '@/helpers/utils'
import { Job, ProjectObject, projectDataObject } from '@/types/dataTypes'

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

    expect(getFilteredArray(array1, array2)).not.toContain(['test2', 'test3'])
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
        startedDate: `2019-09-0${counter}T08:00:00`,
        finishedDate: `2019-09-0${counter + 1}T09:00:00`
      }
    })
  })
  test('counts the correct job statusus', () => {
    expect(countJobStatus(jobs, 'finished')).toEqual(3)
    expect(countJobStatus(jobs, 'started')).not.toBeGreaterThan(0)
  })
})

describe('countProjectStartedCopying', () => {
  let projects = [] as ProjectObject[]
  let projectsFinished = [] as ProjectObject[]
  let projectsNotFinished = [] as ProjectObject[]

  for (let i = 0; i <= 10; i++) {
    projects.push(new ProjectObject(`project${i}`, [], 'dna', 'finished', 'finished', ''))
    projectsFinished.push(new ProjectObject(`project${i}`, [], 'dna', 'finished', 'finished', ''))
    projects.push(new ProjectObject(`project${i}${i * 20}`, [], 'dna', 'finished', 'started', ''))
    projectsNotFinished.push(new ProjectObject(`project${i}`, [], 'dna', 'running', 'waiting', ''))
  }

  test('projects started and finished counts correctly', () => {
    expect(countProjectStartedCopying(projects)).toEqual({ finished: false, total: 22 })
  })
  test('projects finished all annotates and counts correctly', () => {
    expect(countProjectStartedCopying(projectsFinished)).toEqual({ finished: true, total: 11 })
  })
  test('no projects done annotates and counts correctly', () => {
    expect(countProjectStartedCopying(projectsNotFinished)).toEqual({ finished: false, total: 0 })
  })
})

describe('getProjectDataStatus', () => {
  const project = {
    project: `project`,
    url: 'test',
    run_id: `RunID_124`,
    pipeline: 'dna',
    copy_results_prm: 'finished',
    comment: ''
  }
  let jobs = [] as Job[]
  for (let i = 0; i <= 10; i++) {
    jobs.push({
      project_job: `Project_TestJob${i}`,
      job: 'Create',
      project: 'project',
      url: 'test.org',
      status: 'finished',
      step: `s0${i}`
    })
  }
  test('Status returns finished when project is finished', () => {
    expect(getProjectDataStatus(project, jobs)).toBe('finished')
  })

  test('Status returns finished when all jobs are finished', () => {
    project.copy_results_prm = 'waiting'
    expect(getProjectDataStatus(project, jobs)).toBe('finished')
  })

  test('Status is started when not all jobs have finished', () => {
    project.copy_results_prm = 'waiting'
    jobs.push({
      project_job: `Project_TestJobs12`,
      job: 'Create',
      project: 'project',
      url: 'test.org',
      status: 'started',
      step: `s012`
    })
    expect(getProjectDataStatus(project, jobs)).toBe('started')
  })

  test('Status is waiting when in queue', () => {
    project.copy_results_prm = 'waiting'
    expect(getProjectDataStatus(project, [{
      project_job: `Project_TestJobs12`,
      job: 'Create',
      project: 'project',
      url: 'test.org',
      status: 'Waiting',
      step: `s012`
    }])).toBe('Waiting')
  })
})
