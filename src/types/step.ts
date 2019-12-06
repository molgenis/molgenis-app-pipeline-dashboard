import { statusCode } from './dataTypes';
import { DataBaseEntry } from './data';

/**
 * step name and its status
 */
export interface Step {
  stepID: string
  getStatus(): statusCode
  setFinished(): void
}

export class defaultStep implements Step {
  stepID: string
  private status: statusCode
  constructor(stepID: string, status: statusCode) {
    this.stepID = stepID
    this.status = status
  }
  getStatus(): statusCode {
    return this.status
  }
  setFinished(): void {
    this.status = statusCode.finished
  }
}

export class counterStep implements Step {
  stepID: string
  max: number
  error = false
  counter = 0
  constructor(stepID: string, max: number) {
    this.stepID = stepID
    this.max = max
  }
  setCounter(counter: number){
    this.counter = counter
  }
  incrementCounter() {
    this.counter += 1
  }
  getStatus() {
    if (this.error) {
      return statusCode.error
    }
    switch (this.counter) {
      case this.max:
        return statusCode.finished
      case 0:
        return statusCode.waiting
      default:
        return this.counter < this.max ? statusCode.started : statusCode.other
    }
  }
  setFinished(): void {
    this.counter = this.max
  }
}

export class DualStateStep extends counterStep {
  getStatus() { 
    if (super.error) {
      return statusCode.error
    }
    if (super.counter === super.max){
      return statusCode.finished
    }
    return statusCode.waiting
  }
}

export enum stepType {
  default,
  incremental,
  dual
}
export class StepConfigClass {
  name: string
  databaseEntry: DataBaseEntry
  stepType: stepType
  constructor(name: string, databaseEntry: DataBaseEntry, stepType: stepType) {
    this.name = name
    this.databaseEntry = databaseEntry
    this.stepType = stepType
  }
}