<template>
  <b-row no-gutters>
    <b-col>
      Samples processed:
      <span class="badge badge-info ml-1 mr-1">Total: {{ total }}</span>
      <span class="badge badge-info ml-1 mr-1">Year: {{ yearly }}</span>
      <span class="badge badge-info ml-1 mr-1">Week: {{ weekly }}</span>
      <span class="badge badge-info ml-1 mr-1">Today: {{ daily }}</span>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapState } from 'vuex'

declare module 'vue/types/vue' {
  interface Vue {
    total: number;
    yearly: number;
    weekly: number;
    daily: number;
    monthly: number;
    getSampleNumbers(): void;
  }
}

export default Vue.extend({
  name: 'sample-count',
  computed: {
    ...mapActions([
      'getSampleNumbers'
    ]),
    ...mapState({
      total: 'totalSampleCount',
      yearly: 'yearlySampleCount',
      weekly: 'weeklySampleCount',
      daily: 'dailySampleCount',
      monthly: 'monthlySampleCount'
    })
  },
  mounted (): void {
    this.getSampleNumbers()
    setInterval(this.getSampleNumbers, 100000)
  }

})
</script>
