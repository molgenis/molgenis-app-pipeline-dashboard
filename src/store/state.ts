import {RawDataObject, projectDataObject, RunDataObject, ProjectObject, Job} from '@/types/dataTypes'
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
  AccessToken: 'admin-test-token'
}

export default state