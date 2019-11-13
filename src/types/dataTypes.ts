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
  status: string
  resultCopyStatus?: string
  Comment?: string
  
  constructor(projectName: string, jobArray: Job[], pipeline: string, statusString: string, resultCopyStatusString: string | undefined, comment: string | undefined){
    this.project = projectName
    this.jobs = jobArray
    this.pipeline = pipeline
    this.resultCopyStatus = resultCopyStatusString
    this.status = statusString
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
  ONCO: RunTime
  Exoom: RunTime
  PCS: RunTime
  SVP: RunTime
  other: RunTime[]
  constructor(projects: ProjectObject[], runId: string) {
    let other = [] as RunTime[]
    this.Exoom = new RunTime('no data', 0)
    this.ONCO = new RunTime('no data', 0)
    this.SVP = new RunTime('no data', 0)
    this.PCS = new RunTime('no data', 0)
    projects.forEach((project: ProjectObject) => {
      let runTimeObject = new RunTime(runId, project.getRunTime())

      switch (project.getProjectType()) {
        case pipelineType.onco:
          this.ONCO = runTimeObject
          break
        case pipelineType.exoom:
          this.Exoom = runTimeObject
          break
        case pipelineType.pcs:
          this.PCS = runTimeObject
          break
        case pipelineType.svp:
          this.SVP = runTimeObject
          break
        default:
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
    if (max < this.SVP.runtime) {
      max = this.SVP.runtime
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
