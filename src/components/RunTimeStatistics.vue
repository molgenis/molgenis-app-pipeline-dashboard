<template>
    <b-row no-gutters>
      <b-col cols="4" class="h-50 p-2">
        <b-container class="border border-primary p-0" fluid>
          <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
        </b-container>
      </b-col>
      <b-col cols="8" class="m-2"></b-col>
    </b-row>  
</template>

<script>
import { parse } from '@fortawesome/fontawesome-svg-core'

export default {
  name: 'run-time-statistics',
  props: {
    runTimes: Array
  },
  data: function() {
    return {
      chartOptions: {
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
        plotOptions: {
          bar: {
            colors: {
              ranges: [{
                from:-50,
                to: 0,
                color: '#F15B46'
              }]
            },
            columnWidth: '100%'
          }
        },
        dataLabels: {
          enabled: false,
        },
        yaxis: {
          title: {
            text: 'Runtime (hours)'
          },
          min: 0,
          max: 20
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
        annotations: {
          yaxis: [
            {
              y: 8.5,
              strokeDashArray: 0,
              borderColor: "#775DD0",
              label: {
                borderColor: "#775DD0",
                style: {
                  color: "#fff",
                  background: "#775DD0"
                },
                text: "Average runtime"
              }
            }
          ]}
      }
    }
  },
  computed: {
    series: function () {
      this.chartOptions.annotations.yaxis[0].y = this.findAverage(this.runTimes)
      return [{
        name: 'looptijd',
        data: this.runTimes
      }]},
  },
  methods: {
    findAverage(numArray) {
      let sum = 0
      numArray.forEach((x) => {
        
        sum += x
        console.log(sum)
      })

      const avg = sum / 10
      console.log(avg)
      return avg
    }
  }
}
</script>

<style scoped>

</style>