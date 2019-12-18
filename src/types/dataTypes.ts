/**
 * combined data object interface that defines API response
 */
export interface RawDataObject extends RunDataObject, ProjectDataObject, Job{

}

/**
 * Status code enum
 */
export enum statusCode {
  waiting = 'waiting',
  error = 'error',
  finished = 'finished',
  started = 'started',
  other = 'other'
}

/**
 * returns correct status code enum type
 * @param statusString string to parse
 */
export function parseStatus (statusString: string | undefined): statusCode {
  if (!statusString || statusString.match(/waiting/gi)) {
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
 * Stores the Raw data properties of run
 */
export interface RunDataObject {
  run_id: string;
  group: string;
  demultiplexing: string;
  copy_raw_prm: string;
  projects: string[];
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

export enum dateSearch {
  started = 'started_date',
  finished = 'finished_date'
}

/**
 * Stores Raw project data in an object
 */
export interface ProjectDataObject{
  project: string;
  url: string;
  run_id: string;
  pipeline: string;
  copy_results_prm?: string;
  comment?: string;
}

/**
 * Stores Job information
 */
export interface Job {
  project: string;
  status: string;
  startedDate?: string;
  finishedDate?: string;
}

/**
 * Stores a step status
 */
export interface Step {
  run: string;
  step: number;
  containsError: boolean;
  len: number;
}

/**
 * run runtime
 * @property runId run identifier
 * @property runtime runtime in hours
 */
export class RunTime {
  runId: string
  runtime: number
  constructor (id: string, time: number) {
    this.runId = id
    this.runtime = Math.round(((time / 1000) / 3600) * 10) / 10
  }
}


export class Comment {
  name: string
  comment: string
  constructor (name: string, text: string) {
    this.name = name
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
  containsError: boolean;
  len: number;
  run: string;
  step: number;
}

export enum Gender {
  Male,
  Female,
  Unknown
}

export interface SampleResponse {
  sequencer: string;
  lane: number;
  Gender?: string;
  archiveLocation: string;
}

export function parseGender (gender: string | undefined): Gender {
  return gender ? Gender.Unknown : gender === 'Male' ? Gender.Male : Gender.Female
}

export class Sample {
  sequencer: string
  lane: number
  gender: Gender
  archive: string
  constructor (response: SampleResponse) {
    this.sequencer = response.sequencer
    this.lane = response.lane
    this.gender = parseGender(response.Gender)
    this.archive = response.archiveLocation
  }
}
