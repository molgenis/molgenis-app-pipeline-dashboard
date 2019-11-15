<template>
  <b-container fluid @mouseleave="mouseOn = ''" class="overflow-auto p-0 h-100 w-100">
    <b-table-simple small fixed hover class="minH">
      <b-thead>
        <b-tr>
          <b-td class="text-center" colspan="2">
            <span>
              <font-awesome-icon
              @click="emitPause"
              v-if="cyclePaused"
              icon="play-circle"
              size="lg"
              ></font-awesome-icon>
              <font-awesome-icon
              @click="emitPause"
              v-else
              icon="pause-circle"
              size="lg"
              ></font-awesome-icon>
            </span>
            <span> Run</span>
          </b-td>
          <b-th class="text-right overflow-hidden">De- multiplex</b-th>
          <b-th class="text-right overflow-hidden">Raw Copy</b-th>
          <b-th class="text-right overflow-hidden">Running Projects</b-th>
          <b-th class="text-right overflow-hidden">Result Copy</b-th>
          <b-th class="text-right overflow-hidden">Finished</b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
          <run-status-table-row
            v-for="run in visibleRuns"
            :variant="selectedRun === run.run ? 'primary' : 'light'"
            :key="run.run"
            :run="run.run"
            :mouseOn="mouseOn"
            :step="run.step"
            :error="run.containsError"
            :hidden="hidden"
            @update-hidden="updateHidden"
            @select-run="selectRun"
            @mouse-on="event => mouseOn = event"
            @progress-finish="emitFinish"
          ></run-status-table-row>
          <run-status-table-row
          v-for="run in showHiddenRuns"
          :key="run.run"
          name="slide"
          :variant="'secondary'"
          :run="run.run"
          :mouseOn="mouseOn"
          :step="run.step"
          :error="run.containsError"
          :hidden="hidden"
          @update-hidden="updateHidden"
          @select-run="selectRun"
          @mouse-on="event => mouseOn = event"
          @click="selectRun(run)"
          @progress-finish="emitFinish"
          ></run-status-table-row>
        <b-tr>
          <b-td
          @click="toggleHidden"
          class="text-center"
          colspan="7">
            <font-awesome-icon :icon="hiddenToggled ? 'angle-up' : 'angle-down'">
            </font-awesome-icon>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import ProgressBar from '@/components/Track&Trace-Components/ProgressBar.vue'
import RunStatusTableRow from '@/components/Track&Trace-Components/RunStatusTableRow.vue'
import { Run, RunStatusData } from '@/types/dataTypes'
import { getFilteredArray } from '@/helpers/utils'

export default Vue.extend({
  name: 'run-status-table',
  components: {
    RunStatusTableRow

  },
  data () {
    return {
      checkbox: false,
      mouse: '',
      hiddenToggled: false,
      show: 7,
      hidden: [] as string[],
      visibleRuns: [] as RunStatusData[],
      hiddenRuns: [] as RunStatusData[],
      hiddenRunsByLength: [] as RunStatusData[]
    }
  },
  props: {
    totalRuns: {
      type: Array,
      required: true
    },

    selectedRun: {
      type: String,
      required: false,
      default: ''
    },

    cyclePaused: {
      type: Boolean,
      required: true
    },

    statusVariant: {
      type: String,
      required: false,
      default: 'primary'
    }
  },
  methods: {
    toggleHidden () {
      this.hiddenToggled = !this.hiddenToggled
    },

    /**
     * emit selected run
     * @param {String} run - Run to select
     * 
     * @emits 'select-run'
     * @returns {void}
     */
    selectRun (run: string): void {
      this.$emit('select-run', run)
    },

    /**
     * emit pause to stop cycling runs
     * 
     * @emits 'toggle-cycle'
     * @returns {void}
     */
    emitPause (): void {
      this.$emit('toggle-cycle')
    },

    /**
    *  emit finish to save run as finished
    * @param {String} run - run id string
    * 
    * @emits 'run-finished'
    * @returns {void}
    */
    emitFinish (run: string): void {
      this.$emit('run-finished', run)
    },

    /**
     * Updates hidden parameter
     * @param {String[]} hidden - hidden values array
     * 
     * @returns {void}
     */
    updateHidden (hidden: string[]): void {
      this.hidden = hidden
    }
  },
  computed: {
    mouseOn: {
      get: function (): string {
        return this.mouse
      },
      set: function (run: string): void {
        this.mouse = run
      }
    },

    localHidden: {
      get: function (): string[] {
        return this.hidden
      },
      set: function (updatedHidden: string[]) {
        this.hidden = updatedHidden
      }

    },

    /**
     * When hidden is toggled true return hidden array for display
     * 
     * @returns {RunStatusData[]}
     */
    showHiddenRuns (): RunStatusData[] {
      if (this.hiddenToggled) {
        return this.hiddenRuns
      }
      return []
    },

    hiddenObjects (): RunStatusData[] {
      const totalRuns = this.totalRuns as RunStatusData[]
      return totalRuns.filter((run) => { return this.hidden.includes(run.run)})
    }
  },
  watch: {
    /**
     * When selected run changes check if it is hidden
     * if it is hidden cycle to the next run
     * 
     * @emits 'cycle-next'
     * @returns {void}
     */
    selectedRun: function () {
      if (this.hidden.includes(this.selectedRun)) {
        this.$emit('cycle-next')
      }
    },
    
    /**
     * when hidden v-model changes makes sure the visible runs does not extend the maximum show value
     * 
     * @returns {void}
     */
    hidden: {
      immediate: true,
      handler () {
        const totalRuns = this.totalRuns as RunStatusData[]
        let notHidden: RunStatusData[] = getFilteredArray(totalRuns, this.hiddenObjects)
                
        if (notHidden.length > this.show) {
          this.visibleRuns  = notHidden.slice(0, this.show)
          this.hiddenRunsByLength = getFilteredArray(notHidden, this.visibleRuns)
        } else {
          this.visibleRuns = notHidden
        }
        
        this.hiddenRuns = getFilteredArray(this.totalRuns, this.visibleRuns)
      }
    },
    
    totalRuns: function () {
      if (this.hidden.length === 0) {
        this.hidden = []
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.slide-enter, .slide-leave-to{
  transform: scaleY(0);
}

.h-5r {
  max-height: 45vh
}

.minH {
  min-height: 100%
}
</style>
