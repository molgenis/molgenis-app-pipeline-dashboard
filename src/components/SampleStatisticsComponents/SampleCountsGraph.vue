<template>
  <b-row no-gutters class="h-100 w-100">
    <b-col class="h-100 w-100">
      <b-container class="h-100 w-100 p-0" fluid>
        <apexchart type="bar" :options="chartOptions" :series="graphSeries"></apexchart>
        
      </b-container>
      <div class="TotalCounts d-flex w-100 justify-content-center">
        <p class="border border-primary rounded-pill p-1 pr-2 pl-2">{{sumOfSamples}} {{sumOfSamples === 1 ? "Sample" : "Samples"}}</p>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import { formatDate, dateIsLastYear } from '@/helpers/dates'
import { sumArray } from '@/helpers/statistics'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'sample-counts-graph',
  props: {
    type: {
      type: String,
      required: false,
      default: 'WEEK'
    },
  },
  data () {
    const initialWeek = {
        sunday: 0,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0
      }
      const initialYear =  {
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
      }
      const initialMonth =  {
        '30': 0,
        '29': 0,
        '28': 0,
        '27': 0,
        '26': 0,
        '25': 0,
        '24': 0,
        '23': 0,
        '22': 0,
        '21': 0,
        '20': 0,
        '19': 0,
        '18': 0,
        '17': 0,
        '16': 0,
        '15': 0,
        '14': 0,
        '13': 0,
        '12': 0,
        '11': 0,
        '10': 0,
        '9': 0,
        '8': 0,
        '7': 0,
        '6': 0,
        '5': 0,
        '4': 0,
        '3': 0,
        '2': 0,
        '1': 0
      }
    return {
      week: initialWeek,
      month: initialMonth,
      year: initialYear,
      initialWeek: initialWeek,
      initialYear: initialYear,
      initialMonth: initialMonth
    }
  },
  computed: {
    ...mapState([
      'sequencedSampleNumbers',
    ]),
    /**
     * returns the current selected data sum
     */
    sumOfSamples () {
      return sumArray(Object.values(this.selectedData))
    },
    /**
     * returns the current day/month index
     * @returns {number} timeindex
     */
    timeIndex() {
      if (this.type === 'YEAR') {
        const date = new Date()
        return date.getMonth()
      } else if (this.type === 'WEEK') {
        const date = new Date()
        return date.getDay()
      }
      return 0
    },
    /**
     * returns the visible data
     * @returns {Object} sample counts per date 
     */
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
    /**
     * Returns the correct title for the graph
     * @returns {string} title
     */
    title() {
      switch (this.type) {
        case 'WEEK':
          return 'Samples Sequenced last 7 days'
        case 'YEAR':
          return 'Samples Sequenced last 12 Months'
        default:
          return 'Samples Sequenced last 30 days'
      }
    },
    /**
     * Returns a ordered array of sample counts per date.
     * Ordered by wich date it is currently
     * @returns {Array<Number>}
     */
    sampleCountsInOrder() {
      const values = Object.values(this.selectedData)
      return [...values.slice(this.timeIndex), ...values.slice(0, this.timeIndex)]
    },
    /**
     * Returns a ordered array of labels
     * Ordered by wich date it is currently
     * @returns {Array<String>}
     */
    orderedSampleLabels() {
      const labels = Object.keys(this.selectedData)
      return [...labels.slice(this.timeIndex), ...labels.slice(0, this.timeIndex)]
    },
    /**
     * Returns a series for the graph
     * 
     * @returns {Array<Serie>}
     */
    graphSeries() {
      return [{
        name: 'Samples',
        data: this.sampleCountsInOrder
      }]
    },
    /**
     * Returns all chart options
     * reference: https://apexcharts.com/docs/options/
     * @returns {Object}
     */
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
          categories: this.orderedSampleLabels
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
    ...mapActions({
      getNumbers: 'getLastYearSampleSequencedNumbers'
    }),
    /**
     * Resets data to 0 for refilling
     */
    resetData() {
      this.week = this.initialWeek
      this.month = this.initialMonth
      this.year = this.initialYear
    },
    /**
     * Updates year data
     * for each month add the counts to local data
     * @param {Number} month - month of year (0-11)
     * @param {Number} count - Sample count that month
     */
    updateYear(month, count) {
      switch (month) {
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
    },
    /**
     * Fills graph data
     * 
     * @param {Number[]} formattedDate - Molgenis date formatted to Array [YYYY, MM, DD]
     * @param {Number} sampleCount - Samples Sequenced on Formatted date
     * 
     * @returns {void}
     */
    fillData(formattedDate, sampleCount) {
      const now = new Date()

      const dayMs = 24 * 60 * 60 * 1000

      const date = new Date()

      date.setFullYear(Number(formattedDate[0]))
      date.setMonth(Number(formattedDate[1]) - 1)
      date.setDate(Number(formattedDate[2]))

      if (dateIsLastYear(date, now)) {
        this.updateYear(date.getMonth(), sampleCount)
      }

      let timeDifference = Math.abs(now - date)
      let dayDifference = Math.ceil(timeDifference / dayMs)
      
      if (dayDifference <= 30) {
        this.month[dayDifference.toString()] = sampleCount
      }
      if (dayDifference <= 7) {
        this.week[Object.keys(this.week)[date.getDay()]] = sampleCount
      }
    },
    /**
     * Gets all samlpe counts of the past year from database
     * 
     * @returns {void}
     */
    async getPreviousYearData () {
    
    this.getNumbers().catch(() => {
      setTimeout(this.getPreviousYearData, 10000)
    })
    
    
    }
  },
  watch: {
    sequencedSampleNumbers() {
    this.resetData()
    for (let index = 0; index < this.sequencedSampleNumbers.labels.length; index++) {
      this.fillData(this.sequencedSampleNumbers.labels[index].split('-'), this.sequencedSampleNumbers.counts[index])
    }
    }
  },
  mounted () {
    this.getNumbers()
    setInterval(this.getNumbers, 3600000)
  }
}
</script>

<style lang="scss" scoped>
.TotalCounts {
  position: absolute; 
  z-index: 2;
}
</style>