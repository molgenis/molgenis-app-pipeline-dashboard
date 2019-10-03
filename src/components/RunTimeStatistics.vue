<template>
    <b-row no-gutters>
      <b-col cols="4" class="h-50 p-2">
        <b-container class="border border-primary p-0" fluid>
          <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
        </b-container>
      </b-col>
      <b-col cols="4" class="p-2 h-100">
        <b-container class="border border-primary p-0" fluid></b-container>
      </b-col>
       <b-col cols="4" class="p-2 h-100">
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
      threshold: 20
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
                text: 'Average runtime'
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
      for (let i = 0; i < this.runTimes.length; i++) {
        let obj = this.runTimes[i]
        let key = Object.keys(obj)[0]
        let value = Object.values(obj)[0]
        if (value >= this.threshold) {
          this.xAnnotations.push(this.CreateXannotation(i + 1, key))
        }
      }
        

      this.average = this.findAverage(numArray)
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
    findAverage(numArray) {
      let sum = 0
      numArray.forEach((x) => {
        sum += x
      })

      const avg = sum / 10
      console.log(avg)
      return avg
    },
    test() {
      this.chartOptions.annotations.xaxis.push(
        {
              x: 5.9,
              x2: 6.1,
              borderColor: '#a57f01',
              fillColor: '#e3ae00',
              opacity: 0.5,
              label: {
                borderColor: '#e3ae00',
                style: {
                  fontSize: '10px',
                  color: '#fff',
                  background: '#e3ae00',
                },
                text: '190814_NB501043_...'
                }
              }
      )
    },
    CreateXannotation(coordinate, name) {
      return {
              x: coordinate - 0.1,
              x2: coordinate + 0.1,
              borderColor: '#a57f01',
              fillColor: '#e3ae00',
              opacity: 0.5,
              label: {
                borderColor: '#e3ae00',
                style: {
                  fontSize: '10px',
                  color: '#fff',
                  background: '#e3ae00',
                },
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
