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
                  <b-dropdown-item-button :active="selected === 'weekly'" @click="selected = 'weekly'; paused = true">Week</b-dropdown-item-button>
                  <b-dropdown-item-button :active="selected === 'monthly'" @click="selected = 'monthly'; paused = true">Month</b-dropdown-item-button>
                  <b-dropdown-item-button :active="selected === 'yearly'" @click="selected = 'yearly'; paused = true">Year</b-dropdown-item-button>
                </b-nav-item-dropdown>
            </b-nav>
          </b-col>
        </b-row>
        <b-row class="h-75">
          <b-col class="h-100">
            <sequencer-usage-spread-graph v-if="selected === 'sequencer'" :API="API" :headers="headers"></sequencer-usage-spread-graph>
            <sample-counts-graph v-else-if="selected === 'weekly'" :API="API" :headers="headers" :type="'WEEK'"></sample-counts-graph>
            <sample-counts-graph v-else-if="selected === 'monthly'" :API="API" :headers="headers" :type="'MONTH'"></sample-counts-graph>
            <sample-counts-graph v-else-if="selected === 'yearly'" :API="API" :headers="headers" :type="'YEAR'"></sample-counts-graph>
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
      selected: 'sequencer',
      selectAble: ['sequencer', 'weekly', 'monthly', 'yearly'],
      paused: false
    }
  },
  methods: {
    cycle() {
      const index = this.selectAble.indexOf(this.selected)
      const lenght = this.selectAble.lenght
      if (!this.paused){
        if ((index + 1) >= lenght) {
          this.selected = this.selectAble[0]
        } else {
          this.selected = this.selectAble[index + 1]
        }
      }
    }
  },
  mounted () {
    setInterval(this.cycle, 15000)
  }
}
</script>

<style lang="scss" scoped>

</style>