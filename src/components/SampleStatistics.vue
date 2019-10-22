<template>
<b-container class="p-2 h-100" fluid>
  <b-row no-gutters class="h-100">
    <b-tabs class="border border-primary p-0 h-100">
      <b-tab title="Sequencer Usage">
        <sequencer-usage-spread-graph :API="API" :headers="headers"></sequencer-usage-spread-graph>
      <b-row no-gutters>
        <b-col>
          <h1> :-)</h1>
        </b-col>
      </b-row>
      </b-tab>
      <b-tab title="Sequencer Usage2">
      <b-row no-gutters>
        <sample-counts-display :API="API" :headers="headers"></sample-counts-display>
      </b-row>
      </b-tab>
      <b-tab title="Sequencer Usage3">
      
      </b-tab>

    </b-tabs>
  </b-row>
</b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import SequencerUsageSpreadGraph from '@/components/SampleStatisticsComponents/SequencerUsageSpreadGraph.vue'
import SampleCountsDisplay from '@/components/SampleStatisticsComponents/SampleCountsDisplay.vue'

declare module 'vue/types/vue' {
    interface Vue {
      API: string
      headers: Headers
      yearlySampleCount: number
      weeklySampleCount: number
      dailySampleCount: number
      monthlySampleCount: number
      formatDate(date: Date): string
      getSamplesInDateRange(range: string[]): Promise<number>
      getSampleNumbers(): Promise<void>
    }
}

export default Vue.extend({
  name: 'sample-statistics',
  components: {
    SequencerUsageSpreadGraph,
    SampleCountsDisplay
  },
  props: {
    API: {
      type: String,
      required: true
    },
    headers: {
      type: Headers,
      required: true
    }
  }
})
</script>
