export interface RawDataObject extends RunDataObject, projectDataObject, Job{

}

/**
 * Stores available Run information
 */
export class Run {
  run_id: string
  projects: ProjectObject[]
  demultiplexing: string
  rawCopy: string
  len: number
  containsError: Boolean
  copyState: number
  constructor(runID: string, projectArray: ProjectObject[], Demultiplexing: string, RawCopyState: string, lenght: number, error: Boolean, ResultCopyState: number){
    this.run_id = runID
    this.projects = projectArray
    this.demultiplexing = Demultiplexing
    this.rawCopy = RawCopyState
    this.len = lenght
    this.containsError = error
    this.copyState = ResultCopyState
  }
}

/**
 * Stores the Raw data properties of run
 */
export interface RunDataObject {
  run_id: string
  group: string
  demultiplexing: string
  copy_raw_prm: string
  projects: string[]
}
 
/**
 * Stores available project data
 * @function getRunType returns runtype
 * @function findLastDateTime returns last date in ms
 * @function findStartDateTime returns start time in ms
 * @function getRunTime returns runtime in ms
 */
export class ProjectObject {
  project: string
  jobs: Job[]
  pipeline: string
  resultCopyStatus?: string 
  status: string
  Comment?: string
  constructor(projectName: string, jobArray: Job[], pipelineType: string, statusString: string, resultCopyStatusString: string | undefined, comment: string | undefined){
    this.project = projectName
    this.jobs = jobArray
    this.pipeline = pipelineType
    this.resultCopyStatus = resultCopyStatusString
    this.status = statusString
    this.Comment = comment
  }
  getRunType() {
    const RegEx = new RegExp('-[A-Za-z]+(_[a-z0-9A-Z]+)?')
    const matches = this.project.match(RegEx)
    if (!matches) {
      return 'other'
    }
    return matches[0].slice(1)
  }
  findStartDateTime (): number {
    let StartedDate = Infinity
    this.jobs.forEach(job => {
      if (job.started_date){
        let CurrentJobDate = new Date(job.started_date).getTime()
        if (StartedDate > CurrentJobDate && !isNaN(StartedDate)) {
          StartedDate = CurrentJobDate
        }
      }
    })
    return StartedDate
  }
  findLastDateTime (): number {
    let FinishedDate = 0
    this.jobs.forEach(job => {
      if (job.finished_date){
        let CurrentJobDate = new Date(job.finished_date).getTime()
        if (FinishedDate < CurrentJobDate && !isNaN(FinishedDate)) {
          FinishedDate = CurrentJobDate
        }
      }
    })

    return FinishedDate
  }
  getRunTime(): number {
    return this.findLastDateTime() - this.findStartDateTime()
  }

}

/**
 * Stores Raw project data in an object
 */
export interface projectDataObject{
  project: string
  url: string
  run_id: string
  pipeline: string
  copy_results_prm?: string
  comment?: string
}

/**
 * Stores Job information
 */
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

/**
 * Stores a step status
 */
export interface Step {
  run: string
  step: number
  containsError: Boolean
  len: number
}

/**
 * run runtime
 * @property runId run identifier
 * @property runtime runtime in hours
 */
export class RunTime {
  runId: string
  runtime: number
  constructor(id: string, time: number) {
    this.runId = id
    this.runtime = Math.round(((time / 1000) / 3600) * 10) / 10
  }
}

/**
 * A point in the graph for a run
 * @function getMax gets larges point in data
 */
export class RunTimeStatistic {
  ONCO: RunTime
  Exoom: RunTime
  PCS: RunTime
  SPV: RunTime
  other: RunTime[]
  constructor(projects: ProjectObject[], runId: string) {
    const regONCO = new RegExp('ONCO.*')
    const regExoom = new RegExp('Exoom.*')
    const regPCS = new RegExp('PCS.*')
    const regSPV = new RegExp('SPV.*')

    let other = [] as RunTime[]
    this.Exoom = new RunTime('no data', 0)
    this.ONCO = new RunTime('no data', 0)
    this.SPV = new RunTime('no data', 0)
    this.PCS = new RunTime('no data', 0)
    projects.forEach((project: ProjectObject) => {
      let runType = project.getRunType()
      let runTimeObject = new RunTime(runId, project.getRunTime())
      if (runType.match(regONCO)) {
        this.ONCO = runTimeObject
      } else if (runType.match(regExoom)) {
        this.Exoom = runTimeObject
      } else if (runType.match(regPCS)) {
        this.PCS = runTimeObject
      } else if (runType.match(regSPV)) {
        this.SPV = runTimeObject
      } else {
        other.push(runTimeObject)
      }

    })
    this.other = other
  }
  getMax(): number {
    let max = this.ONCO.runtime
    if (max < this.Exoom.runtime) {
      max = this.Exoom.runtime
    }
    if (max < this.PCS.runtime) {
      max = this.PCS.runtime
    }
    if (max < this.SPV.runtime) {
      max = this.SPV.runtime
    }
    return max
  }
}

/**
 * Raw credentials Response
 */
export interface responseJSON {
  token: string
  username: string
}

export class Comment {
  name: string
  comment: string
  constructor(name: string, text: string) {
    this.name = name,
    this.comment = text
  }
}