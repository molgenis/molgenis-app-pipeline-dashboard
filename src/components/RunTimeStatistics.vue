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
import { mapState, mapActions } from 'vuex'
import { GraphAnnotation, Annotation, xAnnotation, yAnnotation, AnnotationLabel, LabelStyle, ChartOptions, Serie, Outlier } from '@/types/graphTypes'
import { RunTime, RunTimeStatistic, AverageData, pipelineType } from '@/types/dataTypes'
import { getSD, calculateMean } from '@/helpers/statistics'
import { cropTitle } from '@/helpers/text'
import { State } from '../store/state'

declare module 'vue/types/vue' { 
  interface Vue extends State {
    getTimingData(range: number): void
  }
}

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
      this.pipelineTypes.forEach((pipelineType: string) => {
        options.push({ value: pipelineType, text: pipelineType})
      })
      return options
    },
    /**
     * Computed property that builds the annotations for the graph
     * 
     * @returns {graphAnnotation}
     */
    annotations (): GraphAnnotation {
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
    chartOptions (): ChartOptions {
      const sampleCounts = this.MachineSampleCounts
      let title = ''
      if (this.selectedStatistic === 'cluster') {
        title = `${this.selectedSubStatistic} runtime trends by ${this.selectedStatistic}`
      } else {
        title = `runtime trends by ${this.selectedStatistic}`
      }

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
          text: title,
          align: 'center'
        },
        stroke: {
          width: 4
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
        annotations: this.annotations as GraphAnnotation
      }
    },
    machineSampleCounts () {
      return this.MachineSampleCounts
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
     * average runtime
     * @returns average
     */
    average (): AverageData {
      let onco = 0
      let pcs = 0
      let exoom = 0
      let svp = 0
      this.series.forEach((serie: Serie) => {
        switch (serie.name) {
          case 'ONCO':
            onco = calculateMean(serie.data)
            break
          case 'PCS':
            pcs = calculateMean(serie.data)
            break
          case 'Exoom':
            exoom = calculateMean(serie.data)
            break
          case 'SVP':
            svp = calculateMean(serie.data)
            break
          default:
            break
        }
      })

      return new AverageData(onco, pcs, exoom, svp)
    },
    /**
     * calculates threshold for each pipeline
     * 
     * @returns {AverageData}
     */
    thresholds (): AverageData {
      let avg = this.average

      const onco = getSD(this.series[0].data, avg.ONCO)
      const pcs = getSD(this.series[1].data, avg.PCS)
      const exoom = getSD(this.series[2].data, avg.Exoom)
      const svp = getSD(this.series[3].data, avg.SVP)

      return new AverageData(onco + avg.ONCO, pcs + avg.PCS, exoom + avg.Exoom, svp + avg.SVP)
    },
    /**
     * builds series array for graph
     * 
     * @returns {Serie[]}
     */
    series (): Serie[] {
      const runTimeArray = this.runTimes as RunTimeStatistic[]
      let SerieArray: Serie[] = []
      let onco: number[] = []
      let pcs: number[] = []
      let exoom: number[] = []
      let svp: number[] = []

      runTimeArray.forEach((StatisticalPoint: RunTimeStatistic) => {
        if (StatisticalPoint.ONCO) { onco.push(StatisticalPoint.ONCO.runtime) } else { onco.push(0) }
        if (StatisticalPoint.PCS) { pcs.push(StatisticalPoint.PCS.runtime) } else { pcs.push(0) }
        if (StatisticalPoint.Exoom) { exoom.push(StatisticalPoint.Exoom.runtime) } else { exoom.push(0) }
        if (StatisticalPoint.SVP) { svp.push(StatisticalPoint.SVP.runtime) } else { svp.push(0) }
      })

      SerieArray.push(new Serie('ONCO', onco))
      SerieArray.push(new Serie('PCS', pcs))
      SerieArray.push(new Serie('Exoom', exoom))
      SerieArray.push(new Serie('SVP', svp))

      return SerieArray
    },
    /**
     * calculates the outliers in the data
     * @todo
     * @returns outlier array
     */
    outliers (): Outlier[] {
      let outliers = [] as Outlier[]
      return outliers
    },
    /**
     * creates xAnnotations for outliers
     * @returns {xAnnotation[]}
     */
    xAnnotations (): xAnnotation[] {
      let annotations = [] as xAnnotation[]
      this.outliers.forEach((outlier) => {
        annotations.push(this.createXAnnotation(outlier.position, cropTitle(outlier.id, 20)))
      })
      return annotations
    },
    computedSeries (): Serie[] | null{
      switch (this.selectedStatistic) {
        case 'prepKit':
          return this.statistics
        case 'cluster':
          return this.MachineRuntimes[this.selectedSubStatistic]
        default:
          return null
      }
    },
    ...mapState([
      'MachineSampleCounts',
      'statistics',
      'pipelineTypes',
      'MachineRuntimes'
    ])
  },
  methods: {
    ...mapActions([
      'getTimingData'
    ]),
    /**
     * Creates xAnnotation Object
     * @param {Number} coordinate - coordinate of annotation
     * @param {String} name - name to put in label
     * 
     * @returns {xAnnotation}
     */
    createXAnnotation (coordinate: number, name: string): xAnnotation {
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
      this.getTimingData(this.selectedRange)
    }
  },
  mounted () {
    this.getTimingData(this.selectedRange)
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
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
