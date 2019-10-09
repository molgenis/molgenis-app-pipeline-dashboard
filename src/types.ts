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
  jobs: Job[]
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
  getRunType() {
    const RegEx = new RegExp('-[A-Za-z]+(_[a-z0-9A-Z]+)?')
    const matches = this.project.match(RegEx)
    if (!matches) {
      return 'other'
    }
    return matches[0].slice(1)
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

export interface graphAnnotation {
  xaxis: xAnnotation[]
  yaxis: yAnnotation[]
}

export interface annotation {
  borderColor: string
  label: AnnotationLabel
}

export interface xAnnotation extends annotation {
  x: number
  x2: number
  fillColor: string
  opacity: number
}

export interface yAnnotation extends annotation {
  y: number
  strokeDashArray: number
}

export interface AnnotationLabel {
  borderColor: string
  orientation?: string
  position?: string
  offsetX?: number
  offsetY?: number
  style: LabelStyle
  text: string
}

export interface LabelStyle {
  color: string
  background: string
  fontSize?: string
}

export interface chartOptions {
  chart: {
    id: string
    toolbar: {
      show: boolean
      tools: {
        download: boolean
      }
    }
  }
  title: {
    text: string
    align: string
  }
  stroke: {
    width: number
    style: string
  }
  markers: {
    size: number
  }
  dataLabels: {
    enabled: boolean
  }
  yaxis: {
    title: {
      text: string
    }
    min: number
    max: number
  }
  xaxis: {
    title: {
      text: string
    }
    type: string
    categories: string[]
    labels: {
      rotate: number
    }
  }
  annotations: graphAnnotation
}

export interface serie {
  name: string
  data: number[]
}

export interface responseJSON {
  token: string
  username: string
}

export interface RunTime {
  runId: string
  runtime: number
}

export interface outlier {
  id: string
  position: number
}