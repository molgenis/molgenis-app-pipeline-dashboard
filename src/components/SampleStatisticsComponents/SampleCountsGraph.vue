<template>
  <b-row no-gutters class="h-100">
    <b-col class="h-100">
      <b-container class="h-100" fluid>
        <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
      </b-container>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'sample-counts-graph',
  props: {
    API: {
      type: String,
      required: true
    },
    headers: {
      type: Headers,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: 'WEEK'
    },
    timeIndex: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data () {
    return {
      week: {
        monday: 12,
        tuesday: 30,
        wednesday: 9,
        thursday: 26,
        friday: 42,
        saturday: 2,
        sunday: 3,
      },
      year: {
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
        dec: 104
      },
      month: {
        '1': 12,
        '2': 32,
        '3': 5,
        '4': 7,
        '5': 6,
        '6': 2,
        '7': 66,
        '8': 34,
        '9': 23,
        '10': 9,
        '11': 19,
        '12': 21,
        '13': 11,
        '14': 12,
        '15': 42,
        '16': 23,
        '17': 12,
        '18': 22,
        '19': 30,
        '20': 33,
        '21': 53,
        '22': 9,
        '23': 3,
        '24': 8,
        '25': 5,
        '26': 4,
        '27': 2,
        '28': 4,
        '29': 8,
        '30': 3,
        '31': 3
      }
    }
  },
  computed: {
    selectedData() {
      switch (this.type) {
        case 'WEEK':
          return this.week
        case 'YEAR':
          return this.year
        default:
          return this.month
      }
    },
    title() {
      switch (this.type) {
        case 'WEEK':
          return 'Samples Used last 7 days'
        case 'YEAR':
          return 'Samples Used last 12 Months'
        default:
          return 'Samples Used last 31 days'
      }
    },
    ordered() {
      let seriesArray = Object.values(this.selectedData)
      for (let index = 0; index < this.timeIndex; index++) {
        seriesArray.push(seriesArray.shift())
      }
      return seriesArray
    },
    labels() {
      let labels = Object.keys(this.selectedData)
      for (let index = 0; index < this.today; index++) {
        labels.push(labels.shift())
      }
      return labels
    },
    series() {
      return [{
        name: 'Samples',
        data: this.ordered
      }]
    },
    chartOptions() {
      return {
        chart: {
          type: 'bar',
          height: '100%',
          toolbar: {
            show: false
          }
        },
        title: {
          text: this.title,
          align: 'center'
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