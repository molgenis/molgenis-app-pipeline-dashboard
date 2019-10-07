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

<script>

export default {
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
    annotations: function () {
      return {
        xaxis: this.xAnnotations,
        yaxis: [
          {
            y: this.average,
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
              text: 'Average runtime: 0'.replace('0', (Math.round(this.average * 10) / 10))
            }
          },
          {
            y: this.average + this.threshold,
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
              text: 'Threshold: 0'.replace('0', (Math.round((this.average + this.threshold) * 10) / 10))
            }
          }
        ]
      }
    },
    /**
     * Computed property that builds chart options
     * @returns Object chartOptions
     */
    chartOptions: function () {
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
          max: this.maxValue
        },
        xaxis: {
          title: { text: 'Run' },
          type: 'Number',
          caegories: [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
          ],
          labels: {
            rotate: -90
          }
        },
        annotations: this.annotations
      }
    },
    /**
     * Gets all runtimes
     * @returns Array
     */
    numbersArray: function () {
      return Array.from(this.runTimes, x => x.runtime)
    },
    /**
     * Finds max value
     * @returns Number
     */
    maxValue: function () {
      const max = Math.max(...this.numbersArray)
      if (max > 20) {
        return max + 10
      } else {
        return 20
      }
    },

    average: function () {
      return this.findAverageOfNormalValues(this.numbersArray)
    },
    threshold: function () {
      const threshold = this.getSD(this.numbersArray, this.average)
      this.$emit('new-threshold', threshold + this.average)
      return threshold
    },
    /**
     * builds series array for graph
     */
    series: function () {
      return [{
        name: 'Runtime',
        data: this.numbersArray
      }]
    },

    outliers: function () {
      let outliers = []
      for (let i = 0; i < this.runTimes.length; i++) {
        let run = this.runTimes[i]
        if (run.runtime >= this.average + this.threshold) {
          outliers.push([run.runId, i + 1])
        }
      }
      return outliers
    },

    xAnnotations: function () {
      let annotations = []
      this.outliers.forEach((outlier) => {
        annotations.push(this.CreateXannotation(outlier[1], this.cropTitle(outlier[0], 20)))
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
    getSD (numArray, average) {
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
    findAverage (numArray) {
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
    findAverageOfNormalValues (numArray) {
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
    CreateXannotation (coordinate, name) {
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
    cropTitle (title, length) {
      if (title.length > length) {
        return title.substring(0, length) + '...'
      }
      return title
    }
  }
}
</script>

<style scoped>
</style>
