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
          <span class="badge badge-info ml-1 mr-1">Year: {{ yearlySampleCount }}</span>
          <span class="badge badge-info ml-1 mr-1">Week: {{ weeklySampleCount }}</span>
          <span class="badge badge-info ml-1 mr-1">Today: {{ dailySampleCount }}</span>
          <span class="badge badge-info ml-1 mr-1">Now: {{ currentSampleCount }}</span>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { parse } from '@fortawesome/fontawesome-svg-core'

declare module 'vue/types/vue' {
    interface Vue {
      API: string
      headers: Headers
      series: number[]
      chartLabels: string[]
      yearlySampleCount: number
      weeklySampleCount: number
      dailySampleCount: number
      monthlySampleCount: number
      getSequencerStatistics(): Promise<void>
      formatDate(date: Date): string
      getSamplesInDateRange(range: string[]): Promise<number>
    }
}

export default Vue.extend({
  name: 'sample-statistics',
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
      totalSampleCount: 14324,
      yearlySampleCount: 0,
      monthlySampleCount: 0,
      weeklySampleCount: 0,
      dailySampleCount: 0,
      currentSampleCount: 32,
      series: [] as number[],
      chartLabels: [] as string[],
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
    },
    /**
     * Gets Sample totals in date ranges from MOLGENIS database
     */
    async getSampleNumbers () {
      try {
        const now = new Date()
        const dayMs = 24 * 60 * 60 * 1000
        const nowFormatted = this.formatDate(now)
        const yearRange = [this.formatDate(new Date(now.getTime() - (356 * dayMs))), nowFormatted]
        const MonthRange = [this.formatDate(new Date(now.getTime() - (31 * dayMs))), nowFormatted]
        const weekRange = [this.formatDate(new Date(now.getTime() - (7 * dayMs))), nowFormatted]
        const dayRange = [this.formatDate(new Date(now.getTime() -  (dayMs))), nowFormatted]
        this.yearlySampleCount = await this.getSamplesInDateRange(yearRange)
        this.weeklySampleCount = await this.getSamplesInDateRange(weekRange)
        this.dailySampleCount = await this.getSamplesInDateRange(dayRange)
        this.monthlySampleCount = await this.getSamplesInDateRange(MonthRange)
      } catch (error) {
        console.error
      }
    },
    formatDate(date: Date): string {
      let day = date.getDay().toString()
      let month = date.getMonth().toString()
      const year = date.getFullYear()
      if (parseInt(month) < 10) {
        month = '0' + month
      }
      if (parseInt(day) < 10) {
        day = '0' + day
      }
      return year + '-' + month + '-' + day
    },
    /**
     * Gets a sample total in a date range
     * @param range Array in format [date1, date2] where date = yymmdd
     * @returns total samples in range
     */
    async getSamplesInDateRange(range: string[]): Promise<number> {
      const response = await fetch(
        this.API +
        'status_samples?q=sequencingStartDate=rng=(' +
        range[0] +
        ',' +
        range[1] +
        ')&num=1', { headers: this.headers }
      )
      const Total = await response.json()
      return Total.total
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
      this.getSampleNumbers()
      setInterval(this.getSequencerStatistics, 100000)
    }
})
</script>
