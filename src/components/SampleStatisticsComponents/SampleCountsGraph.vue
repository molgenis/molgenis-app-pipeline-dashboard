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
import { formatDate, dateIsLastYear } from '../../helpers/dates'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'sample-counts-graph',
  props: {
    API: {
      type: String,
      required: true
    },
    headers: {
      type: Object,
      required: true
    },
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
      'sequencedSampleNumbers'
    ]),

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
    ordered() {
      let seriesArray = Object.values(this.selectedData)
      for (let index = 0; index < this.timeIndex; index++) {
        seriesArray.push(seriesArray.shift())
      }
      return seriesArray
    },
    /**
     * Returns a ordered array of labels
     * Ordered by wich date it is currently
     * @returns {Array<String>}
     */
    labels() {
      let labels = Object.keys(this.selectedData)
      for (let index = 0; index < this.timeIndex; index++) {
        labels.push(labels.shift())
      }
      return labels
    },
    /**
     * Returns a series for the graph
     * 
     * @returns {Array<Serie>}
     */
    series() {
      return [{
        name: 'Samples',
        data: this.ordered
      }]
    },
    /**
     * Returns all chart options
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
     * @param {Number} Month - Month of year (0-11)
     * @param {Number} Count - Sample count that month
     */
    UpdateYear(Month, Count) {
      switch (Month) {
          case 0:
            this.year.january += Count
            break
          case 1:
            this.year.february += Count
            break
          case 2:
            this.year.march += Count
            break
          case 3:
            this.year.april += Count
            break
          case 4:
            this.year.may += Count
            break
          case 5:
            this.year.june += Count
            break
          case 6:
            this.year.july += Count
            break
          case 7:
            this.year.august += Count
            break
          case 8:
            this.year.september += Count
            break
          case 9:
            this.year.october += Count
            break
          case 10:
            this.year.november += Count
            break
          default:
            this.year.december += Count
            break
        }
    },
    /**
     * Fills graph data
     * 
     * @param {Number[]} FormattedDate - Molgenis date formatted to Array [YYYY, MM, DD]
     * @param {Number} SampleCount - Samples Sequenced on Formatted date
     * 
     * @returns {void}
     */
    fillData(FormattedDate, SampleCount) {
      const Now = new Date()

      const dayMs = 24 * 60 * 60 * 1000

      const date = new Date()

      date.setFullYear(Number(FormattedDate[0]))
      date.setMonth(Number(FormattedDate[1]) - 1)
      date.setDate(Number(FormattedDate[2]))

      if (dateIsLastYear(date, Now)) {
        this.UpdateYear(date.getMonth(), SampleCount)
      }

      let timeDiffrence = Math.abs(Now - date)
      let dayDiffrence = Math.ceil(timeDiffrence / dayMs)
      
      if (dayDiffrence <= 30) {
        this.month[dayDiffrence.toString()] = SampleCount
      }
      if (dayDiffrence <= 7) {
        this.week[Object.keys(this.week)[date.getDay()]] = SampleCount
      }
    },
    /**
     * Gets all samlpe counts of the past year from database
     * 
     * @returns {void}
     */
    async getPreviousYearData () {
    
    await this.getNumbers()
    
    
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

</style>