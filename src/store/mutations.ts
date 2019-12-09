/**
 * @module store
 */

import { State } from '@/store/state'
import { RunDataObject, projectDataObject, Job, ProjectObject, Run, parseStatus } from '@/types/dataTypes'
import { Serie, IdentifiedSerie } from '@/types/graphTypes'
import { JobCounts, RunData, ProjectData } from '@/types/Run';

/**
 * commits raw run table data to store
 * @param state - application context
 * @param runs - Raw run data
 */
function setRuns (state: State, runs: RunDataObject[]) {
  state.runs = runs
  if (!state.runsLoaded) {
    state.runsLoaded = true
  }
}
/**
 * commits raw project table data to store
 * @param state - application context
 * @param projects - raw project data
 */
function setProjects (state: State, projects: projectDataObject[]) {
  state.projects = projects
  if (!state.projectsLoaded) {
    state.projectsLoaded = true
  }
}

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
/**
 * updates localy stored project comment
 *
 * Finds the stored project and updates its comment acordingly
 * @param state - application state
 * @param param1 - project id and the new comment
 * @param param1.projectName - Project ID
 * @param param1.comment - new comment content
 */
function updateCommentOnLocalProject (state: State, { projectName, comment }: {projectName: string, comment: string}) {
  const index = state.projects.findIndex(project => project.project === projectName)
  state.projects[index].comment = comment
}

/**
 * sets the converted project objects
 * @param state - application state
 * @param projects - converted project objects
 */
function setProjectObjects (state: State, projects: Record<string, ProjectData[]>) {
  state.projectObjects = projects
}

function clearRawData (state: State) {
  state.runs = []
  state.projects = []
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
export default {
  setRuns,
  setProjects,
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
  setProjectObjects,
  updateCommentOnLocalProject,
  clearRawData,
  setJobAggregates,
  setRunV2s,
  updateProjectDates
}
