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
  setRuntimeStatistics(state: State, statistics: object) {
    state.statistics = statistics
    state.statisticsEmpty = false
  },
  setRuntimeStatisticsEmpty(state: State) {
    state.statisticsEmpty = true
  },
  setMachineRuntimes(state: State, series: Serie[]) {
    state.MachineRuntimes = series
  },
  setMachineSampleCounts(state: State, sampleCounts: Record<string, number[]>) {
    state.MachineSampleCounts = sampleCounts
  }
}