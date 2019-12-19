/**
 * @module store
 */

import { Sample } from '@/types/dataTypes'
import { Serie, IdentifiedSerie, DurationStatisticsStorage } from '@/types/graphTypes'
import { JobCounts, RunData } from '@/types/Run'

export type State = {
  overviewTable: string;
  projectsTable: string;
  jobTable: string;
  timingTable: string;
  sampleTable: string;
  clusterTable: string;
  pipelineTypes: string[];
  statistics: Serie[];
  statisticsEmpty: boolean;
  machineRuntimes: Record<string, IdentifiedSerie[]>;
  machineSampleCounts: Record<string, number[]>;
  sequencerStatisticsSeries: number[];
  sequencerStatisticsLabels: string[];
  totalSampleCounts: number;
  yearlySampleCounts: number;
  monthlySampleCounts: number;
  weeklySampleCounts: number;
  dailySampleCounts: number;
  sequencedSampleNumbers: {counts: number[]; labels: string[]};
  MainInfoStatus: boolean;
  runsLoaded: boolean;
  projectsLoaded: boolean;
  jobsLoaded: boolean;
  checkedCommentStatus: boolean;
  CommentUpdatedStatus: boolean;
  CommentNetworkError: boolean;
  rawDataConverted: boolean;
  jobAggregates: Record<string, JobCounts>;
  runV2: Record<string, RunData>;
  projectDates: Record<string, {startedDate: Date; finishedDate?: Date}>;
  clusterPings: Record<string, Date>;
  durations: Record<string, DurationStatisticsStorage>;
  loadedProjectInfo: Record<string, {comment: string; samples: Sample[]}>;
  timeSeries: Record<string, Record<string, number>>;
  hidden: string[];
}

const state: State = {
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
  runV2: {},
  projectDates: {},
  clusterPings: {},
  durations: {},
  loadedProjectInfo: {},
  timeSeries: {},
  hidden: [] as string[]
}

export default state
