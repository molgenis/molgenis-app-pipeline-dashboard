<template>
  <b-container class="p-2 h-100" fluid>
    <b-row class="h-100" no-gutters>
      <b-col class="h-100 border border-primary">
        <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { durationStatisticsStorage } from '../types/graphTypes'

declare module 'vue/types/vue' {
  interface Vue {
    durations: Record<string, durationStatisticsStorage>
    axis: {series: {name: string, data: number[]}[], xcategories: string[]}
    series: {name: string, data: number[]}[]
    xaxis: {type: string, categories: string[]}
    getDurationStatistics(): Promise<void>
  }
}
export default Vue.extend({
  name: 'timing-chart',
  data () {
    return {
    }
  },
  props: {
  },
  methods: {
    ...mapActions([
      'getDurationStatistics'
    ]),
    async getData() {
      this.getDurationStatistics()
      .catch((error) => {
        setTimeout(this.getData, 5000)
      })
    }
  },
  computed: {
    ...mapState([
      'durations'
    ]),
    axis (): {series: {name: string, data: number[]}[], xcategories: Array<string | null>} {
      const series = ['rawDataDuration', 'pipelineDuration', 'resultCopyDuration'].map((serieName) => {
        return {
          name: serieName,
          data: [] as number[]
        }
      })
      //@ts-ignore
      const durations: Record<string, durationStatisticsStorage> = this.durations
      const categories = Object.keys(this.durations).map((pipelineType: string) => {
        const data = durations[pipelineType]
        series[0].data.push(Math.round(data.getRawMedian()))
        series[1].data.push(Math.round(data.getPipelineMedian()))
        series[2].data.push(Math.round(data.getResultMedian()))
        return pipelineType
      })
      return {series: series, xcategories: categories}
    },
    series (): {name: string, data: number[]}[] {
      //@ts-ignore
      return this.axis.series
    },
  xaxis (): {type: string, categories: string[], title: {text: string}} {
    return {
      type: 'string',
      categories: this.axis.xcategories,
      title: {
        text: 'PrepKit'
      }
    }
  },
  chartOptions (): any {
    return {
      chart: {
        height: '100%',
        stacked: true,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      title: {
          text: 'Median runtime per workflow step',
          align: 'center'
        },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }],
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: this.xaxis,
      
      legend: {
        position: 'right',
        offsetY: 40
      },
      yaxis: {
          title: {
            text: 'Runtime (minutes)'
          },
        },
      fill: {
        opacity: 1
      }
    }
  }
  },
  async mounted () {
    await this.getData()
  }
})
</script>