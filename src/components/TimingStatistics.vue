<template>
  <b-container class="p-2 h-100"  fluid>
    <b-row class="h-100" no-gutters @mouseenter="stepDisplay = true" @mouseleave="stepDisplay = false">
      <b-col v-show="selected === 'runtimes'" class="h-100 border border-primary chart">
        <apexchart type="bar" :options="chartOptionsBar" :series="seriesBar"></apexchart>
      </b-col>
      <b-col v-show="selected === 'timing'" class="border border-primary chart">
        <apexchart type="line" ref="areaTimingChart" :options="chartOptionsTiming" :series="seriesRuntimes"></apexchart>
      </b-col>
      <div class="cycleDisplay d-flex w-100 justify-content-center position-absolute" v-show="stepDisplay">
        <div class="d-flex justify-content-around w-50" @click="selected = chartType" v-for="chartType in chartArray" :key="chartType">
          <font-awesome-icon :icon="[selected === chartType ? 'fas' : 'far', 'circle']" size="lg" style="height: 1vw; width: 1vw" :class="selected === chartType ? 'primary' : 'secondary'"></font-awesome-icon>
        </div>
    </div>
    </b-row>
    
  </b-container>
  
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { durationStatisticsStorage, Serie } from '../types/graphTypes'

declare module 'vue/types/vue' {
  interface Vue {
    durations: Record<string, durationStatisticsStorage>
    axis: {series: {name: string, data: number[]}[], xcategories: string[]}
    series: {name: string, data: number[]}[]
    xaxis: {type: string, categories: string[]}
    timeSeries: Record<string, Record<string, number>>
    selected: chartTypes
    seriesRuntimes: Serie[]
    selectedTypeIndex: number
    types: string[]
    getDurationStatistics(): Promise<void>
    getData(): Promise<void>
    cycleTimingChart(): void
    changeChart(): void

  }
}

enum chartTypes {
  timing = 'timing',
  runtimes = 'runtimes'
}

export default Vue.extend({
  name: 'timing-chart',
  data () {
    return {
      selected: chartTypes.timing,
      selectedTypeIndex: 0,
      chartArray: ["runtimes", "timing"],
      stepDisplay: false
    }
  },
  props: {
    paused: {
      type: Boolean,
      required: false,
      default: false
    }
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
    },
    changeChart() {
      if (!this.paused){
        this.selected = this.selected === chartTypes.timing ? chartTypes.runtimes : chartTypes.timing
      }
    }

  },
  computed: {
    ...mapState([
      'durations',
      'timeSeries'
    ]),
    types () {
      return this.seriesRuntimes.map((type) => {
        return type.name
      })
    },
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
        width: '100%',
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
            text: 'Runtime (minutes)',
            style: {
              fontSize: '0.8vw'
            }
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
       width: '100%',
       toolbar: {
         show: false
       },
      },
      stroke: {
        curve: 'straight',
        dashArray: [2, 4, 6, 8, 10, 12, 14]
      },
      markers: {
        size: 6
      },
      title: {
          text: 'Runtime',
          align: 'center'
        },
      plotOptions: {
      },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            fontSize: '0.8vw'
          }
        }
      },
      yaxis: {
          title: {
            text: 'Pipeline Duration (Hours)',
            style: {
              fontSize: '1vw'
            }
            
          },
          min: 0
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
    //@ts-ignore
    setInterval(this.changeChart, 20000)
  }
})
</script>

<style lang="scss" scoped>
@import 'bootstrap/scss/bootstrap';
@import 'bootstrap-vue/src/index.scss';


.chart {
  font-size: 0.5vw;
}
.cycleDisplay {
  z-index: 2;
  position: absolute;
  bottom: 10px;
}
.primary {
    color: $primary
}
.secondary {
    color: $secondary
}
</style>