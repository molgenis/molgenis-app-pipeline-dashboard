<template>
  <b-row no-gutters class="h-100">
    <b-col class="h-100">
      <b-container class=" p-0 h-100" fluid>
        <apexchart type="donut" :options="chartOptions" :series="sequencerStatisticsSeries"></apexchart>
      </b-container>
    </b-col>
  </b-row>
</template>

<script >
import { mapState, mapActions } from 'vuex'
export default {
  name: 'sequencer-spread-graph',
  methods: {
    ...mapActions([
      'getSequencerStatistics'
    ]),
    updateStatistics () {
      this.getSequencerStatistics()
        .catch(() => {
          setTimeout(this.updateStatistics, 10000)
        })
    }
  },
  computed: {
    ...mapState([
      'sequencerStatisticsSeries',
      'sequencerStatisticsLabels'
    ]),
    /**
     * Sets the chart options & labels
     * reference: https://apexcharts.com/docs/options/
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
        labels: this.sequencerStatisticsLabels,
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
  mounted () {
    this.updateStatistics()
  }
}
</script>

<style lang="scss" scoped>

</style>
