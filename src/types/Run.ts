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

  console.log(demultiplexing, raw, running, copying, finished)
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
    const currentStep = this.steps.reduce((prev, step) => prev += step.getStatus() === statusCode.finished ? 1 : 0, 0) - 1
    console.log(this, `Step: ${currentStep}`)
    return currentStep
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
  /**
   * 
   * @param dateGetter Data retrieval function
   */
  getDates(dateGetter: dateGetter): Promise<{startedDate: Date | null, finishedDate: Date | null}> // needs a function that calls to api
  
}

export interface runTimeDates {startedDate: Date | null, finishedDate: Date | null}

/**
 * date api caller function
 * @param {String} projectID project to search
 */
export interface dateGetter {
  (projectID: string): Promise<runTimeDates>
}

export class ProjectData implements Project{
  projectID: string
  jobs: JobCounts
  comment = false
  async getDates(dateGetter: dateGetter): Promise<runTimeDates> {
    return new Promise((resolve, reject) => {
    if (this.jobs.getStatus() === statusCode.started || this.jobs.getStatus() === statusCode.finished) {
      dateGetter(this.projectID)
      .then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(error)
      })
    } else {
      resolve({startedDate: null, finishedDate: null})
    }
    })
  }
  constructor(projectID: string, jobs: JobCounts) {
    this.projectID = projectID
    this.jobs = jobs ? jobs : new JobCounter({ waiting: 0, started: 0, finished: 0, error: 0 })
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
}

export interface JobCounts {
  waiting: number
  started: number
  finished: number
  error: number
  other?: number
  getStatus(): statusCode
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
    if (this.started < 1) {
      return this.waiting === 0 ? statusCode.finished : statusCode.waiting
    }
    return statusCode.started
  }
  constructor({waiting, started, finished, error} : {waiting: number, started: number, finished: number, error: number}) {
    this.waiting = waiting
    this.started = started
    this.finished = finished
    this.error = error
  }


}