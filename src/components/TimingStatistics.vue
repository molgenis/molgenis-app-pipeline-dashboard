<template>
  <b-container class="p-2 h-100" fluid>
    <b-row class="h-100" no-gutters>
      <b-col v-if="selected === 'Runtimes'" class="h-100 border border-primary">
        <apexchart type="bar" :options="chartOptionsBar" :series="seriesBar"></apexchart>
      </b-col>
      <b-col v-else class="border border-primary">
        <apexchart type="area" :options="chartOptionsTiming" :series="seriesRuntimes"></apexchart>
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
    timeSeries: Record<string, Record<string, number>>
    getDurationStatistics(): Promise<void>
    getData(): Promise<void>
  }
}
export default Vue.extend({
  name: 'timing-chart',
  data () {
    return {
      selected: 'Runtsdimes'
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
      'durations',
      'timeSeries'
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
    seriesBar (): {name: string, data: number[]}[] {
      //@ts-ignore
      return this.axis.series
    },
  xaxis (): {type: string, categories: string[], title: {text: string}} {
    return {
      type: 'string',
      //@ts-ignore
      categories: this.axis.xcategories,
      title: {
        text: 'PrepKit'
      }
    }
  },
  chartOptionsBar (): any {
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
  },
  chartOptionsTiming (): any {
    return {
      chart: {
       height: '100%',
      },
      title: {
          text: 'Runtime',
          align: 'center'
        },
      plotOptions: {
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
          title: {
            text: 'Pipeline Duration (Minutes)'
          },
          min: 0,
        },
        fill: {
          opacity: 1
        }
    }
  },
  xaxisRuntimes (): {type: string, categories: string[], title: {text: string}} {
    return {
      type: 'date',
      categories: Object.keys(this.timeSeries),
      title: {
        text: 'Day'
      }
    }
  },
  seriesRuntimes () {
    return Object.keys(this.durations).map((pipelineType) => {
      const data = this.timeSeries
      const dates = Object.keys(data)
      return {
        name: pipelineType,
        data: dates.map((dateKey: string) => {
          return {
            y: data[dateKey][pipelineType] ? Math.round(((data[dateKey][pipelineType] / data[dateKey][pipelineType + 'Times']) / 60) * 10) / 10 : null,
            x: dateKey
            }
        })
      }
    })
  }
  },
  async mounted () {
    //@ts-ignore
    await this.getData()
  }
})
</script>