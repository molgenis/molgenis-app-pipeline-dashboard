<template>
  <b-row no-gutters class="h-100">
    <b-col class="h-100">
      <b-container class=" p-0 h-100" fluid>
        <apexchart type="pie" :options="chartOptions" :series="sequencerStatisticsSeries"></apexchart>
      </b-container>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { ChartOptions } from '../../types/graphTypes'

declare module 'vue/types/vue' {
  interface Vue {
    sequencerStatisticsSeries: number[];
    sequencerStatisticsLabels: string[];
    chartOptions: ChartOptions;
    getSequencerStatistics(): Promise<void>;
    updateStatistics(): void;
  }
}

export default Vue.extend({
  name: 'sequencer-spread-graph',
  methods: {
    ...mapActions([
      'getSequencerStatistics'
    ]),
    updateStatistics (): void {
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
    chartOptions (): ChartOptions {
      return {
        chart: {
          type: 'pie',
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
  mounted (): void {
    this.updateStatistics()
  }
})
</script>

<style lang="scss" scoped>

</style>
