<template>
  <b-row no-gutters>
    <b-col>
      <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'sample-week',
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
      monday: 12,
      tuesday: 30,
      wednesday: 9,
      thursday: 26,
      friday: 42,
      saturday: 2,
      sunday: 3,
      today: 0
    }
  },
  computed: {
    orderedWeek() {
      let weekArray = [this.monday, this.tuesday, this.wednesday, this.thursday, this.friday, this.saturday, this.sunday]
      for (let index = 0; index < this.today; index++) {
        weekArray.push(weekArray.shift())
      }
      return weekArray
    },
    labels() {
      let labels = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      for (let index = 0; index < this.today; index++) {
        labels.push(labels.shift())
      }
      return labels
    },
    series() {
      return [{
        name: 'Samples',
        data: this.orderedWeek
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