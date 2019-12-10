/**
 * @module store
 */

import { projectDataObject, RunDataObject, ProjectObject, Job, Run, statusCode } from '@/types/dataTypes'
import { Serie, IdentifiedSerie } from '@/types/graphTypes'
import { JobCounts, JobCounter, RunData, ProjectData } from '@/types/Run';


export type State = {
  overviewTable: string
  projectsTable: string
  jobTable: string
  timingTable: string
  sampleTable: string
  pipelineTypes: string[]
  statistics: Serie[]
  statisticsEmpty: boolean
  machineRuntimes: Record<string, IdentifiedSerie[]>
  machineSampleCounts: Record<string, number[]>
  sequencerStatisticsSeries: number[]
  sequencerStatisticsLabels: string[]
  totalSampleCounts: number
  yearlySampleCounts: number
  monthlySampleCounts: number
  weeklySampleCounts: number
  dailySampleCounts: number
  sequencedSampleNumbers: {counts: number[], labels: string[]}
  MainInfoStatus: boolean
  runsLoaded: boolean
  projectsLoaded: boolean
  jobsLoaded: boolean
  checkedCommentStatus: boolean
  CommentUpdatedStatus: boolean
  CommentNetworkError: boolean
  rawDataConverted: boolean
  jobAggregates: Record<string, JobCounts>
  runV2: RunData[],
  projectDates: Record<string, {startedDate: Date, finishedDate?: Date}>
}

const state: State = {
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
  rawDataConverted: false,
  checkedCommentStatus: false,
  CommentUpdatedStatus: false,
  CommentNetworkError: false,
  jobAggregates: {},
  runV2: [],
  projectDates: {}
}

export default state
