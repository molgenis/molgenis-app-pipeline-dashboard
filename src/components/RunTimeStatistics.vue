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
    runTimes: Array
  },
  data: function() {
    return {
      max: 20,
      average: 8,
      xAnnotations: [],
      threshold: 12,
      outliers: []
      }
  },
  computed: {
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
                text: 'Average runtime: 0'.replace('0', (Math.round(this.average * 10)/10))
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
          ]}
        },
    chartOptions: function () {
      return {
        chart: {
          id: 'run-time-graph',
          toolbar: {
            show: false,
            tools: {
              download: false
            }
          },
        },
        title: {
          text: 'Runtime by Run',
          align: 'center'
        },
        stroke: {
          width: 4,
          style: "smooth"
        },
        markers: {
          size: 6
        },
        dataLabels: {
          enabled: false,
        },
        yaxis: {
          title: {
            text: 'Runtime (hours)'
          },
          min: 0,
          max: this.max
        },
        xaxis: {
          title: {text: 'Run'},
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
    series: function () {
      const numArray = Array.from(this.runTimes, x => Object.values(x)[0])
      this.xAnnotations = []
      
      this.average = this.findAverageOfNormalValues(numArray)
      this.threshold = this.getSD(numArray, this.average)

      for (let i = 0; i < this.runTimes.length; i++) {
        let obj = this.runTimes[i]
        let key = Object.keys(obj)[0]
        let value = Object.values(obj)[0]
        if (value >= this.average + this.threshold) {
          this.xAnnotations.push(this.CreateXannotation(i + 1, key))
          this.outliers.push([key, i + 1])
        }
      }

      const max = Math.max(...numArray)
      if (max > 20) {
        this.max = max + 10
      } else {
        this.max = 20
      }
      return [{
        name: 'Runtime',
        data: numArray
      }]
    }
  },
  methods: {
    getSD(numArray, average) {
      let sumOfDistance = 0
      numArray.forEach((x) => {
        sumOfDistance += Math.pow(x - average, 2)
      })

      return Math.sqrt(sumOfDistance/numArray.length)
    },
    findAverage(numArray) {
      let sum = 0
      numArray.forEach((x) => {
        sum += x
      })
      
      const avg = sum / numArray.length

      return avg
    },
    findAverageOfNormalValues(numArray) {
      const average = this.findAverage(numArray)
      const SD = this.getSD(numArray, average)
      const cutOff = SD
      const lower = average - cutOff
      const higher = average + cutOff
      const filteredArray = numArray.filter((x) => {return x > lower && x < higher})

      return this.findAverage(filteredArray)
    },
    CreateXannotation(coordinate, name) {
      let labelPosition = 'top'
      let position1 = coordinate - 0.1
      let position2 = coordinate + 0.1
      if (coordinate == 1) {
        position1 += 0.1
      } else if (coordinate == 10){
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
            background: '#e3ae00',
          },
          offsetX: 45,
          offsetY: 10,
          text: name
          }
        } 
      }
  }
}
</script>

<style scoped>
.hey {
  background-color: #a57f01
}

</style>
