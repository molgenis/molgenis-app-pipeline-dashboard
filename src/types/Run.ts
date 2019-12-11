import { statusCode } from './dataTypes';
import { Step, defaultStep, counterStep, DualStateStep } from './step';

/**
 * Defines a run object
 * @property {string} runID - Run identifier
 * @property {Array<Object>} projects - Array of projects
 */
export interface Run {
  projects: Project[]
  steps: Step[]
  getErrorCount(): number
  getSize(): number
  getStatus(): statusCode
  getCurrentStep(): number
}

export function constructSteps(demultiplexing: statusCode, raw: statusCode, running: {finished: number, started: number, waiting: number}, copying: {started: number, finished: number, waiting: number}, finished: {total: number, finished: number}): Step[] {
  const stepOne = new defaultStep('demultiplexing', demultiplexing)
  const stepTwo = new defaultStep('Copying Raw files to PRM', raw)
  const stepThree = new counterStep('running pipelines', running.finished + running.started + running.waiting)
  const stepFour = new counterStep('copying result files', copying.waiting + copying.started + copying.finished)
  const stepFive = new DualStateStep('Finished worlflow', finished.total)

  if (finished.total === finished.finished) {
    stepOne.setFinished()
    stepTwo.setFinished()
    stepThree.setFinished()
    stepFour.setFinished()
    stepFive.setFinished()
  } else if (copying.started > 0 || copying.finished > 0) {
    stepOne.setFinished()
    stepTwo.setFinished()
  if (running.started === 0 && running.waiting === 0 && running.finished > 1) {
      stepThree.setFinished()
    }
  } else if (running.started > 0 || running.finished > 0) {
    stepOne.setFinished()
    stepTwo.setFinished()
  } else if (raw === statusCode.finished || raw === statusCode.started) {
    stepOne.setFinished()
  }

  return [
    stepOne,
    stepTwo,
    stepThree,
    stepFour,
    stepFive
  ]
}
/**
 * 
 */
export class RunData implements Run {
  projects: Project[]
  steps: Step[]
  /**
   * @constructor
   * @param runID Run id
   * @param projects Run projects
   */
  constructor(projects: Project[], steps: Step[]) {
    this.projects = projects
    this.steps = steps
  }
  getErrorCount() {
    return this.projects.reduce((total, currentValue) => total + currentValue.getErrorCount(), 0)
  }
  getSize() {
    return this.projects.length
  }
  getStatus() {
    if (this.getErrorCount() > 0) {
      return statusCode.error
    }
    const statusArray = this.steps.map(step => step.getStatus())
    if (statusArray.includes(statusCode.started)) {
      return statusCode.started
    }
    if (statusArray.every(step => step === statusCode.finished)) {
      return statusCode.finished
    }
    return statusCode.waiting
  }
  getCurrentStep() {
    return this.steps.reduce((prev, step) => prev += step.getStatus() === statusCode.finished ? 1 : 0, 0) - 1
  }

  
}

export interface Project {
  projectID: string
  comment: boolean
  jobs: JobCounts
  getErrorCount(): number
  getFinishedCount(): number
  getRunningCount(): number
  getWaitingCount(): number
  getStatus(): statusCode
  findStartDateTime(): number
  findLastDateTime(): number
  /**
   * 
   * @param dateGetter Data retrieval function
   */
  getDates(dateGetter: dateGetter): Promise<{startedDate: Date | null, finishedDate: Date | null}> // needs a function that calls to api
  
}

export interface runTimeDates {startedDate: Date, finishedDate: Date}

/**
 * date api caller function
 * @param {String} projectID project to search
 */
export interface dateGetter {
  (projectID: string): Promise<runTimeDates>
}

export class ProjectData implements Project{
  projectID: string
  resultCopyStatus: statusCode
  jobs: JobCounts
  comment = false
  private startedDate = 0
  private finishedDate = 0
  async getDates(dateGetter: dateGetter): Promise<runTimeDates> {
    return new Promise((resolve, reject) => {
    if (this.jobs.getStatus() === statusCode.started || this.jobs.getStatus() === statusCode.finished) {
      dateGetter(this.projectID)
      .then((result) => {
        this.finishedDate = result.finishedDate.getTime()
        this.startedDate = result.startedDate.getTime()
      }).catch((error) => {
        reject(error)
      })
    } else {
      resolve()
    }
    })
  }
  constructor(projectID: string, resultCopyStatus: statusCode, jobs: JobCounts, comment: boolean) {
    this.resultCopyStatus = resultCopyStatus
    this.projectID = projectID
    this.jobs = jobs ? jobs : new JobCounter({ waiting: 0, started: 0, finished: 0, error: 0 })
    if (resultCopyStatus === statusCode.started || resultCopyStatus === statusCode.finished) {
      this.jobs.setFinished()
    }
    this.comment = comment
  }
  getErrorCount(): number {
    return this.jobs.error
  }
  getFinishedCount(): number {
    return this.jobs.finished;
  }
  getRunningCount(): number {
    return this.jobs.started
  }
  getWaitingCount(): number {
    return this.jobs.waiting
  }
  findStartDateTime(): number {
    return this.startedDate
  }
  findLastDateTime(): number {
    return this.finishedDate
  }
  getStatus() {
    return this.jobs.getStatus()
  }
}

export interface JobCounts {
  waiting: number
  started: number
  finished: number
  error: number
  other?: number
  getStatus(): statusCode
  setFinished(): void
}

export class JobCounter implements JobCounts {
  waiting: number
  started: number
  finished: number
  error: number
  other?: number
  getStatus() {
    if (this.error > 0) {
      return statusCode.error
    }
    if (this.finished > 0) {
      return this.started > 0 || this.waiting > 0? statusCode.started : statusCode.finished
    }
    return statusCode.waiting
  }
  setFinished() {
    const sum = this.waiting + this.started + this.finished + this.error
    this.waiting = 0
    this.started = 0
    this.error = 0
    this.finished = sum
  }
  constructor({waiting, started, finished, error} : {waiting: number, started: number, finished: number, error: number}) {
    this.waiting = waiting
    this.started = started
    this.finished = finished
    this.error = error
  }


}