<template>
  <b-row no-gutters>
    <b-col>
      Samples processed:
      <span class="badge badge-info ml-1 mr-1">Total: {{ total }}</span>
      <span class="badge badge-info ml-1 mr-1">Year: {{ year }}</span>
      <span class="badge badge-info ml-1 mr-1">Week: {{ week }}</span>
      <span class="badge badge-info ml-1 mr-1">Today: {{ day }}</span>
    </b-col>
  </b-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { createDateRange } from '@/helpers/dates'

export default {
  name: 'sample-count',
  computed: {
    ...mapActions([
      'getSampleNumbers'
    ]),
    ...mapState({
      total: 'totalSampleCount',
      year: 'yearlySampleCount',
      week: 'weeklySampleCount',
      day: 'dailySampleCount',
      month: 'monthlySampleCount'
    })
  },
  mounted () {
    this.getSampleNumbers()
    setInterval(this.getSampleNumbers, 100000)
  }

}
</script>