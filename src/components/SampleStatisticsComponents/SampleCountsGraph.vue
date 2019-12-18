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

<script lang="ts">
import Vue from 'vue'
import { dateIsLastYear } from '@/helpers/dates'
import { sumArray } from '@/helpers/statistics'
import { mapActions, mapState } from 'vuex'
import { getDateLabel } from '@/helpers/time'
import { ChartOptions, Serie } from '../../types/graphTypes'

interface Week {
  'sunday': number;
  'monday': number;
  'tuesday': number;
  'wednesday': number;
  'thursday': number;
  'friday': number;
  'saturday': number;
}

interface Year {
  january: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;
}
declare module 'vue/types/vue' {
  interface Vue {
    type: string;
    month: Record<string, number>;
    year: Year;
    week: Record<string, number>;
    initialWeek: Week;
    initialYear: Year;
    initialMonth: Record<string, number>;
    selectedData: Year | Record<string, number>;
    timeIndex: number;
    dateMap: Record<string, string>;
    sampleCountsInOrder: number[];
    orderedSampleLabels: string[];
    sequencedSampleNumbers: { counts: number[]; labels: string[] };
    title: string;
    resetData(): void;
    updateYear(month: number, count: number): void;
    fillData(formattedDate: string[], sampleCount: number): void;
    getNumbers(): Promise<void>;

  }
}

export default Vue.extend({
  name: 'sample-counts-graph',
  props: {
    type: {
      type: String,
      required: false,
      default: 'WEEK'
    }
  },
  data () {
    const initialWeek: Record<string, number> = {
      sunday: 0,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0
    }
    const initialYear: Year = {
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
    const initialMonth: Record<string, number> = {
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
     * returns the current selected data sum
     */
    sumOfSamples (): number {
      return sumArray(Object.values(this.selectedData))
    },
    /**
     * returns the current day/month index
     * @returns {number} timeindex
     */
    timeIndex (): number {
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
    selectedData (): Record<string, number> | Week | Year {
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
    title (): string {
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
    sampleCountsInOrder (): number[] {
      const values = Object.values(this.selectedData)
      if (this.type === 'YEAR' || this.type === 'WEEK') {
        return [...values.slice(this.timeIndex), ...values.slice(0, this.timeIndex)]
      }
      return values.reverse()
    },
    /**
     * Returns a ordered array of labels
     * Ordered by wich date it is currently
     * @returns {Array<String>}
     */
    orderedSampleLabels (): string[] {
      const labels = Object.keys(this.selectedData)
      if (this.type === 'YEAR' || this.type === 'WEEK') {
        return [...labels.slice(this.timeIndex), ...labels.slice(0, this.timeIndex)]
      }
      return labels.map((label) => { return this.dateMap[label] })
    },
    /**
     * Returns a series for the graph
     *
     * @returns {Array<Serie>}
     */
    graphSeries (): Serie[] {
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
    chartOptions (): ChartOptions {
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
            text: 'Samples Processed'
          }
        }
      }
    },
    dateMap (): Record<string, string> {
      return {
        '30': getDateLabel(1),
        '29': getDateLabel(2),
        '28': getDateLabel(3),
        '27': getDateLabel(4),
        '26': getDateLabel(5),
        '25': getDateLabel(6),
        '24': getDateLabel(7),
        '23': getDateLabel(8),
        '22': getDateLabel(9),
        '21': getDateLabel(10),
        '20': getDateLabel(11),
        '19': getDateLabel(12),
        '18': getDateLabel(13),
        '17': getDateLabel(14),
        '16': getDateLabel(15),
        '15': getDateLabel(16),
        '14': getDateLabel(17),
        '13': getDateLabel(18),
        '12': getDateLabel(19),
        '11': getDateLabel(20),
        '10': getDateLabel(21),
        '9': getDateLabel(22),
        '8': getDateLabel(23),
        '7': getDateLabel(24),
        '6': getDateLabel(25),
        '5': getDateLabel(26),
        '4': getDateLabel(27),
        '3': getDateLabel(28),
        '2': getDateLabel(29),
        '1': getDateLabel(30)
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
    resetData (): void {
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
    updateYear (month: number, count: number): void {
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
    fillData (formattedDate: string[], sampleCount: number): void {
      const now = new Date()

      const dayMs = 24 * 60 * 60 * 1000

      const date = new Date()

      date.setFullYear(Number(formattedDate[0]))
      date.setMonth(Number(formattedDate[1]) - 1)
      date.setDate(Number(formattedDate[2]))

      if (dateIsLastYear(date, now)) {
        this.updateYear(date.getMonth(), sampleCount)
      }

      const timeDifference = Math.abs(now.getTime() - date.getTime())
      const dayDifference = Math.ceil(timeDifference / dayMs)

      if (dayDifference <= 30) {
        this.month[dayDifference.toString()] = sampleCount
      }
      if (dayDifference <= 7) {
        const day = Object.keys(this.week)[date.getDay()]
        this.week[day] = sampleCount
      }
    },
    /**
     * Gets all samlpe counts of the past year from database
     *
     * @returns {void}
     */
    getPreviousYearData (): void {
      this.getNumbers().catch(() => {
        setTimeout(this.getPreviousYearData, 10000)
      })
    }
  },
  watch: {
    sequencedSampleNumbers (): void {
      this.resetData()
      for (let index = 0; index < this.sequencedSampleNumbers.labels.length; index++) {
        this.fillData(this.sequencedSampleNumbers.labels[index].split('-'), this.sequencedSampleNumbers.counts[index])
      }
    }
  },
  mounted (): void {
    this.getNumbers()
    setInterval(this.getNumbers, 3600000)
  }
})
</script>

<style lang="scss" scoped>
.TotalCounts {
  position: absolute;
  z-index: 2;
}
</style>
