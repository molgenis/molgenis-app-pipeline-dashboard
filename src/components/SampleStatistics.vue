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
                  <b-dropdown-item-button :active="selected === 'weekly'" @click="selected = 'weekly';">7 days</b-dropdown-item-button>
                  <b-dropdown-item-button :active="selected === 'monthly'" @click="selected = 'monthly';">30 days</b-dropdown-item-button>
                  <b-dropdown-item-button :active="selected === 'yearly'" @click="selected = 'yearly';">12 months</b-dropdown-item-button>
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

<script lang="ts">
import Vue from 'vue'
import SequencerUsageSpreadGraph from '@/components/SampleStatisticsComponents/SequencerUsageSpreadGraph.vue'
import SampleCountsGraph from '@/components/SampleStatisticsComponents/SampleCountsGraph.vue'

declare module 'vue/types/vue' {
  interface Vue {
    selected: string;
    selectable: string[];
    paused: boolean;
    cycle(): void;
    returnType(select: string): string;
  }
}

export default Vue.extend({
  name: 'sample-statistics',
  components: {
    SequencerUsageSpreadGraph,
    SampleCountsGraph
  },
  data () {
    return {
      selected: 'sequencer',
      selectAble: ['sequencer', 'weekly', 'monthly', 'yearly']
    }
  },
  props: {
    paused: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    /**
     * Cycles visible Graph by 1 index
     *
     * @returns {void}
     */
    cycle (): void {
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
    returnType (select: string): string {
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
  mounted (): void {
    setInterval(this.cycle, 15000)
  }
})
</script>

<style lang="scss" scoped>
.height-80 {
  height: 80%;
}

</style>
