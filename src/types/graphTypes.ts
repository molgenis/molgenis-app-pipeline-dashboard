/**
 * Annotation object that defines where x and y annotations are located
 */
export interface graphAnnotation {
  xaxis: xAnnotation[]
  yaxis: yAnnotation[]
}

/**
 * Stores annotation options
 */
export interface annotation {
  borderColor: string
  label: AnnotationLabel
}

/**
 * Stores xAnnotation options
 */
export interface xAnnotation extends annotation {
  x: number
  x2: number
  fillColor: string
  opacity: number
}

/**
 * Stores yAnnotation options
 */
export interface yAnnotation extends annotation {
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

/**
 * A graph data series
 */
export class serie {
  name: string
  data: number[]
  constructor(name: string, data: number[]){
    this.name = name
    this.data = data
  }
}

/**
 * Outlier position object
 */
export interface outlier {
  id: string
  position: number
}