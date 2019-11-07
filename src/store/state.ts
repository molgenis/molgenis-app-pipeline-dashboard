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
  APIv1: string
  APIv2: string
  AccessToken: string
  pipelineTypes: string[]
  statistics: Serie[]
  statisticsEmpty: boolean
  MachineRuntimes: Record<string,Serie[]>
  MachineSampleCounts: Record<string, number[]>
  SequencerStatisticsSeries: number[]
  SequencerStatisticsLabels: string[]
  totalSampleCounts: number
  yearlySampleCounts: number
  monthlySampleCounts: number
  weeklySampleCounts: number
  dailySampleCounts: number
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
  APIv1: 'http://localhost:8081/api/v1/',
  APIv2: 'http://localhost:8081/api/v2/',
  AccessToken: 'admin-test-token',
  pipelineTypes: ['Exoom', 'ONCO', 'SVP', 'PCS'],
  statistics: [],
  statisticsEmpty: true,
  MachineRuntimes: {},
  MachineSampleCounts: {},
  SequencerStatisticsLabels: [],
  SequencerStatisticsSeries: [],
  totalSampleCounts: 0,
  yearlySampleCounts: 0,
  monthlySampleCounts: 0,
  weeklySampleCounts: 0,
  dailySampleCounts: 0
}

export default state