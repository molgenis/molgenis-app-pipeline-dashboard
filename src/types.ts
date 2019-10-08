export interface RawDataObject extends RunDataObject, projectDataObject, Job{

}

export class Run {
  run_id: string
  projects: projectObject[]
  demultiplexing: string
  rawCopy: string
  len: number
  containsError: Boolean
  copyState: number
  constructor(runID: string, projectArray: projectObject[], Demultiplexing: string, RawCopyState: string, lenght: number, error: Boolean, ResultCopyState: number){
    this.run_id = runID
    this.projects = projectArray
    this.demultiplexing = Demultiplexing
    this.rawCopy = RawCopyState
    this.len = lenght
    this.containsError = error
    this.copyState = ResultCopyState
  }
}

export interface RunDataObject {
  run_id: string
  group: string
  demultiplexing: string
  copy_raw_prm: string
  projects: string[]
}
 
export class projectObject {
  project: string
  jobs: Array<Job>
  pipeline: string
  resultCopyStatus?: string 
  status: string
  constructor(projectName: string, jobArray: Job[], pipelineType: string, statusString: string, resultCopyStatusString: string | undefined){
    this.project = projectName
    this.jobs = jobArray
    this.pipeline = pipelineType
    this.resultCopyStatus = resultCopyStatusString
    this.status = statusString
  }
}

export interface projectDataObject{
  project: string
  url: string
  run_id: string
  pipeline: string
  copy_results_prm?: string
}

export interface Job {
  project_job: string
  job: string
  project: string
  url: string
  status: string
  step: string
  started_date?: string
  finished_date?: string
}

export interface Step {
  run: string
  step: number
  containsError: Boolean
  len: number
}