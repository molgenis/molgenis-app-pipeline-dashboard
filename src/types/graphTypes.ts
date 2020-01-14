/**
 * Annotation object that defines where x and y annotations are located
 */
export interface GraphAnnotation {
  xaxis: XaxisAnnotation[];
  yaxis: YaxisAnnotation[];
}

/**
 * Stores annotation options
 */
export interface Annotation {
  borderColor: string;
  label: AnnotationLabel;
}

/**
 * Stores xAnnotation options
 */
export interface XaxisAnnotation extends Annotation {
  x: number;
  x2: number;
  fillColor: string;
  opacity: number;
}

/**
 * Stores yAnnotation options
 */
export interface YaxisAnnotation extends Annotation {
  y: number;
  strokeDashArray: number;
}

/**
 * Stores Label options
 */
export interface AnnotationLabel {
  borderColor: string;
  orientation?: string;
  position?: string;
  offsetX?: number;
  offsetY?: number;
  style: LabelStyle;
  text: string;
}

/**
 * Stores Label Styling
 */
export interface LabelStyle {
  color: string;
  background: string;
  fontSize?: string;
}

interface Chart {
  animations?: object;
  background?: string;
  brush?: object;
  dropShadow?: object;
  fontFamily?: string;
  foreColor?: string;
  events?: object;
  height?: number | string;
  defaultLocale?: string;
  locales?: Array<object>;
  parentHeightOffset?: number;
  selection?: object;
  sparkline?: {
    enabled: boolean;
  };
  stacked?: boolean;
  stackType?: string;
  toolbar?: object;
  type?: string;
  width?: number | string;
  zoom?: object;
  id?: string;
}

interface DataLabels {
  enabled?: boolean;
  enabledOnSeries?: number[];
  formatter?: (val: number | string, opts?: object) => string;
  textAnchor?: string;
  offsetX?: number;
  offsetY?: number;
  style?: {
      fontSize?: string;
      fontFamily?: string;
      colors?: string[];
  };
  dropShadow?: {
      enabled?: boolean;
      top?: number;
      left?: number;
      blur?: number;
      opacity?: number;
  };
}

interface Fill {
  colors?: string[];
  opacity?: number;
  type?: string;
  gradient?: {
      shade?: string;
      type?: string;
      shadeIntensity?: number;
      gradientToColors?: string[];
      inverseColors?: boolean;
      opacityFrom?: number;
      opacityTo?: number;
      stops?: number[];
      colorStops?: {offset?: number; color?: string; opacity?: number}[][];
  };
  image?: {
      src?: string[];
      width?: number;
      height?: number;
  };
  pattern?: {
      style?: string;
      width?: number;
      height?: number;
      strokeWidth?: number;
  };
}

interface Grid {
  show?: boolean;
    borderColor?: string;
    strokeDashArray?: number;
    position?: string;
    xaxis?: {
        lines?: {
            show?: boolean;
        };
    };   
    yaxis?: {
        lines?: {
            show?: boolean;
        };
    };  
    row?: {
        colors?: string[];
        opacity?: boolean;
    };  
    column?: {
        colors?: string[];
        opacity?: boolean;
    };  
    padding?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
}

interface Legend {
  show?: boolean;
    showForSingleSeries?: boolean;
    showForNullSeries?: boolean;
    showForZeroSeries?: boolean;
    position?: string;
    horizontalAlign?: string; 
    floating?: boolean;
    fontSize?: string;
    fontFamily?: string;
    formatter?: (val: string, opts: object) => string[];
    inverseOrder?: boolean;
    width?: number;
    height?: number;
    tooltipHoverFormatter?: (val: string, opts: object) => string;
    offsetX?: number;
    offsetY?: number;
    labels?: {
        colors?: string[];
        useSeriesColors?: boolean;
    };
    markers?: {
        width?: number;
        height?: number;
        strokeWidth?: number;
        strokeColor?: string;
        fillColors?: string[];
        radius?: number;
        customHTML?: () => string;
        onClick?: (chart: object, index: number, opts: object) => void;
        offsetX?: number;
        offsetY?: number;
    };
    itemMargin?: {
        horizontal?: number;
        vertical?: number;
    };
    onItemClick?: {
        toggleDataSeries?: boolean;
    };
    onItemHover?: {
        highlightDataSeries?: boolean;
    };
}

interface Markers {
  size?: number;
    colors?: string[];
    strokeColors?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    fillOpacity?: number;
    discrete?: object[];
    shape?: string;
    radius?: number;
    offsetX?: number;
    offsetY?: number;
    onClick?: () => void;
    onDblClick?: () => void;
    hover?: {
      size?: number;
      sizeOffset?: number;
    };
}

