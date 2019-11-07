import { State } from './state';
import { RunDataObject, projectDataObject, Job } from '@/types/dataTypes';
import { Serie } from '@/types/graphTypes';

export default {
  setRuns (state: State, runs: RunDataObject[]) {
    state.runs = runs
  },
  setProjects (state: State, projects: projectDataObject[]) {
    state.projects = projects
  },
  setJobs (state: State, jobs: Job[]) {
    state.jobs = jobs
  },
  setPipelineData(state: State, statistics: Serie[]) {
    state.statistics = statistics
  },
  setMachineRuntimes(state: State, series: Record<string, Serie[]>) {
    state.MachineRuntimes = series
  },
  setMachineSampleCounts(state: State, sampleCounts: Record<string, number[]>) {
    state.MachineSampleCounts = sampleCounts
  },
  setSequencerStatisticsSeries(state: State, series: number[]) {
    state.SequencerStatisticsSeries = series
  },
  setSequencerStatisticsLabels(state: State, labels: string[]) {
    state.SequencerStatisticsLabels = labels
  },
  setTotalCounts(state: State, counts: number) {
    state.totalSampleCounts = counts
  },
  setYearlySampleCounts(state: State, counts: number) {
    state.yearlySampleCounts = counts
  },
  setMonthlySampleCounts(state: State, counts: number) {
    state.monthlySampleCounts = counts
  },
  setWeeklySampleCounts(state: State, counts: number) {
    state.weeklySampleCounts = counts
  },
  setDailySampleCounts(state: State, counts: number) {
    state.dailySampleCounts = counts
  },
  setSequnecedSampleNumbers(state: State, data: {labels: string[], counts: number[]}){
    state.sequencedSampleNumbers = {
      labels: data.labels,
      counts: data.counts
    }
  }
}