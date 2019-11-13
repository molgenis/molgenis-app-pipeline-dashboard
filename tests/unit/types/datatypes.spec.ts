import {ProjectObject, Job, pipelineType} from '@/types/dataTypes'

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
    projectObject = new ProjectObject('test-Exoom', [job, job2, job3], 'DNA', 'finished', 'finished', '')
  })

  it('finds the correct type for the job', () => {
    expect(projectObject.type).toEqual(pipelineType.exoom)
  })

  it('finds the correct last date', () => {
    expect(projectObject.findLastDateTime()).toEqual(new Date('2019-04-10T01:09:34Z').getTime())
  })

  it('finds the correct started date', () => {
    expect(projectObject.findStartDateTime()).toEqual(new Date('2019-02-09T22:50:15Z').getTime())
  })

  it('calculates the correct runtime', () => {
    const expectedRuntime = new Date('2019-04-10T01:09:34Z').getTime() - new Date('2019-02-09T22:50:15Z').getTime()
    expect(projectObject.getRunTime()).toEqual(expectedRuntime)
  })
})

