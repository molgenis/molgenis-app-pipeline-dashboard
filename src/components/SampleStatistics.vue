<template>
<b-container class="p-2 h-100" fluid>
  <b-row no-gutters class="h-100">
    <b-col class="h-100">
      <b-container class="p-0 h-100 border border-primary" fluid>
        <b-row>
          <b-col>
            <b-nav tabs align="center">
                <b-nav-item :active="selected === 'sequencer'" @click="selected = 'sequencer'; paused = true">Sequencer Usage</b-nav-item>
                <b-nav-item-dropdown id="my-nav-dropdown"
                text="Sample Counts"
                toggle-class="nav-link-custom"
                class="active"
                right>
                  <b-dropdown-item-button :active="selected === 'weekly'" @click="selected = 'weekly'; paused = true">7 days</b-dropdown-item-button>
                  <b-dropdown-item-button :active="selected === 'monthly'" @click="selected = 'monthly'; paused = true">30 days</b-dropdown-item-button>
                  <b-dropdown-item-button :active="selected === 'yearly'" @click="selected = 'yearly'; paused = true">12 months</b-dropdown-item-button>
                </b-nav-item-dropdown>
            </b-nav>
          </b-col>
        </b-row>
        <b-row v-show="selected === 'sequencer'" class="h-75" no-gutters>
          <b-col class="h-100 w-100" cols="12">
              <sequencer-usage-spread-graph></sequencer-usage-spread-graph>
          </b-col>
        </b-row>
        <b-row v-show="selected !== 'sequencer'" class="h-75" no-gutters>
          <b-col class="h-100">
            <sample-counts-graph id="sample-counts" :type="returnType(selected)"></sample-counts-graph>
          </b-col>
        </b-row>
      </b-container>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import SequencerUsageSpreadGraph from '@/components/SampleStatisticsComponents/SequencerUsageSpreadGraph.vue'
import SampleCountsDisplay from '@/components/SampleStatisticsComponents/SampleCountsDisplay.vue'
import SampleCountsGraph from '@/components/SampleStatisticsComponents/SampleCountsGraph.vue'

export default {
  name: 'sample-statistics',
  components: {
    SequencerUsageSpreadGraph,
    SampleCountsDisplay,
    SampleCountsGraph
  },
  data () {
    return {
      selected: 'sequencer',
      selectAble: ['sequencer', 'weekly', 'monthly', 'yearly'],
      paused: false
    }
  },
  methods: {
    /**
     * Cycles visible Graph by 1 index
     *
     * @returns {void}
     */
    cycle () {
      const index = this.selectAble.indexOf(this.selected)
      const length = this.selectAble.length
      if (!this.paused) {
        if ((index + 1) === length || (index + 1) >= length) {
          this.selected = this.selectAble[0]
        } else {
          this.selected = this.selectAble[index + 1]
        }
      }
    },
    /**
     * find the correct return tyle
     * @param {String} select - selected string
     *
     * @returns {String}
     */
    returnType (select) {
      switch (select) {
        case 'weekly':
          return 'WEEK'
        case 'monthly':
          return 'MONTH'
        case 'yearly':
          return 'YEAR'
        default:
          return ''
      }
    }
  },
  mounted () {
    setInterval(this.cycle, 15000)
  }
}
</script>

<style lang="scss" scoped>
.height-80 {
  height: 80%;
}

</style>
