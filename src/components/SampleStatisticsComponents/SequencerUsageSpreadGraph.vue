<template>
  <b-row no-gutters class="h-100">
    <b-col class="h-100">
      <b-container class=" p-0 h-100" fluid>
        <apexchart type="donut" :options="chartOptions" :series="SequencerStatisticsSeries"></apexchart>
      </b-container>
    </b-col>
  </b-row>
</template>

<script >
import { mapState, mapActions } from 'vuex'
export default {
  name: 'sequencer-spread-graph',
  computed: {
    ...mapState([
      'SequencerStatisticsSeries',
      'SequencerStatisticsLabels'
    ]),
    ...mapActions([
      'getSequencerStatistics'
    ]),
    /**
     * Sets the chart options & labels
     */
    chartOptions () {
      return {
        chart: {
          type: 'donut',
          height: '100%',
          width: '100%',
          toolbar: {
            show: false
          }
        },
        labels: this.SequencerStatisticsLabels,
        legend: {
          position: 'right',
          offsetY: 0
        },
        title: {
          text: 'Sequencer Usage Spread',
          align: 'center'
        }
      }
    }
  },
  mounted() { 
    this.getSequencerStatistics()
  },
}
</script>

<style lang="scss" scoped>

</style>