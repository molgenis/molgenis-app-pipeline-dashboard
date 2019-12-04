import mutations from '@/store/mutations'
import { Run, RunDataObject, projectDataObject, Job, ProjectObject } from '@/types/dataTypes'
import { State } from '@/store/state'
import { Serie, IdentifiedSerie } from '@/types/graphTypes'

let state: State

beforeEach(() => {
  state = {
    runs: [],
    projects: [],
    jobs: [],
    overviewTable: 'status_overview',
    projectsTable: 'status_projects',
    jobTable: 'status_jobs',
    timingTable: 'status_timing',
    sampleTable: 'status_samples',
    pipelineTypes: ['Exoom', 'ONCO', 'SVP', 'PCS'],
    MainInfoStatus: false,
    statistics: [],
    statisticsEmpty: true,
    machineRuntimes: {},
    machineSampleCounts: {},
    sequencerStatisticsLabels: [],
    sequencerStatisticsSeries: [],
    totalSampleCounts: 0,
    yearlySampleCounts: 0,
    monthlySampleCounts: 0,
    weeklySampleCounts: 0,
    dailySampleCounts: 0,
    sequencedSampleNumbers: { counts: [], labels: [] },
    runsLoaded: false,
    projectsLoaded: false,
    jobsLoaded: false,
    checkedCommentStatus: false,
    CommentUpdatedStatus: false,
    CommentNetworkError: false,
    rawDataConverted: false,
    projectObjects: {},
    runObjects: []
  }
})

describe('setRuns', () => {
  const runs: RunDataObject[] = [
    {
      run_id: 'test',
      group: '',
      demultiplexing: 'finished',
      copy_raw_prm: 'finished',
      projects: []
    }
  ]
  test('setRuns adds runs to localRuns', () => {
    mutations.setRuns(state, runs)

    expect(state.runs).toEqual([
      {
        run_id: 'test',
        group: '',
        demultiplexing: 'finished',
        copy_raw_prm: 'finished',
        projects: []
      }
    ])
    expect(state.runsLoaded).toBe(true)
  })

  test("setRuns doesn't change loadingState when loaded", () => {
    mutations.setRuns(state, runs)

    expect(state.runsLoaded).toBe(true)
    mutations.setRuns(state, runs)
    expect(state.runsLoaded).toBe(true)
  })
})

describe('setProjects', () => {
  const projects: projectDataObject[] = [
    {
      project: 'test',
      url: '',
      run_id: 'testRun1',
      pipeline: 'dna'
    }
  ]
  test('setProjects adds projects to localProjects', () => {
    mutations.setProjects(state, projects)

    expect(state.projects).toEqual([
      {
        project: 'test',
        url: '',
        run_id: 'testRun1',
        pipeline: 'dna'
      }
    ])
    expect(state.projectsLoaded).toBe(true)
  })

  test("setProjects doesn't change loadingState when loaded", () => {
    mutations.setProjects(state, projects)

    expect(state.projectsLoaded).toBe(true)
    mutations.setProjects(state, projects)
    expect(state.projectsLoaded).toBe(true)
  })
})

describe('setJobs', () => {
  const jobs: Job[] = [
    {
      project_job: 'test1_create',
      project: 'test1',
      job: 'create',
      url: '',
      status: 'Waiting',
      step: 'create'
    }
  ]
  test('setJobs adds jobs to localJobs', () => {
    mutations.setJobs(state, jobs)

    expect(state.jobs).toEqual([
      {
        project_job: 'test1_create',
        project: 'test1',
        job: 'create',
        url: '',
        status: 'Waiting',
        step: 'create'
      }
    ])
    expect(state.jobsLoaded).toBe(true)
  })

  test("setJobs doesn't change loadingState when loaded", () => {
    mutations.setJobs(state, jobs)

    expect(state.jobsLoaded).toBe(true)
    mutations.setJobs(state, jobs)
    expect(state.jobsLoaded).toBe(true)
  })
})

