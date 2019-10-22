<template>
  <b-row no-gutters>
    <apexchart type="donut" width="500" :options="chartOptions" :series="series"></apexchart>
  </b-row>
</template>

<script lang="ts">
import Vue from 'vue'

declare module 'vue/types/vue' {
    interface Vue {
      API: string
      headers: Headers
      series: number[]
      chartLabels: string[]
      getSequencerStatistics(): Promise<void>
    }
}




export default Vue.extend({
  name: 'sequencer-spread-graph',
  props: {
    API: {
      type: String,
      required: true
    },
    headers: {
      type: Headers,
      required: true
    }
  },
  data () {
    return {
      series: [] as number[],
      chartLabels: [] as string[]
    }
  },
  methods: {
    /**
     * Gets sequencer spread numbers from MOLGENIS database
     */
    async getSequencerStatistics () {
      try {
        let response = await fetch(this.API + 'status_samples?aggs=x==sequencer;distinct==externalSampleID', { headers: this.headers })
        const responseJson = await response.json()
        const Aggregates = await responseJson.aggs
        this.series = Array.from(Aggregates.matrix, (x: number[]) => x[0])
        this.chartLabels = Aggregates.xLabels

      } catch (error) {
        console.error(error)
      }
    }
  },
  computed: {
    chartOptions () {
      return {
        labels: this.chartLabels,
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
  },
  mounted (): void {
    this.getSequencerStatistics()
    setInterval(this.getSequencerStatistics, 100000)
  }
})
</script>

<style lang="scss" scoped>

</style>