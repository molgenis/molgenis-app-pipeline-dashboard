<template>
    <b-row no-gutters>
      <b-col cols="12" lg="5" class="h-50 p-2">
        <b-container class="border border-primary p-0" fluid>
          <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
        </b-container>
      </b-col>
      <b-col cols="6" lg="2" class="p-2 h-100">
        <b-container class="border border-primary p-0" fluid>
          <b-list-group>
            <b-list-group-item>Outliers</b-list-group-item>
            <b-list-group-item v-for="outlier in outliers" :key="outlier.id">Run: {{outlier.position}}, {{outlier.id}}</b-list-group-item>
          </b-list-group>
        </b-container>
      </b-col>
       <b-col cols="6" lg="4" class="p-2 h-100">
         <b-container class="border border-primary p-0" fluid></b-container>
       </b-col>
    </b-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { graphAnnotation, annotation, xAnnotation, yAnnotation, AnnotationLabel, LabelStyle, chartOptions, serie, outlier} from '@/types/graphTypes'
import { RunTime, RunTimeStatistics } from '@/types/dataTypes'

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
    annotations(): graphAnnotation {
      let thresholdNumber = this.threshold as number
      let averageNumber = this.average as number
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
    chartOptions(): chartOptions {
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
          text: 'Runtime by Run',
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
    numbersArray(): number[] {
      const runTimeArray = this.runTimes as RunTimeStatistics[]
      let numbers: number[] = []
      runTimeArray.forEach((RunTimeStatistic: RunTimeStatistics) => {
        numbers.push(RunTimeStatistic.getMax())
      })

      return numbers
    },
    /**
     * Finds max value
     * @returns Number
     */
    maxValue(): number {
      const max = Math.max(...this.numbersArray)
      
      if (max > 20) {
        return max + 10
      }
      return 20
      
    },

    average(): number {
      return this.findAverage(this.numbersArray as number[])
    },
    threshold(): number {
      let avg = this.average as number
      const threshold = this.getSD(this.numbersArray as number[], avg)
      this.$emit('new-threshold', threshold + avg)
      return threshold
    },
    /**
     * builds series array for graph
     */
    series(): serie[] {
      const runTimeArray = this.runTimes as RunTimeStatistics[]
      let serieArray: serie[] = []
      let ONCO: number[] = []
      let PCS: number[] = []
      let Exoom: number[] = []
      let SPV: number[] = []
      let other: Array<RunTime[]> = []


      runTimeArray.forEach((StatisticalPoint: RunTimeStatistics) => {
        const emptyNumber = null
        if (StatisticalPoint.ONCO)  { ONCO.push(StatisticalPoint.ONCO.runtime) }    else {ONCO.push(0)}
        if (StatisticalPoint.PCS)   { PCS.push(StatisticalPoint.PCS.runtime) }      else {PCS.push(0)}
        if (StatisticalPoint.Exoom) { Exoom.push(StatisticalPoint.Exoom.runtime) }  else {Exoom.push(0)}
        if (StatisticalPoint.SPV)   { SPV.push(StatisticalPoint.SPV.runtime) }      else {SPV.push(0)}
             
      })
      serieArray.push(new serie('ONCO', ONCO))
      serieArray.push(new serie('PCS', PCS))
      serieArray.push(new serie('Exoom', Exoom))
      serieArray.push(new serie('SPV', SPV))

      return serieArray
    },

    outliers(): outlier[] {
      let outliers = [] as outlier[]
      let runTimeArray = this.runTimes as RunTime[]
      for (let i = 0; i < runTimeArray.length; i++) {
        let run = runTimeArray[i]
        if (run.runtime >= this.average + this.threshold) {
          outliers.push({id: run.runId, position: i + 1})
        }
      }
      return outliers
    },

    xAnnotations(): xAnnotation[] {
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
  }
})
</script>

<style scoped>
</style>
