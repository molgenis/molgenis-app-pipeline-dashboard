<template>
  <b-row no-gutters class="h-100">
    <b-col class="h-100">
      <b-container class=" p-0 h-100" fluid>
        <apexchart type="donut" :options="chartOptions" :series="series"></apexchart>
      </b-container>
    </b-col>
  </b-row>
</template>

<script >
export default {
  name: 'sequencer-spread-graph',
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
      series: [],
      chartLabels: []
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
        this.series = Array.from(Aggregates.matrix, (x) => x[0])
        this.chartLabels = Aggregates.xLabels

      } catch (error) {
        console.error(error)
      }
    }
  },
  computed: {
    chartOptions () {
      return {
        chart: {
          height: '100%',
          toolbar: {
            show: false
          }
        },
        labels: this.chartLabels,
        responsive: [{
          options: {
            chart: {
              
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
  mounted() {
    
    this.getSequencerStatistics()
  },
}
</script>

<style lang="scss" scoped>

</style>