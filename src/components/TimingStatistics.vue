<template>

  <b-container class="h-100 border border-primary" fluid>
    <b-row>
          <b-col>
            <b-nav tabs align="center">
                <b-nav-item :active="selected === 'runtimes'" @click="selected = 'runtimes'">Median runtimes</b-nav-item>
                <b-nav-item :active="selected === 'timing'" @click="selected = 'timing'">Timeline</b-nav-item>
                <b-nav-item :active="selected === 'overall'" @click="selected = 'overall'">Recent Statistics</b-nav-item>
            </b-nav>
          </b-col>
        </b-row>
    <b-row class="h-100" no-gutters @mouseenter="stepDisplay = true" @mouseleave="stepDisplay = false">
      <b-col v-show="selected === 'runtimes'" class="h-100 pb-1 chart">
        <apexchart type="bar" :options="chartOptionsBar" :series="seriesBar"></apexchart>
      </b-col>
      <b-col v-show="selected === 'timing'" class="border pb-1 chart">
        <apexchart type="line" ref="areaTimingChart" :options="chartOptionsTiming" :series="seriesRuntimes"></apexchart>
      </b-col>
      <b-col v-show="selected === 'overall'" class="border h-100 pb-1 chart">
        <run-time-statistics></run-time-statistics>
      </b-col>
    </b-row>

  </b-container>

</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { DurationStatisticsStorage, Serie, ChartOptions } from '../types/graphTypes'
import RunTimeStatistics from '@/components/RunTimeStatistics.vue'

declare module 'vue/types/vue' {
  interface Vue {
    durations: Record<string, DurationStatisticsStorage>;
    axis: {series: {name: string; data: number[]}[]; xcategories: string[]};
    series: {name: string; data: number[]}[];
    xaxis: {type: string; categories: string[]; title: {text: string}};
    timeSeries: Record<string, Record<string, number>>;
    selected: string;
    seriesRuntimes: Serie[];
    selectedTypeIndex: number;
    types: string[];
    paused: boolean;
    getDurationStatistics(): Promise<void>;
    getData(): Promise<void>;
    cycleTimingChart(): void;
    changeChart(): void;
  }
}

enum chartTypes {
  timing = 'timing',
  runtimes = 'runtimes',
  overall = 'overall'
}

export default Vue.extend({
  name: 'timing-chart',
  components: {
    RunTimeStatistics
  },
  data () {
    return {
      selected: chartTypes.timing,
      selectedTypeIndex: 0,
      chartArray: ['runtimes', 'timing'],
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
    getData(): void {
      this.getDurationStatistics()
        .catch((error) => {
          console.warn(error, 'Retrieing')
          setTimeout(this.getData, 5000)
        })
    },
    changeChart (): void {
      if (!this.paused) {
        this.selected = this.selected === chartTypes.timing ? chartTypes.runtimes : chartTypes.timing
      }
    }

  },
  computed: {
    ...mapState([
      'durations',
      'timeSeries'
    ]),
    types (): string[] {
      return this.seriesRuntimes.map((type) => {
        return type.name
      })
    },
    axis (): {series: {name: string; data: number[]}[]; xcategories: Array<string | null>} {
      const series = ['rawDataDuration', 'pipelineDuration', 'resultCopyDuration'].map((serieName) => {
        return {
          name: serieName,
          data: [] as number[]
        }
      })
      const durations: Record<string, DurationStatisticsStorage> = this.durations
      const categories = Object.keys(this.durations).map((pipelineType: string) => {
        const data = durations[pipelineType]
        series[0].data.push(Math.round(data.getRawMedian()))
        series[1].data.push(Math.round(data.getPipelineMedian()))
        series[2].data.push(Math.round(data.getResultMedian()))
        return pipelineType
      })
      return { series: series, xcategories: categories }
    },
    seriesBar (): {name: string; data: number[]}[] {
      return this.axis.series
    },
    xaxis (): {type: string; categories: string[]; title: {text: string}} {
      return {
        type: 'string',
        categories: this.axis.xcategories,
        title: {
          text: 'PrepKit'
        }
      }
    },
    chartOptionsBar (): ChartOptions {
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
            horizontal: false
          }
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
          }
        },
        fill: {
          opacity: 1
        }
      }
    },
    chartOptionsTiming (): ChartOptions {
      return {
        chart: {
          width: '100%',
          toolbar: {
            show: false
          }
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
          type: 'datetime',
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
    xaxisRuntimes (): {type: string; categories: string[]; title: {text: string}} {
      return {
        type: 'date',
        categories: Object.keys(this.timeSeries),
        title: {
          text: 'Day'
        }
      }
    },
    seriesRuntimes (): {name: string; data: {y: number | null; x: string}[]}[] {
      return Object.keys(this.durations).map((pipelineType) => {
        const data = this.timeSeries as Record<string,Record<string, number>>
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
  mounted (): void {
    this.getData()
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
