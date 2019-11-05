<template>
  <b-container class="h-100 p-2" fluid @mouseover="hover = true" @mouseleave="hover = false">
    <b-row no-gutters class="h-100">
      <b-col class="h-100">
        <transition-group name="fade">
          <template v-show="hover">
            <div :key="1" v-show="hover" class="graphOptions right">
              <b>Range:</b><b-form-select v-model="selectedRange" :options="rangeOptions" size="sm" plain></b-form-select>
            </div>
            <div :key="2" v-show="hover" class="">
              <span class="graphOptions left"><b>Statistic:</b><b-form-select v-model="selectedStatistic" :options="statisticsOptions" size="sm" plain></b-form-select></span>
              <span v-if="selectedStatistic === 'cluster'" class="graphOptions left leftPlus"><b>prepKit:</b><b-form-select v-model="selectedSubStatistic" :options="subOptions" size="sm" plain></b-form-select></span>
            </div>
          </template>
        </transition-group>
        <b-container class="border border-primary p-0 h-100" fluid >
          <apexchart type="line" :options="chartOptions" :series="computedSeries"></apexchart>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { graphAnnotation, annotation, xAnnotation, yAnnotation, AnnotationLabel, LabelStyle, chartOptions, Serie, outlier } from '@/types/graphTypes'
import { RunTime, RunTimeStatistic, AverageData, pipelineType } from '@/types/dataTypes'

