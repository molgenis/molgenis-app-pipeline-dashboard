<template>
  <b-container class="h-100 p-2" fluid @mouseover="hover = true" @mouseleave="hover = false">
    <b-row no-gutters class="h-100">
      <b-col class="h-100">
        <transition-group name="fade">
          <template v-show="hover">
            <div :key="1" v-show="hover" class="graphOptions right">
              <b>Range:</b><b-form-select v-model="selectedRange" :options="rangeOptions" size="sm" plain></b-form-select>
            </div>
            <div :key="2" v-show="hover" class="">
              <span class="graphOptions left"><b>Statistic:</b><b-form-select v-model="selectedStatistic" :options="statisticsOptions" size="sm" plain></b-form-select></span>
              <span v-if="selectedStatistic === 'cluster'" class="graphOptions left leftPlus"><b>prepKit:</b><b-form-select v-model="selectedSubStatistic" :options="subOptions" size="sm" plain></b-form-select></span>
            </div>
          </template>
        </transition-group>
        <b-container class="border border-primary p-0 h-100" fluid >
          <apexchart type="line" :options="chartOptions" :series="computedSeries"></apexchart>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { GraphAnnotation, Annotation, xAnnotation, yAnnotation, AnnotationLabel, LabelStyle, ChartOptions, Serie, Outlier } from '@/types/graphTypes'
import { RunTime, RunTimeStatistic, AverageData, pipelineType } from '@/types/dataTypes'
import { getSD, calculateMean } from '@/helpers/statistics'
import { cropTitle } from '@/helpers/utils'
import { State } from '../store/state'

declare module 'vue/types/vue' { 
  interface Vue extends State {
    getTimingData(range: number): void

  }
}

export default Vue.extend({
  name: 'run-time-statistics',
  data () {
    return {
      selectedRange: 10,
      selectedStatistic: 'cluster',
      selectedSubStatistic: 'Exoom',
      rangeOptions: [
        { value: 10, text: '10'},
        { value: 100, text: '100'},
        { value: 1000, text: '1000'}
      ],
      statisticsOptions: [
        { value: 'cluster', text: 'Cluster'},
        { value: 'prepKit', text: 'prepKit'}
      ],
      hover: false
    }
  },
  computed: {
    subOptions(): Array<{value: string, text: string}>{
      let options: Array<{value: string, text: string}> = []
      this.pipelineTypes.forEach((pipelineType: string) => {
        options.push({ value: pipelineType, text: pipelineType})
      })
      return options
    },
    /**
     * Computed property that builds chart options
     * 
     * @returns {chartOptions}
     */
    chartOptions (): ChartOptions {
      const sampleCounts = this.machineSampleCounts
      let title = ''
      if (this.selectedStatistic === 'cluster') {
        title = `${this.selectedSubStatistic} runtime trends by ${this.selectedStatistic}`
      } else {
        title = `runtime trends by ${this.selectedStatistic}`
      }

      return {
        chart: {
          height: '100%',
          id: 'run-time-graph',
          toolbar: {
            show: false,
            tools: {
              download: false
            }
          }
        },
        noData: {
          text: 'Loading...',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: '14px',
            fontFamily: undefined
          }
        },
        title: { 
          text: title,
          align: 'center'
        },
        stroke: {
          width: 4
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          labels: {
            show: false
          }
        },
        yaxis: {
          title: {
            text: 'Runtime (hours)'
          },
          min: 0
        },
        tooltip: {
          y: {
          
          formatter: function(value: number, { series , seriesIndex, dataPointIndex, w }: {series: Serie, seriesIndex: number, dataPointIndex: number, w: object}, machineSampleCounts: Record<string, number[]> = sampleCounts) {
            return `${value} (hr), ${machineSampleCounts[Object.keys(machineSampleCounts)[seriesIndex]][dataPointIndex]} (samples)`
          }
  }
        },
        annotations: {} as GraphAnnotation
      }
    },
    machineSampleCounts () {
      return this.machineSampleCounts
    },
    computedSeries (): Serie[] | null{
      switch (this.selectedStatistic) {
        case 'prepKit':
          return this.statistics
        case 'cluster':
          return this.machineRuntimes[this.selectedSubStatistic]
        default:
          return null
      }
    },
    ...mapState([
      'machineSampleCounts',
      'statistics',
      'pipelineTypes',
      'machineRuntimes'
    ])
  },
  methods: {
    ...mapActions([
      'getTimingData'
    ])
  },
  mounted () {
    this.getTimingData(this.selectedRange)
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.graphOptions {
  position: absolute; 
  z-index: 2; 
  margin-top: 5px;
}
.right {
  right: 0; 
  margin-right: 10px; 
}
.left {
  left: 0;
  margin-left: 10px;
}

.leftPlus {
  left: 80px;
}
</style>