describe('Setters wihtout logic', () => {
  test('setPipelineData', () => {
    const data: Serie[] = [new Serie('other', [1, 2, 3])]

    mutations.setPipelineData(state, data)

    expect(state.statistics).toContainEqual(new Serie('other', [1, 2, 3]))
  })

  test('setMachineRuntimes', () => {
    const machineRuntimes: Record<string, IdentifiedSerie[]> = { 'test-machine': [new IdentifiedSerie('other', [{ projectID: 'test', number: 22 }, { projectID: 'test2', number: 23 }])] }

    mutations.setMachineRuntimes(state, machineRuntimes)

    expect(state.machineRuntimes).toHaveProperty('test-machine')
    expect(state.machineRuntimes['test-machine']).toContainEqual(new IdentifiedSerie('other', [{ projectID: 'test', number: 22 }, { projectID: 'test2', number: 23 }]))
  })

  test('setMachineSampleCounts', () => {
    const sampleCountsRecord: Record<string, number[]> = { 'test-machine': [653, 222, 31] }

    mutations.setMachineSampleCounts(state, sampleCountsRecord)
    expect(state.machineSampleCounts).toHaveProperty('test-machine')
    expect(state.machineSampleCounts['test-machine']).toEqual([653, 222, 31])
  })

  test('setSequencerStatisticsSeries', () => {
    const sequencerStatistics = [1, 2, 3]
    mutations.setSequencerStatisticsSeries(state, sequencerStatistics)

    expect(state.sequencerStatisticsSeries).toEqual(sequencerStatistics)
  })

  test('setSequencerStatisticsLabels', () => {
    const labels = ['test1', 'test2']
    mutations.setSequencerStatisticsLabels(state, labels)

    expect(state.sequencerStatisticsLabels).toEqual(labels)
  })

  test('setTotalCounts', () => {
    const counts = 332
    mutations.setTotalCounts(state, counts)

    expect(state.totalSampleCounts).toBe(counts)
  })

  test('setYearlySampleCounts', () => {
    const counts = 202
    mutations.setYearlySampleCounts(state, counts)

    expect(state.yearlySampleCounts).toBe(counts)
  })

  test('setMonthlySampleCounts', () => {
    const counts = 50
    mutations.setMonthlySampleCounts(state, counts)

    expect(state.monthlySampleCounts).toBe(counts)
  })

  test('setWeeklySampleCounts', () => {
    const counts = 7
    mutations.setWeeklySampleCounts(state, counts)

    expect(state.weeklySampleCounts).toBe(counts)
  })

  test('setDailySampleCounts', () => {
    const counts = 2
    mutations.setDailySampleCounts(state, counts)

    expect(state.dailySampleCounts).toBe(counts)
  })

  test('setSequencedSampleNumbers', () => {
    const data: {labels: string[], counts: number[]} = {
      labels: ['test1', 'test2'],
      counts: [44, 932]
    }

    mutations.setSequencedSampleNumbers(state, data)

    expect(state.sequencedSampleNumbers).toEqual(data)
  })
})

describe('updateCommentOnLocalProject', () => {
  test('finds the correct project, and updates comment', () => {
    const projectArray: projectDataObject[] = [{ project: 'test-project1', pipeline: 'dna', url: 'test', run_id: 'newtestrun1', copy_results_prm: 'finished', comment: '' }, { project: 'test-project2', pipeline: 'dna', url: 'test', run_id: 'newtestrun1', copy_results_prm: 'finished', comment: 'did not change' }]

    mutations.setProjects(state, projectArray)

    mutations.updateCommentOnLocalProject(state, { projectName: 'test-project1', comment: 'updated' })

    expect(state.projects).toContainEqual({ project: 'test-project1', pipeline: 'dna', url: 'test', run_id: 'newtestrun1', copy_results_prm: 'finished', comment: 'updated' })
    expect(state.projects).toContainEqual({ project: 'test-project2', pipeline: 'dna', url: 'test', run_id: 'newtestrun1', copy_results_prm: 'finished', comment: 'did not change' })
  })
})
