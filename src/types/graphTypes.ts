/**
 * Annotation object that defines where x and y annotations are located
 */
export interface GraphAnnotation {
  xaxis: xAnnotation[]
  yaxis: yAnnotation[]
}

/**
 * Stores annotation options
 */
export interface Annotation {
  borderColor: string
  label: AnnotationLabel
}

/**
 * Stores xAnnotation options
 */
export interface xAnnotation extends Annotation {
  x: number
  x2: number
  fillColor: string
  opacity: number
}

/**
 * Stores yAnnotation options
 */
export interface yAnnotation extends Annotation {
  y: number
  strokeDashArray: number
}

/**
 * Stores Label options
 */
export interface AnnotationLabel {
  borderColor: string
  orientation?: string
  position?: string
  offsetX?: number
  offsetY?: number
  style: LabelStyle
  text: string
}

/**
 * Stores Label Styling
 */
export interface LabelStyle {
  color: string
  background: string
  fontSize?: string
}

/**
 * Stores global chart options
 */
export interface ChartOptions {
  chart: {
    id: string
    height?: any
    toolbar: {
      show: boolean
      tools: {
        download: boolean
      }
    }
  }
  noData?: {
    text?: string,
    align?: string,
    verticalAlign?: string,
    offsetX?: number,
    offsetY?: number,
    style?: {
      color?: string | undefined,
      fontSize?: string,
      fontFamily?: string | undefined
    }
  }
  title: {
    text: string
    align: string
  }
  stroke: {
    width: number
    curve?: string
  }
  markers?: {
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
    max?: number
  }
  xaxis: {
    title?: {
      text?: string
    }
    type?: string
    categories?: string[]
    labels?: {
      rotate?: number
      show?: boolean
    }
  },
  tooltip?: any

  annotations: GraphAnnotation
}

/**
 * A graph data series
 */
export class Serie {
  name: string
  data: number[]
  constructor (name: string, data: number[]) {
    this.name = name
    this.data = data
  }
}

/**
 * A graph data series with a project identifier added
 */
export class IdentifiedSerie extends Serie {
  projectIDs: string[]
  combinedData: {projectID: string, number: number}[]
  constructor (dataID: string, IdentifiedNumbers: {projectID: string, number: number}[]) {
    super(dataID, Array.from(IdentifiedNumbers, (x) => { return x.number }))
    this.projectIDs = Array.from(IdentifiedNumbers, (x) => { return x.projectID })
    this.combinedData = IdentifiedNumbers
  }
  getLenght (): number {
    return this.data.length
  }
}

/**
 * Outlier position object
 */
export interface Outlier {
  id: string
  position: number
}

export interface rawDurationStatistics {
  unique_id: string,
  copyRawDataToPrmDuration: number,
  pipelineDuration: number,
  copyProjectDataToPrmTiming: number,
  total_min: number
  finishedTime: string
}

export class durationStatisticsStorage {
  raw: number[]
  pipeline: number[]
  result: number[]
  constructor() {
    this.raw = []
    this.pipeline = []
    this.result = []
  }
  addStatistic(rawDuration:number, pipelineDuration:number, resultDuration:number) {
    this.raw.push(rawDuration)
    this.pipeline.push(pipelineDuration)
    this.result.push(resultDuration)
  }
  private getMedian(numberArray: number[]) {
    numberArray.sort((a,b) => a - b)
    const length = numberArray.length
    if (length % 2 === 0) {
      const half = length / 2
      return (numberArray[half - 1] + numberArray[half]) / 2
    }
    return numberArray[(length + 1) / 2 - 1] 
  }
  getRawMean() {
    return this.raw.reduce((a, b) => a + b, 0) / this.raw.length
  }
  getRawMedian() {
    return this.getMedian(this.raw)
  }
  
  getPipelineMean() {
    return this.pipeline.reduce((a, b) => a + b, 0) / this.pipeline.length
  }
  getPipelineMedian() {
    return this.getMedian(this.pipeline)
  }
  getResultMean() {
    return this.result.reduce((a, b) => a + b, 0) / this.result.length
  }
  getResultMedian() {
    return this.getMedian(this.result)
  }

}