export default Vue.extend({
  name: 'run-time-statistics',
  props: {
    runTimes: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      selectedRange: 10,
      selectedStatistic: 'cluster',
      selectedSubStatistic: 'Exoom',
      rangeOptions: [
        { value: 10, text: '10'},
        { value: 100, text: '100'},
        { value: 1000, text: '1000'}
      ],
      statisticsOptions: [
        { value: 'cluster', text: 'Cluster'},
        { value: 'prepKit', text: 'prepKit'}
      ],
      hover: false
    }
  },
  computed: {
    subOptions(): Array<{value: string, text: string}>{
      let options: Array<{value: string, text: string}> = []
      this.$store.state.pipelineTypes.forEach((pipelineType: string) => {
        options.push({ value: pipelineType, text: pipelineType})
      })
      return options
    },
    machineStats (): Record<string, Serie[]> {
      return this.$store.state.MachineRuntimes
    },
    /**
     * Computed property that builds the annotations for the graph
     * 
     * @returns {graphAnnotation}
     */
    annotations (): graphAnnotation {
      let thresholdNumber = this.threshold as number
      let averageNumber = this.average.ONCO
      let outline = thresholdNumber + averageNumber
      return {
        xaxis: this.xAnnotations as xAnnotation[],
        yaxis: [
        ]
      }
    },
    /**
     * Computed property that builds chart options
     * 
     * @returns {chartOptions}
     */
    chartOptions (): chartOptions {
      const sampleCounts = this.machineSampleCounts
      return {
        chart: {
          height: '100%',
          id: 'run-time-graph',
          toolbar: {
            show: false,
            tools: {
              download: false
            }
          }
        },
        noData: {
          text: 'Loading...',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: '14px',
            fontFamily: undefined
          }
        },
        title: {
          text: `Runtime per project grouped by ${this.selectedStatistic}`,
          align: 'center'
        },
        stroke: {
          width: 4,
          curve: 'smooth'
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          labels: {
            show: false
          }
        },
        yaxis: {
          title: {
            text: 'Runtime (hours)'
          },
          min: 0
        },
        tooltip: {
          y: {
          
          formatter: function(value: number, { series , seriesIndex, dataPointIndex, w}: {series: Serie, seriesIndex: number, dataPointIndex: number, w: object}, MachineSampleCounts: Record<string, number[]> = sampleCounts) {
            return `${value} (hr), ${MachineSampleCounts[Object.keys(MachineSampleCounts)[seriesIndex]][dataPointIndex]} (samples)`
          }
  }
        },
        annotations: this.annotations as graphAnnotation
      }
    },
    machineSampleCounts () {
      return this.$store.state.MachineSampleCounts
    },
    numbersArray (): number[] {
      const runTimeArray = this.runTimes as RunTimeStatistic[]
      let numbers: number[] = []
      runTimeArray.forEach((RunTimeStatistic: RunTimeStatistic) => {
        numbers.push(RunTimeStatistic.getMax())
      })

      return numbers
    },
    /**
     * Finds max value
     * 
     * @returns {Number}
     */
    maxValue (): number {
      const max = Math.max(...this.numbersArray)

      if (max > 20) {
        return max + 10
      }
      return 20
    },
    /**
     * average runtime
     * @returns average
     */
    average (): AverageData {
      let ONCO = 0
      let PCS = 0
      let Exoom = 0
      let SVP = 0
      this.series.forEach((serie: Serie) => {
        switch (serie.name) {
          case 'ONCO':
            ONCO = this.findAverage(serie.data)
            break
          case 'PCS':
            PCS = this.findAverage(serie.data)
            break
          case 'Exoom':
            Exoom = this.findAverage(serie.data)
            break
          case 'SVP':
            SVP = this.findAverage(serie.data)
            break
          default:
            break
        }
      })

      return new AverageData(ONCO, PCS, Exoom, SVP)
    },
    /**
     * calculates threshold for each pipeline
     * 
     * @returns {AverageData}
     */
    thresholds (): AverageData {
      let avg = this.average

      const ONCO = this.getSD(this.series[0].data, avg.ONCO)
      const PCS = this.getSD(this.series[1].data, avg.PCS)
      const Exoom = this.getSD(this.series[2].data, avg.Exoom)
      const SVP = this.getSD(this.series[3].data, avg.SVP)

      return new AverageData(ONCO + avg.ONCO, PCS + avg.PCS, Exoom + avg.Exoom, SVP + avg.SVP)
    },
    /**
     * builds series array for graph
     * 
     * @returns {Serie[]}
     */
    series (): Serie[] {
      const runTimeArray = this.runTimes as RunTimeStatistic[]
      let SerieArray: Serie[] = []
      let ONCO: number[] = []
      let PCS: number[] = []
      let Exoom: number[] = []
      let SVP: number[] = []

      runTimeArray.forEach((StatisticalPoint: RunTimeStatistic) => {
        if (StatisticalPoint.ONCO) { ONCO.push(StatisticalPoint.ONCO.runtime) } else { ONCO.push(0) }
        if (StatisticalPoint.PCS) { PCS.push(StatisticalPoint.PCS.runtime) } else { PCS.push(0) }
        if (StatisticalPoint.Exoom) { Exoom.push(StatisticalPoint.Exoom.runtime) } else { Exoom.push(0) }
        if (StatisticalPoint.SVP) { SVP.push(StatisticalPoint.SVP.runtime) } else { SVP.push(0) }
      })

      SerieArray.push(new Serie('ONCO', ONCO))
      SerieArray.push(new Serie('PCS', PCS))
      SerieArray.push(new Serie('Exoom', Exoom))
      SerieArray.push(new Serie('SVP', SVP))

      return SerieArray
    },
    /**
     * calculates the outliers in the data
     * @todo
     * @returns outlier array
     */
    outliers (): outlier[] {
      let outliers = [] as outlier[]
      return outliers
    },
    /**
     * creates xAnnotations for outliers
     * @returns {xAnnotation[]}
     */
    xAnnotations (): xAnnotation[] {
      let annotations = [] as xAnnotation[]
      this.outliers.forEach((outlier) => {
        annotations.push(this.CreateXannotation(outlier.position, this.cropTitle(outlier.id, 20)))
      })
      return annotations
    },
    pipelineSeriesData (): Serie[] {
      return this.$store.state.statistics
    },
    computedSeries (): Serie[] | null{
      switch (this.selectedStatistic) {
        case 'prepKit':
          return this.pipelineSeriesData
        case 'cluster':
          return this.machineStats[this.selectedSubStatistic]
        default:
          return null
      }
    }

  },
  methods: {
    updateTimingData (range: number): void {
      this.$store.dispatch('getTimingData', range)
    },
    /**
     * gets standard deviation
     * @param {Number[]} numArray - Array with numbers to get SD
     * @param {Number} average - average
     * 
     * @returns {Number} sd
     */
    getSD (numArray: number[], average: number): number {
      let sumOfDistance = 0
      numArray.forEach((x) => {
        sumOfDistance += Math.pow(x - average, 2)
      })

      return Math.sqrt(sumOfDistance / numArray.length)
    },
    /**
     * gets the average of array
     * @param {Number} numArray - array of numbers to calculate average
     * @returns {Number}
     */
    findAverage (numArray: number[]): number {
      let sum = 0
      numArray.forEach((x) => {
        sum += x
      })
      return sum / numArray.length
    },

    /**
     * returns average without outliers
     * @param {Number[]} numArray - Average without any outliers
     * 
     * @returns {Number}
     */
    findAverageOfNormalValues (numArray: number[]): number {
      const average = this.findAverage(numArray)
      const SD = this.getSD(numArray, average)
      const cutOff = SD
      const lower = average - cutOff
      const higher = average + cutOff
      const filteredArray = numArray.filter((x) => { return x > lower && x < higher })

      return this.findAverage(filteredArray)
    },
    /**
     * Creates xAnnotation Object
     * @param {Number} coordinate - coordinate of annotation
     * @param {String} name - name to put in label
     * 
     * @returns {xAnnotation}
     */
    CreateXannotation (coordinate: number, name: string): xAnnotation {
      let labelPosition = 'top'
      let position1 = coordinate - 0.1
      let position2 = coordinate + 0.1
      if (coordinate === 1) {
        position1 += 0.1
      } else if (coordinate === 10) {
        position2 -= 0.1
      }
      return {
        x: position1,
        x2: position2,
        borderColor: '#a57f01',
        fillColor: '#e3ae00',
        opacity: 0.7,
        label: {
          borderColor: '#e3ae00',
          orientation: 'vertical',
          position: labelPosition,
          style: {
            fontSize: '5mm',
            color: '#fff',
            background: '#e3ae00'
          },
          offsetX: 45,
          offsetY: 10,
          text: name
        }
      }
    },

    /**
     * crops given title by the provided lenght
     * @param {String} title - title to crop
     * @param {Number} lenght - maxlenght
     * @returns {String}
     */
    cropTitle (title: string, length: number): string {
      if (title.length > length) {
        return title.substring(0, length) + '...'
      }
      return title
    }
  },
  watch: {
    /**
     * Emits a threshold update if they change
     * 
     * @emits 'new-threshold-onco'
     * @emits 'new-threshold-pcs'
     * @emits 'new-threshold-exoom'
     * @emits 'new-threshold-svp'
     * 
     * @returns {void}
     */
    thresholds (): void {
      this.$emit('new-threshold-onco', this.thresholds.ONCO)
      this.$emit('new-threshold-pcs', this.thresholds.PCS)
      this.$emit('new-threshold-exoom', this.thresholds.Exoom)
      this.$emit('new-threshold-svp', this.thresholds.SVP)
    },
    selectedRange (): void {
      this.updateTimingData(this.selectedRange)
    }
  },
  mounted () {
    this.updateTimingData(this.selectedRange)
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.graphOptions {
  position: absolute; 
  z-index: 2; 
  margin-top: 5px;
}
.right {
  right: 0; 
  margin-right: 10px; 
}
.left {
  left: 0;
  margin-left: 10px;
}

.leftPlus {
  left: 80px;
}
</style>
