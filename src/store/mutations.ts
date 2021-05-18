/**
 * @module store
 */

import { State } from '@/store/state'
import { Serie, IdentifiedSerie, DurationStatisticsStorage } from '@/types/graphTypes'
import { JobCounts, RunData } from '@/types/Run'
import { Sample } from '@/types/dataTypes'
import { convertSampleDate } from '@/helpers/dates'

/**
 * sets the pipeline runtime data for visualization
 * @param state - application context
 * @param statistics - pipeline series data
 */
function setPipelineData (state: State, statistics: Serie[]): void{
  state.statistics = statistics
}
/**
 * sets the machine runtime data for visualization
 * @param state - application context
 * @param series - runtimes for each machine
 */
function setMachineRuntimes (state: State, series: Record<string, IdentifiedSerie[]>): void{
  state.machineRuntimes = series
}
/**
 * sets the machine sample counts for visualization
 * @param state - application context
 * @param sampleCounts - sample counts per machine
 */
function setMachineSampleCounts (state: State, sampleCounts: Record<string, number[]>): void{
  state.machineSampleCounts = sampleCounts
}
/**
 * sets the sequencer series for visualization
 * @param state - application context
 * @param series - sequencer series data
 */
function setSequencerStatisticsSeries (state: State, series: number[]): void{
  state.sequencerStatisticsSeries = series
}
/**
 * sets the labels for the sequencer statistics visualization
 * @param state - application context
 * @param labels - labels paired to sequencer series data
 */
function setSequencerStatisticsLabels (state: State, labels: string[]): void{
  state.sequencerStatisticsLabels = labels
}
/**
 * sets the total sequenced sample counts
 * @param state - application context
 * @param counts - sample counts
 */
function setTotalCounts (state: State, counts: number): void{
  state.totalSampleCounts = counts
}
/**
 * sets the yearly sequenced sample counts
 * @param state - application context
 * @param counts - sample counts
 */
function setYearlySampleCounts (state: State, counts: number): void{
  state.yearlySampleCounts = counts
}
/**
 * sets the monthly sequenced sample counts
 * @param state - application context
 * @param counts - sample counts
 */
function setMonthlySampleCounts (state: State, counts: number): void{
  state.monthlySampleCounts = counts
}
/**
 * sets the weekly sequenced sample counts
 * @param state - application context
 * @param counts - sample counts
 */
function setWeeklySampleCounts (state: State, counts: number): void{
  state.weeklySampleCounts = counts
}
/**
 * sets the daily sequenced sample counts
 * @param state - application context
 * @param counts - sample counts
 */
function setDailySampleCounts (state: State, counts: number): void{
  state.dailySampleCounts = counts
}
/**
 * sets the sequenced samples and their labels
 * @param state - application context
 * @param data - sequenced samples
 */
function setSequencedSampleNumbers(state: State, data: { labels: number[]; counts: number[] }): void {
  state.sequencedSampleNumbers = {
    labels: data.labels.map(seqDate => convertSampleDate(seqDate)),
    counts: data.counts
  }
}
/**
 * Sets the job status counts
 * @param state - application context
 * @param aggregates - job aggregates
 */
function setJobAggregates (state: State, aggregates: Record<string, JobCounts>): void{
  if (!state.jobsLoaded) {
    state.jobsLoaded = true
  }
  state.jobAggregates = aggregates
}
/**
 * Sets the reworked Run objects
 * @param state - application context
 * @param runs - Run objects with a identifier
 */
function setRunV2s (state: State, runs: Record<string, RunData>): void{
  if (!state.rawDataConverted) {
    state.rawDataConverted = true
  }
  state.runV2 = runs
}
/**
 * update the dates for the given project
 * @param state - application context
 * @param entry - function params
 * @param entry.projectID - project to change dates for
 * @param entry.startedDate - new started date
 * @param entry.finishedDate - new finished date if the project is finished
 */
function updateProjectDates (state: State, entry: {projectID: string; startedDate: Date; finishedDate?: Date}): void{
  state.projectDates[entry.projectID] = { startedDate: entry.startedDate, finishedDate: entry.finishedDate }
}
/**
 * set the runs loading status to finished(true)
 * @param state - application context
 */
function runsLoaded (state: State): void{
  state.runsLoaded = true
}
/**
 * set the projects loading status to finished(true)
 * @param state - application context
 */
function projectsLoaded (state: State): void{
  state.projectsLoaded = true
}
/**
 * sets the jobs loading status to finished(true)
 * @param state - application context
 */
function jobsLoaded (state: State): void{
  state.jobsLoaded = true
}
/**
 * update the pings for the clusters
 * @param state - application context
 * @param clusters - updated cluster data
 * @param clusters.cluster_name - cluster name
 * @param clusters.latest_ping_timestamp - most recent ping as a JS date
 */
function updateClusterPings (state: State, clusters: {cluster_name: string; latest_ping_timestamp: string}[]): void{
  clusters.forEach((cluster) => {
    state.clusterPings[cluster.cluster_name] = new Date(cluster.latest_ping_timestamp)
  })
}
/**
 * sets the pipeline duration statistics 
 * @param state - application context
 * @param durationStatistics - new duration statistics 
 */
function setDurationStatistics (state: State, durationStatistics: Record<string, DurationStatisticsStorage>): void{
  state.durations = durationStatistics
}
/**
 * adds newly loaded project information
 * 
 * * comment: user added comments
 * * samples: samples from sampleTable
 * 
 * @param state - application context
 * @param param1 - function parameters
 * @param param1.project - project to update
 * @param param1.comment - comment to update
 * @param param1.samples - new samples to update
 */
function addNewProjectInfo (state: State, { project, comment, samples }: {project: string; comment: string; samples: Sample[]}): void{
  state.loadedProjectInfo[project] = { comment: comment, samples: samples }
}
/**
 * Sets the timing statistics
 * @param state - application context
 * @param TimeSeries - new time series
 */
function setTimingStatistics (state: State, TimeSeries: Record<string, Record<string, number>>): void {
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
