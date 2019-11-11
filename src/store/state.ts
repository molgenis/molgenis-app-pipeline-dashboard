import {RawDataObject, projectDataObject, RunDataObject, ProjectObject, Job} from '@/types/dataTypes'
import { Serie } from '@/types/graphTypes';
export type State = {
  runs: RunDataObject[]
  projects: projectDataObject[]
  jobs: Job[]
  overviewTable: string
  projectsTable: string
  jobTable: string
  timingTable: string
  sampleTable: string
  pipelineTypes: string[]
  statistics: Serie[]
  statisticsEmpty: boolean
  machineRuntimes: Record<string,Serie[]>
  machineSampleCounts: Record<string, number[]>
  sequencerStatisticsSeries: number[]
  sequencerStatisticsLabels: string[]
  totalSampleCounts: number
  yearlySampleCounts: number
  monthlySampleCounts: number
  weeklySampleCounts: number
  dailySampleCounts: number
  sequencedSampleNumbers: {counts: number[], labels: string[]}
}

const state: State = {
  runs: [],
  projects: [],
  jobs: [],
  overviewTable: 'status_overview',
  projectsTable: 'status_projects',
  jobTable: 'status_jobs',
  timingTable: 'status_timing',
  sampleTable: 'status_samples',
  pipelineTypes: ['Exoom', 'ONCO', 'SVP', 'PCS'],
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
  sequencedSampleNumbers: {counts: [], labels: []}
}

export default state