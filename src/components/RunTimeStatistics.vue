<template>
  <b-container class="h-100 p-2" fluid>
    <b-row no-gutters>
      <b-col >
        <b-container class="border border-primary p-0" fluid>
          <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { graphAnnotation, annotation, xAnnotation, yAnnotation, AnnotationLabel, LabelStyle, chartOptions, Serie, outlier } from '@/types/graphTypes'
import { RunTime, RunTimeStatistic, AverageData } from '@/types/dataTypes'

export default Vue.extend({
  name: 'run-time-statistics',
  props: {
    runTimes: {
      type: Array,
      required: true
    }
  },
  computed: {
    /**
     * Computed property that builds the annotations for the graph
     * @returns Object annotations
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
     * @returns Object chartOptions
     */
    chartOptions (): chartOptions {
      return {
        chart: {
          id: 'run-time-graph',
          toolbar: {
            show: false,
            tools: {
              download: false
            }
          }
        },
        title: {
          text: 'Runtime per Run per Pipeline type',
          align: 'center'
        },
        stroke: {
          width: 4,
          curve: 'smooth'
        },
        dataLabels: {
          enabled: false
        },
        yaxis: {
          title: {
            text: 'Runtime (hours)'
          },
          min: 0,
          max: this.maxValue as number
        },
        xaxis: {
          title: { text: 'Run' },
          type: 'Number',
          categories: [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
          ],
          labels: {
            rotate: -90
          }
        },
        annotations: this.annotations as graphAnnotation
      }
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
     * @returns Number
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
     * @returns threshold
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
     * @returns Annotation objects for outliers
     */
    xAnnotations (): xAnnotation[] {
      let annotations = [] as xAnnotation[]
      this.outliers.forEach((outlier) => {
        annotations.push(this.CreateXannotation(outlier.position, this.cropTitle(outlier.id, 20)))
      })
      return annotations
    }

  },
  methods: {
    /**
     * gets standard deviation
     * @param numArray Array<Number>
     * @param average Number
     * @returns Number Standard deviation from the average
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
     * @param numArray Array<Number>
     * @returns Number average of array
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
     * @param numArray Array<Number>
     * @returns Number average of Array
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
     * @param coordinate coordinate of annotation
     * @param name name to put in label
     * @returns xAnnotation Object
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
     * @param title String title to crop
     * @param lenght Number maxlenght
     * @returns cropped title
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
     */
    thresholds (): void {
      this.$emit('new-threshold-onco', this.thresholds.ONCO)
      this.$emit('new-threshold-pcs', this.thresholds.PCS)
      this.$emit('new-threshold-exoom', this.thresholds.Exoom)
      this.$emit('new-threshold-svp', this.thresholds.SVP)
    }
  }
})
</script>

<style scoped>

</style>
