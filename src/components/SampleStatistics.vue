<template>
<b-container class="p-2 h-100" fluid>
  <b-row no-gutters class="h-100">
    <b-tabs class="border border-primary p-0 w-100">
      <b-tab title="Sequencer Usage" class="h-100">
        <sequencer-usage-spread-graph :API="API" :headers="headers"></sequencer-usage-spread-graph>
      </b-tab>
      <b-tab title="Week">
        <sample-week-graph :API="API" :headers="headers"></sample-week-graph>
      </b-tab>
      <b-tab title="Year">
        <sample-year-graph :API="API" :headers="headers"></sample-year-graph>
      </b-tab>
    </b-tabs>
  </b-row>
</b-container>
</template>

<script>
import SequencerUsageSpreadGraph from '@/components/SampleStatisticsComponents/SequencerUsageSpreadGraph.vue'
import SampleCountsDisplay from '@/components/SampleStatisticsComponents/SampleCountsDisplay.vue'
import SampleWeekGraph from '@/components/SampleStatisticsComponents/SampleWeekGraph.vue'
import SampleYearGraph from '@/components/SampleStatisticsComponents/SampleYearGraph.vue'

export default {
  name: 'sample-statistics',
  components: {
    SequencerUsageSpreadGraph,
    SampleCountsDisplay,
    SampleWeekGraph,
    SampleYearGraph
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
}
</script>
