import {ProjectObject, Job, pipelineType, Run, RunTime, AverageData, Comment} from '@/types/dataTypes'

describe('Run', () => {
  test('run gets constructed correctly', () => {
    const runId = 'testID'
    const projectArray: ProjectObject[] = []
    const demultiplexing = 'finished'
    const RawCopyState = 'finished'
    const lenght = 0
    const error = false
    const resultCopyState = 0

    const run = new Run(runId, projectArray, demultiplexing, RawCopyState, lenght, error, resultCopyState)

    expect(run.run_id === runId).toBeTruthy()
    expect(run.projects === projectArray).toBeTruthy()
    expect(run.demultiplexing === demultiplexing).toBeTruthy()
    expect(run.rawCopy === RawCopyState).toBeTruthy()
    expect(run.len === lenght).toBeTruthy()
    expect(run.containsError === error).toBeTruthy()
    expect(run.copyState === resultCopyState).toBeTruthy()
  })
})


describe('ProjectObject', () => {
  let projectObject: ProjectObject

  beforeEach(() => {
    const job: Job = {
      project_job: 'test-Exoom_test1',
      job: 'test1',
      project: 'test-Exoom',
      url: '',
      status: 'finished',
      step: 'create',
      started_date: '2019-02-09T22:50:15Z',
      finished_date: '2019-02-10T01:09:34Z'
    }

    const job2: Job = {
      project_job: 'test-Exoom_test2',
      job: 'test2',
      project: 'test-Exoom',
      url: '',
      status: 'finished',
      step: 'create',
      started_date: '2019-03-09T22:50:15Z',
      finished_date: '2019-03-10T01:09:34Z'
    }

    const job3: Job = {
      project_job: 'test-Exoom_test3',
      job: 'test3',
      project: 'test-Exoom',
      url: '',
      status: 'finished',
      step: 'create',
      started_date: '2019-04-09T22:50:15Z',
      finished_date: '2019-04-10T01:09:34Z'
    }

    const job4: Job = {
      project_job: 'test-Exoom_test4',
      job: 'test4',
      project: 'test-Exoom',
      url: '',
      status: 'finished',
      step: 'create'
    }
    
    const job5: Job = {
      project_job: 'test-Exoom_test5',
      job: 'test5',
      project: 'test-Exoom',
      url: '',
      status: 'finished',
      step: 'create',
      started_date: 'fafasfafaf', // simulates error in database fill
      finished_date: 'kesffskfaofk' // simulates error in database fill
    }
    projectObject = new ProjectObject('test-Exoom', [job, job2, job3, job4, job5], 'DNA', 'finished', 'finished', '')
  })

  test('finds the correct last date', () => {
    expect(projectObject.findLastDateTime()).toEqual(new Date('2019-04-10T01:09:34Z').getTime())
  })

  test('finds the correct started date', () => {
    expect(projectObject.findStartDateTime()).toEqual(new Date('2019-02-09T22:50:15Z').getTime())
  })

  test('calculates the correct runtime', () => {
    const expectedRuntime = new Date('2019-04-10T01:09:34Z').getTime() - new Date('2019-02-09T22:50:15Z').getTime()
    expect(projectObject.getRunTime()).toEqual(expectedRuntime)
  })

  test('project get type onco', () => {
    const project = new ProjectObject('test-ONCO', [], 'DNA', 'finished', 'finished', '')

    expect(project.getProjectType()).toEqual(pipelineType.onco)
  })

  test('project get type Exoom', () => {
    const project = new ProjectObject('test-Exoom', [], 'DNA', 'finished', 'finished', '')

    expect(project.getProjectType()).toEqual(pipelineType.exoom)
  })

  test('project get type pcs', () => {
    const project = new ProjectObject('test-PCS', [], 'DNA', 'finished', 'finished', '')

    expect(project.getProjectType()).toEqual(pipelineType.pcs)
  })

  test('project get type svp', () => {
    const project = new ProjectObject('test-SPV', [], 'DNA', 'finished', 'finished', '')

    expect(project.getProjectType()).toEqual(pipelineType.svp)
  })

  test('project get type other', () => {
    const project = new ProjectObject('test-any', [], 'DNA', 'finished', 'finished', '')

    expect(project.getProjectType()).toEqual(pipelineType.other)
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

describe('Comment class', () => {
  test('comment is constructed correctly', () => {
    const constructedComment = new Comment('testComment', 'Hello this is a comment')
    const fakeComment = {
      name: 'testComment',
      comment: 'Hello this is a comment'
    }

    expect(constructedComment).toEqual(fakeComment)
  })
})

