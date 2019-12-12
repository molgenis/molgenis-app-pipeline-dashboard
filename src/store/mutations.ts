/**
 * @module store
 */

import { State } from '@/store/state'
import { Serie, IdentifiedSerie, durationStatisticsStorage } from '@/types/graphTypes'
import { JobCounts, RunData, ProjectData } from '@/types/Run';
import { Sample } from '@/types/dataTypes';


/**
 * sets the pipeline runtime data for visualization
 * @param state - application context
 * @param statistics - pipeline series data
 */
function setPipelineData (state: State, statistics: Serie[]) {
  state.statistics = statistics
}
/**
 * sets the machine runtime data for visualization
 * @param state - application context
 * @param series - runtimes for each machine
 */
function setMachineRuntimes (state: State, series: Record<string, IdentifiedSerie[]>) {
  state.machineRuntimes = series
}
/**
 * sets the machine sample counts for visualization
 * @param state - application context
 * @param sampleCounts - sample counts per machine
 */
function setMachineSampleCounts (state: State, sampleCounts: Record<string, number[]>) {
  state.machineSampleCounts = sampleCounts
}
/**
 * sets the sequencer series for visualization
 * @param state - application context
 * @param series - sequencer series data
 */
function setSequencerStatisticsSeries (state: State, series: number[]) {
  state.sequencerStatisticsSeries = series
}
/**
 * sets the labels for the sequencer statistics visualization
 * @param state - application context
 * @param labels - labels paired to sequencer series data
 */
function setSequencerStatisticsLabels (state: State, labels: string[]) {
  state.sequencerStatisticsLabels = labels
}
/**
 * sets the total sequenced sample counts
 * @param state - application context
 * @param counts - sample counts
 */
function setTotalCounts (state: State, counts: number) {
  state.totalSampleCounts = counts
}
/**
 * sets the yearly sequenced sample counts
 * @param state - application context
 * @param counts - sample counts
 */
function setYearlySampleCounts (state: State, counts: number) {
  state.yearlySampleCounts = counts
}
/**
 * sets the monthly sequenced sample counts
 * @param state - application context
 * @param counts - sample counts
 */
function setMonthlySampleCounts (state: State, counts: number) {
  state.monthlySampleCounts = counts
}
/**
 * sets the weekly sequenced sample counts
 * @param state - application context
 * @param counts - sample counts
 */
function setWeeklySampleCounts (state: State, counts: number) {
  state.weeklySampleCounts = counts
}
/**
 * sets the daily sequenced sample counts
 * @param state - application context
 * @param counts - sample counts
 */
function setDailySampleCounts (state: State, counts: number) {
  state.dailySampleCounts = counts
}
/**
 * sets the sequenced samples and their labels
 * @param state - application context
 * @param data - sequenced samples
 */
function setSequencedSampleNumbers (state: State, data: {labels: string[], counts: number[]}) {
  state.sequencedSampleNumbers = {
    labels: data.labels,
    counts: data.counts
  }
}




function setJobAggregates (state: State, aggregates: Record<string, JobCounts>) {
  if (!state.jobsLoaded) {
    state.jobsLoaded = true
  }
  state.jobAggregates = aggregates
}

function setRunV2s(state: State, runs: RunData[]) {
  if (!state.rawDataConverted) {
    state.rawDataConverted = true
  }
  state.runV2 = runs
}

function updateProjectDates(state: State, entry: {projectID: string, startedDate: Date, finishedDate?: Date}) {
  state.projectDates[entry.projectID] = {startedDate: entry.startedDate, finishedDate: entry.finishedDate}
}

function runsLoaded(state: State) {
  state.runsLoaded = true
}
function projectsLoaded(state: State) {
  state.projectsLoaded = true
}
function jobsLoaded(state: State) {
  state.jobsLoaded = true
}
function updateClusterPings(state: State, clusters: {cluster_name: string, latest_ping_timestamp: string}[]) {
  clusters.forEach((cluster) => {
    state.clusterPings[cluster.cluster_name] = new Date(cluster.latest_ping_timestamp)
  })
}
function setDurationStatistics(state: State, durationStatistics: Record<string, durationStatisticsStorage>) {
  state.durations = durationStatistics
}
function addNewProjectInfo(state: State, {project, comment, samples} : {project: string, comment: string, samples: Sample[]}) {
  state.loadedProjectInfo[project] = {comment: comment, samples: samples}
}

function setTimingStatistics(state: State, TimeSeries: Record<string, Record<string, number>>) {
  state.timeSeries = TimeSeries
}
export default {
  setPipelineData,
  setMachineRuntimes,
  setMachineSampleCounts,
  setSequencerStatisticsLabels,
  setSequencerStatisticsSeries,
  setSequencedSampleNumbers,
  setTotalCounts,
  setDailySampleCounts,
  setMonthlySampleCounts,
  setYearlySampleCounts,
  setWeeklySampleCounts,
  setJobAggregates,
  setRunV2s,
  updateProjectDates,
  runsLoaded,
  projectsLoaded,
  jobsLoaded,
  updateClusterPings,
  setDurationStatistics,
  addNewProjectInfo,
  setTimingStatistics
}
