<template>
    <b-row no-gutters>
      <b-col cols="4" class="h-50 p-2">
        <b-container class="border border-primary p-0" fluid>
          <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
        </b-container>
      </b-col>
      <b-col cols="2" class="p-2 h-100">
        <b-container class="border border-primary p-0" fluid>
          <b-list-group>
            <b-list-group-item>Outliers</b-list-group-item>
            <b-list-group-item v-for="outlier in outliers" :key="outlier">Run: {{outlier[1]}}, {{outlier[0]}}</b-list-group-item>
          </b-list-group>
        </b-container>
      </b-col>
       <b-col cols="6" class="p-2 h-100">
         <b-container class="border border-primary p-0" fluid></b-container>
       </b-col>
    </b-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { graphAnnotation, annotation, xAnnotation, yAnnotation, AnnotationLabel, LabelStyle, chartOptions, serie, RunTime, outlier } from '@/types'

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
          {
            y: this.average as number,
            strokeDashArray: 0,
            borderColor: '#775DD0',
            label: {
              borderColor: '#775DD0',
              position: 'right',
              offsetY: -20,
              style: {
                color: '#fff',
                background: '#775DD0'
              },
              text: 'Average runtime: 0'.replace('0', (Math.round(this.average * 10) / 10).toString())
            }
          },
          {
            y: outline,
            strokeDashArray: 10,
            borderColor: '#a57f01',
            label: {
              borderColor: '#a57f01',
              position: 'right',
              offsetY: -20,
              style: {
                color: '#fff',
                background: '#a57f01'
              },
              text: 'Threshold: 0'.replace('0', (Math.round((outline) * 10) / 10).toString())
            }
          }
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
          style: 'smooth'
        },
        markers: {
          size: 6
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
    /**
     * Gets all runtimes
     * @returns Array
     */
    numbersArray (): number[] {
      return Array.from(this.runTimes as RunTime[], x => x.runtime)
    },
    /**
     * Finds max value
     * @returns Number
     */
    maxValue(): number {
      const max = Math.max(...this.numbersArray as number[])
      if (max > 20) {
        return max + 10
      } else {
        return 20
      }
    },

    average(): number {
      return this.findAverageOfNormalValues(this.numbersArray as number[])
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
      return [{
        name: 'Runtime',
        data: this.numbersArray as number[]
      }]
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
