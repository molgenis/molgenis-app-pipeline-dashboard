import mutations from '../../../src/store/mutations'
import { State } from '../../../src/store/state'
import { Serie, IdentifiedSerie } from '../../../src/types/graphTypes'

let state: State

beforeEach(() => {
  state = {
    overviewTable: 'status_overview',
    projectsTable: 'status_projects',
    jobTable: 'status_jobs',
    timingTable: 'status_timing',
    sampleTable: 'status_samples',
    clusterTable: 'aaaac3wwfsa676qwhzjo7ayaae',
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
    rawDataConverted: false,
    checkedCommentStatus: false,
    CommentUpdatedStatus: false,
    CommentNetworkError: false,
    jobAggregates: {},
    runV2: [],
    projectDates: {},
    clusterPings: {},
    durations: {},
    loadedProjectInfo: {},
    timeSeries: {}
  }
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
    const data: {labels: string[]; counts: number[]} = {
      labels: ['test1', 'test2'],
      counts: [44, 932]
    }

    mutations.setSequencedSampleNumbers(state, data)

    expect(state.sequencedSampleNumbers).toEqual(data)
  })
})