interface NoData {
  text?: string;
  align?: string;
  verticalAlign?: string;
  offsetX?: number;
  offsetY?: number;
  style?: {
    color?: string | undefined;
    fontSize?: string;
    fontFamily?: string | undefined;
  };
}
/**
 * Stores global chart options
 *
 * For a detailed documtentation ref: https://apexcharts.com/docs/options/
 */
export interface ChartOptions {
  annotations?: GraphAnnotation;
  chart?: Chart;
  colors?: string[];
  dataLabels?: DataLabels;
  fill?: Fill;
  grid?: Grid;
  labels?: string[];
  legend?: Legend;
  markers?: Markers;

  noData?: NoData;
  plotOptions?: {
    bar?: object;
    bubble?: object;
    candlestick?: object;
    heatmap?: object;
    pie?: object;
    radar?: object;
    radialBar?: object;
  };
  responsive?: object[];
  series?: Serie;
  states?: object;
  stroke?: {
    width?: number;
    curve?: string;
    dashArray?: number[];
  };
  title?: {
    text?: string;
    align?: string;
  };
  
  yaxis?: {
    title?: {
      text?: string;
      style?: object;
    };
    min?: number;
    max?: number;
    
  };
  xaxis?: {
    title?: {
      text?: string;
    };
    type?: string;
    categories?: string[];
    labels?: {
      rotate?: number;
      show?: boolean;
      style?: object;
    };
  };
  tooltip?: object;
}



/**
 * A graph data series
 */
export class Serie {
  name: string
  data: number[]
  /**
   * Serie Constructor
   * @param name serie name
   * @param data serie numbers data
   */
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
  combinedData: {projectID: string; number: number}[]
  /**
   * @param dataID data identifier
   * @param IdentifiedNumbers Object array with annotated numbers
   */
  constructor (dataID: string, IdentifiedNumbers: {projectID: string; number: number}[]) {
    super(dataID, Array.from(IdentifiedNumbers, (x) => { return x.number }))
    this.projectIDs = Array.from(IdentifiedNumbers, (x) => { return x.projectID })
    this.combinedData = IdentifiedNumbers
  }
  /**
   * gets number of entries of serie
   */
  getLength (): number {
    return this.data.length
  }
}

/**
 * Interface defines API response
 */
export interface RawDurationStatistics {
  unique_id: string;
  copyRawDataToPrmDuration: number;
  pipelineDuration: number;
  copyProjectDataToPrmTiming: number;
  total_min: number;
  finishedTime: string;
}

/**
 * Class to store raw copying duration, pipeline duration, and results copying duration in number arrays
 */
export class DurationStatisticsStorage {
  raw: number[]
  pipeline: number[]
  result: number[]
  constructor () {
    this.raw = []
    this.pipeline = []
    this.result = []
  }
  /**
   * Adds a new runtime statistic
   * @param rawDuration Raw copying duration in minutes
   * @param pipelineDuration Pipeline running duration in minutes
   * @param resultDuration Results compying duration in minutes
   */
  addStatistic (rawDuration: number, pipelineDuration: number, resultDuration: number): void {
    this.raw.push(rawDuration)
    this.pipeline.push(pipelineDuration)
    this.result.push(resultDuration)
  }
  /**
   * gets median value of given numberArray
   * @param numberArray Number array to find median of
   */
  private getMedian (numberArray: number[]): number {
    numberArray.sort((a, b) => a - b)
    const length = numberArray.length
    if (length % 2 === 0) {
      const half = length / 2
      return (numberArray[half - 1] + numberArray[half]) / 2
    }
    return numberArray[(length + 1) / 2 - 1]
  }
  /**
   * gets mean of raw duration
   */
  getRawMean (): number {
    return this.raw.reduce((a, b) => a + b, 0) / this.raw.length
  }
  /**
   * gets median of raw duration
   */
  getRawMedian (): number {
    return this.getMedian(this.raw)
  }
  /**
   * gets mean of pipeline duration
   */
  getPipelineMean (): number {
    return this.pipeline.reduce((a, b) => a + b, 0) / this.pipeline.length
  }
  /**
   * gets median of pipeline duration
   */
  getPipelineMedian (): number {
    return this.getMedian(this.pipeline)
  }
  /**
   * gets mean of results duration
   */
  getResultMean (): number {
    return this.result.reduce((a, b) => a + b, 0) / this.result.length
  }
  /**
   * gets median of results duration
   */
  getResultMedian (): number {
    return this.getMedian(this.result)
  }
}
