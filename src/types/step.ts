import { statusCode } from './dataTypes'

/**
 * step name and its status
 */
interface Step {
  stepID: string;
  getStatus(): statusCode;
  setFinished(): void;
}

class DefaultStep implements Step {
  stepID: string
  private status: statusCode
  constructor (stepID: string, status: statusCode) {
    this.stepID = stepID
    this.status = status
  }
  getStatus (): statusCode {
    return this.status
  }
  setFinished (): void {
    this.status = statusCode.finished
  }
}

class CounterStep implements Step {
  stepID: string
  max: number
  error = false
  counter = 0
  constructor (stepID: string, max: number) {
    this.stepID = stepID
    this.max = max
  }
  setCounter (counter: number): void {
    this.counter = counter
  }
  incrementCounter (): void {
    this.counter += 1
  }
  getStatus (): statusCode {
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
  setFinished (): void {
    this.counter = this.max
  }
}

class DualStateStep extends CounterStep {
  getStatus (): statusCode {
    if (super.error) {
      return statusCode.error
    }
    if (super.counter === super.max) {
      return statusCode.finished
    }
    return statusCode.waiting
  }
}

enum stepType {
  default,
  incremental,
  dual
}

export {
  Step,
  DefaultStep,
  CounterStep,
  DualStateStep,
  stepType
}