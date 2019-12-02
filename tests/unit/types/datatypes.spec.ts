import {ProjectObject, Job, pipelineType, Run, RunTime, AverageData, Comment, RunTimeStatistic, statusCode, parseStatus} from '@/types/dataTypes'

describe('parseStatus', () => {
  function randomCapitalization (word: string): string {
    return word.split('').map(function(character: string) {
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

describe('Run', () => {
  const runId = 'testID'
  const demultiplexing = 'finished'
  const RawCopyState = 'started'
  const lenght = 0
  const error = false
  const resultCopyState = 0
  const run = new Run(runId, demultiplexing, RawCopyState, lenght, error, resultCopyState, false)
  
  test('run gets constructed correctly', () => {
    expect(run.run_id === runId).toBeTruthy()
    expect(run.demultiplexing === demultiplexing).toBeTruthy()
    expect(run.rawCopy === RawCopyState).toBeTruthy()
    expect(run.len === lenght).toBeTruthy()
    expect(run.containsError === error).toBeTruthy()
    expect(run.copyState === resultCopyState).toBeTruthy()
    expect(run.finished).toBe(false)
  })

  test('run can correctly return demultiplexing statuscode', () => {
    expect(run.getDemultiplexingStatus()).toBe(statusCode.finished)
  })
  test('run can correctly return Raw copying status code', () => {
    expect(run.getRawDataCopyingStatus()).toBe(statusCode.started)
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

describe('RunTimeStatistic class', () => {
  test('empty class construction returns "no data" runtimes', () => {
    const emptyRunTimeStatistics = new RunTimeStatistic([], 'test')
    const nodataRuntime = new RunTime('no data', 0)

    expect(emptyRunTimeStatistics.getMax()).toBe(0)
    expect(emptyRunTimeStatistics.Exoom).toEqual(nodataRuntime)
    expect(emptyRunTimeStatistics.SVP).toEqual(nodataRuntime)
    expect(emptyRunTimeStatistics.PCS).toEqual(nodataRuntime)
    expect(emptyRunTimeStatistics.ONCO).toEqual(nodataRuntime)
  })

  test.skip('project runtimes get assigned correctly', () => {
    class projectMock extends ProjectObject {
      getRunTime() {
        return 5
      }
    }
    function createMockProject(name: string) {
      const mockProject = new projectMock(name, [], 'dna', 'finished', 'finished', '')

      return mockProject
    }

    function returnFilledRuntimeStatistic() {

      const projects = [
        createMockProject('test-ONCO'),
        createMockProject('test-Exoom'),
        createMockProject('test-PCS'),
        createMockProject('test-SVP'),
        createMockProject('test-other')
      ]

      return new RunTimeStatistic(projects, 'test-run')
    }
    
    const mockedStatisticsObject = returnFilledRuntimeStatistic()
    console.log(mockedStatisticsObject)
  })
})

