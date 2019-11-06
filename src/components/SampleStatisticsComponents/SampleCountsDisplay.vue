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

<script>
import { mapActions, mapState } from 'vuex'
import { createDateRange } from '@/helpers/dates'

export default {
  name: 'sample-count',
  data () {
    return {
      yearlySampleCount: 0,
      monthlySampleCount: 0,
      weeklySampleCount: 0,
      dailySampleCount: 0,
      currentSampleCount: 32
    }
  },
  methods: {
    /**
     * Gets Sample totals in date ranges from MOLGENIS database
     * 
     * @returns {Promise<void>}
     */
    async getSampleNumbers () {
      this.getTotalSampleCounts()
      try {
        const now = new Date()
        const dayMs = 24 * 60 * 60 * 1000

        const yearRange = createDateRange(new Date(now.getTime() - (356 * dayMs)), now)
        const MonthRange = createDateRange(new Date(now.getTime() - (31 * dayMs)), now)
        const weekRange = createDateRange(new Date(now.getTime() - (7 * dayMs)), now)
        const dayRange = createDateRange(new Date(now.getTime() -  (dayMs)), now)

        this.yearlySampleCount = await this.getSamplesInDateRange(yearRange)
        this.weeklySampleCount = await this.getSamplesInDateRange(weekRange)
        this.dailySampleCount = await this.getSamplesInDateRange(dayRange)
        this.monthlySampleCount = await this.getSamplesInDateRange(MonthRange)

      } catch (error) {
        console.error
      }
    }
  },
  computed: {
    ...mapActions([
      'getSamplesInDateRange',
      'getTotalSampleCount'
    ]),
    ...mapState([
      'totalSampleCount'
    ])
  },
  mounted () {
    this.getSampleNumbers()
    setInterval(this.getSampleNumbers, 100000)
  }

}
</script>