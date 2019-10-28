<template>
  <b-row no-gutters class="h-100 w-100">
    <b-col class="h-100 w-100">
      <b-container class="h-100 w-100 p-0" fluid>
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
        january: 0,
        february: 0,
        march: 0,
        april: 0,
        may: 0,
        june: 0,
        july: 0, 
        august: 0,
        september: 0,
        october: 0,
        november: 0,
        december: 0
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
    timeIndex() {
      if (this.type === 'YEAR') {
        const date = new Date()
        return date.getMonth()
      }
      return 0
    },
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
          return 'Samples Sequenced last 7 days'
        case 'YEAR':
          return 'Samples Sequenced last 12 Months'
        default:
          return 'Samples Sequenced last 31 days'
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
      for (let index = 0; index < this.timeIndex; index++) {
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
          width: '100%',
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
  },
  methods: {
    constructQueryDateString(date) {
      const year = date.getFullYear().toString()
      let month = date.getMonth().toString()
      if (month.length < 2) {
        month = '0' + month
      }
      let day = date.getDate().toString()
      if (day.length < 2) {
        dat = '0' + day
      }
      
      return year + '-' + month + '-' + day

    },
    async getPreviousYearData () {
      const Now = new Date()
      const dayMs = 24 * 60 * 60 * 1000

      const lastYear = new Date(Now.getTime() - (375 * dayMs))
      


      try {
      let response = await fetch(this.API + 'status_samples?aggs=x==sequencingStartDate;distinct==externalSampleID&q=sequencingStartDate=ge=' + this.constructQueryDateString(lastYear), { headers: this.headers })
      let result = await response.json()
          
      const CountMatrix = result.aggs.matrix
      const MatrixDates = result.aggs.xLabels
      const Now = new Date()
      const dayMs = 24 * 60 * 60 * 1000

      const Month = new Date(Now.getTime() - (31 * dayMs))
      
      
        let Dates = []
        const CurrentMonth = Now.getMonth()
        const CurrentYear = Now.getFullYear()

        for (let index = 0; index < MatrixDates.length; index++) {
          //format dd-mm-yyyy
          const reformat = MatrixDates[index].split('-')
          
          const date = new Date()
          date.setFullYear(Number(reformat[0]))
          date.setMonth(Number(reformat[1]))
          date.setDate(Number(reformat[2]))
          console.log(reformat, date)
          const count = CountMatrix[index][0]
          let dateMonth = date.getMonth()
          if ((date.getMonth() <= CurrentMonth && date.getFullYear() === CurrentYear) || (date.getMonth() > CurrentMonth && date.getFullYear() === (CurrentYear - 1))) {
            switch (dateMonth) {
              case 0:
                this.year.january += count
                break
              case 1:
                this.year.february += count
                break
              case 2:
                this.year.march += count
                break
              case 3:
                this.year.april += count
                break
              case 4:
                this.year.may += count
                break
              case 5:
                this.year.june += count
                break
              case 6:
                this.year.july += count
                break
              case 7:
                this.year.august += count
                break
              case 8:
                this.year.september += count
                break
              case 9:
                this.year.october += count
                break
              case 10:
                this.year.november += count
                break
              default:
                this.year.december += count
                break
            }
          }
        }      
    } catch (error) {
        console.error(error)
      }
    }
  },
  mounted () {
    this.getPreviousYearData ()
  }
}

</script>

<style lang="scss" scoped>

</style>