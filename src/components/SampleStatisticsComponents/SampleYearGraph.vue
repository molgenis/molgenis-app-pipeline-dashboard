<template>
  <b-row no-gutters>
    <b-col>
      <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'sample-year-graph',
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
      jan: 122,
      feb: 256,
      mar: 99,
      apr: 68,
      may: 66,
      jun: 343,
      jul: 432, 
      aug: 399,
      sep: 302,
      oct: 267,
      nov: 201,
      dec: 104,
      Month: 9
    }
  },
  computed: {
    orderedYear() {
      let yearArray = [this.jan, this.feb, this.mar, this.apr, this.may, this.jun, this.jul, this.aug, this.sep, this.oct, this.nov, this.dec]
      for (let index = 0; index < this.today; index++) {
        yearArray.push(yearArray.shift())
      }
      return yearArray
    },
    labels() {
      let labels = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'december']
      for (let index = 0; index < this.Month; index++) {
        labels.push(labels.shift())
      }
      return labels
    },
    series() {
      return [{
        name: 'Samples',
        data: this.orderedYear
      }]
    },
    chartOptions() {
      return {
        chart: {
          type: 'bar',
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 2
        },
        xaxis: {
          categories: this.labels
        },
        yaxis: {
          title: {
            text: 'Samples Processed',
          },
        }
    }

  }
}}

</script>

<style lang="scss" scoped>

</style>