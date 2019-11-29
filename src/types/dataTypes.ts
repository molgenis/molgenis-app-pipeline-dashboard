import { parse } from '@fortawesome/fontawesome-svg-core';

export interface RawDataObject extends RunDataObject, projectDataObject, Job{

}

export enum statusCode {
  waiting = 'waiting',
  error = 'error',
  finished = 'finished',
  started = 'started',
  other = 'other'
}

export function parseStatus(statusString: string): statusCode {
  if (statusString.match(/waiting/gi)) {
    return statusCode.waiting
  }
  if (statusString.match(/error/gi)) {
    return statusCode.error
  }
  if (statusString.match(/finished/gi)) {
    return statusCode.finished
  }
  if (statusString.match(/started/gi)) {
    return statusCode.started
  }
  return statusCode.other
}
/**
 * Stores available Run information
 */
export class Run {
  run_id: string
  demultiplexing: string
  rawCopy: string
  len: number
  containsError: Boolean
  copyState: number
  finished: Boolean
  constructor(runID: string, Demultiplexing: string, RawCopyState: string, lenght: number, error: Boolean, ResultCopyState: number, finished: boolean){
    this.run_id = runID
    this.demultiplexing = Demultiplexing
    this.rawCopy = RawCopyState
    this.len = lenght
    this.containsError = error
    this.copyState = ResultCopyState
    this.finished = finished
  }
  getDemultiplexingStatus(): statusCode {
    return parseStatus(this.demultiplexing)
  }
  getRawDataCopyingStatus(): statusCode {
    if (this.rawCopy) {
      return parseStatus(this.rawCopy)
    }
    return statusCode.finished
  }
  getCurrentStep(): number {
    switch (this.getDemultiplexingStatus()) {
      case statusCode.started:
        return 0
      case statusCode.error:
        return 0
      case statusCode.waiting:
        return -1
      default:
        const rawCopyStatus = this.getRawDataCopyingStatus()
        if ( rawCopyStatus === statusCode.started || rawCopyStatus === statusCode.error) {
          return 1
          // selectedRunObject result copying check
        } else if (this.copyState > 0) {
          return this.finished ? 4 : this.copyState === 4 ? 3 : 2 
        } else {
          return 2
        }
    }
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
 * Standardized pipeline type enum
 */
export enum pipelineType {
  onco = 'ONCO',
  pcs = 'PCS',
  exoom = 'Exoom',
  svp = 'SVP',
  other = 'OTHER'
}


enum dateSearch {
  started = 'started_date',
  finished = 'finished_date'
}

/**
 * Stores available project data
 * @function findLastDateTime returns last date in ms
 * @function findStartDateTime returns start time in ms
 * @function getRunTime returns runtime in ms
 * @function getProjectType returns project pipeline type
 */
export class ProjectObject {
  project: string
  jobs: Job[]
  pipeline: string
  status: statusCode
  resultCopyStatus?: string
  Comment?: string
  
  constructor(projectName: string, jobArray: Job[], pipeline: string, statusString: string, resultCopyStatusString: string | undefined, comment: string | undefined){
    this.project = projectName
    this.jobs = jobArray
    this.pipeline = pipeline
    this.resultCopyStatus = resultCopyStatusString
    this.status = parseStatus(statusString)
    this.Comment = comment
  }
  /**
   * Gets the date that is relevant to the dateKey search
   * @param dateToCheck date to compare to
   * @param date date
   * @param dateKey started date or finished date
   */
  private checkDateOfJob(dateToCheck: string, date: number, dateKey: string): number {
    if (dateToCheck) {
      let CurrentJobDate = new Date(dateToCheck!).getTime()
      if (!isNaN(CurrentJobDate)){
        if (dateKey === dateSearch.finished && date < CurrentJobDate) {
          date = CurrentJobDate
        } else if (dateKey === dateSearch.started && date > CurrentJobDate) {
          date = CurrentJobDate
        }
      }
    }
    return date
  }
  /**
   * Gets the date that belongs to the calculation using the date key
   * 
   * @param date - value to compare date to
   * @param dateKey - which job collumn to search ( started_date or finished_date ) 
   */
  private getRelevantDate (date: number, dateKey: string) {
    this.jobs.forEach((job: Job) => {
      //@ts-ignore
      const dateToCheck = job[dateKey]

      date = this.checkDateOfJob(dateToCheck, date, dateKey)
    })
    return date
  }
  public getProjectType(): pipelineType {
    if (this.project.match(new RegExp('ONCO.*'))) {
      return pipelineType.onco
    }
    if (this.project.match(new RegExp('Exoom.*'))){
      return pipelineType.exoom
    }
    if (this.project.match(new RegExp('PCS.*'))) {
      return pipelineType.pcs
    } 
    if (this.project.match(new RegExp('S[VP]{2}.*'))) {
      return pipelineType.svp
    }
    return pipelineType.other
  }
  public findLastDateTime (): number {
    return this.getRelevantDate(0, dateSearch.finished)
  }
  public findStartDateTime (): number {
    return this.getRelevantDate(Infinity, dateSearch.started)
  }
  public getRunTime(): number {
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
  ONCO = new RunTime('no data', 0)
  Exoom = new RunTime('no data', 0)
  PCS = new RunTime('no data', 0)
  SVP = new RunTime('no data', 0)
  other: RunTime[] = []
  constructor(projects: ProjectObject[], runId: string) {
    projects.forEach((project: ProjectObject) => {
      let runTimeObject = new RunTime(runId, project.getRunTime())

      switch (project.getProjectType()) {
        case pipelineType.onco:
          this.setOnco(runTimeObject)
          break
        case pipelineType.exoom:
          this.setExoom(runTimeObject)
          break
        case pipelineType.pcs:
          this.setPcs(runTimeObject)
          break
        case pipelineType.svp:
          this.setSvp(runTimeObject)
          break
        default:
          this.updateOtherRuntimes(runTimeObject)
      }
    })
  }
  private setOnco(runtime: RunTime) {
    this.ONCO = runtime
  }
  private setExoom(runtime: RunTime) {
    this.Exoom = runtime
  }
  private setPcs(runtime: RunTime) {
    this.PCS = runtime
  }
  private setSvp(runtime: RunTime) {
    this.SVP = runtime
  }
  private updateOtherRuntimes(runtime: RunTime) {
    this.other.push(runtime)
  }
  private compareNums(max: number, current: number) {
    return max > current ? max : current
  }
  public getOncoRuntime () {
    return this.ONCO.runtime
  }
  public getExoomRuntime () {
    return this.Exoom.runtime
  }
  public getPcsRuntime () {
    return this.PCS.runtime
  }
  public getSvpRuntime () {
    return this.SVP.runtime
  }

  public getMax(): number {
    return this.compareNums(this.getOncoRuntime(), this.compareNums(this.getExoomRuntime(), this.compareNums(this.getPcsRuntime(), this.getSvpRuntime())))
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

/**
 * Stores numbers for the diffrent pipeline types
 */
export class AverageData {
  ONCO: number
  PCS: number
  Exoom: number
  SVP: number
  constructor (onco: number, pcs: number, exoom: number, svp: number) {
    this.ONCO = onco
    this.PCS = pcs
    this.Exoom = exoom
    this.SVP = svp
  }
}

export interface RunStatusData {
  containsError: boolean
  len: number
  run: string
  step: number
}
