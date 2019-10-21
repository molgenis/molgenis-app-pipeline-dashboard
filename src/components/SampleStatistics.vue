<template>
<b-container class="p-2 h-100" fluid>
  <b-row no-gutters class="h-100">
    <b-col class="border border-primary p-0 h-100">
      <b-row no-gutters>
        <apexchart type="donut" width="500" :options="chartOptions" :series="series"></apexchart>
      </b-row>
      <b-row no-gutters>
        <b-col>
          Samples processed:
          <span class="badge badge-info ml-1 mr-1">Total: {{ totalSampleCount }}</span>
          <span class="badge badge-info ml-1 mr-1">Week: {{ Math.floor(totalSampleCount/29) }}</span>
          <span class="badge badge-info ml-1 mr-1">Today: {{ Math.floor(totalSampleCount / 144) }}</span>
          <span class="badge badge-info ml-1 mr-1">Now: {{ Math.floor(totalSampleCount/ 444) }}</span>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</b-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'sample-statistics',
  data () {
    return {
      totalSampleCount: 14324,
      series: [6357, 760, 6272, 860, 482, 163, 76],
      chartOptions: {
        labels: ['NB501043', 'M01785', 'NB501093', 'M01997', 'K00296', 'A00379', 'NB500917R'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
              height: '50%'
            },
            legend: {
              show: false
            }
          }
        }],
        legend: {
          position: 'right',
          offsetY: 0,
          height: 230
        },
        title: {
          text: 'Sequencer Usage Spread',
          align: 'center'
        }
      }

    }
  }
})
</script>
