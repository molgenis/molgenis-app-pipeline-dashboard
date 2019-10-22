<template>
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
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'sample-count',
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
    }
  },
  methods: {
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
    /**-
     * Formats a Date object to yyyy-mm-dd
     * @returns Date string as yyyy-mm-dd
     */
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
     * @param range Array in format [date1, date2] where date = yyyy-mm-dd
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
    mounted (): void {
      this.getSampleNumbers()
      setInterval(this.getSampleNumbers, 100000)
    }

})
</script>