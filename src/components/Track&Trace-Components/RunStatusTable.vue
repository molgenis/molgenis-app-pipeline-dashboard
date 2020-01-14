<template>
  <b-container :style="{ cursor: mouseOn !== '' ? 'pointer' : 'default'}" fluid @mouseleave="mouseOn = ''" class="d-flex flex-column p-0 h-100 w-100">
    <div class="d-flex justify-content-around mt-1 mb-1">
              <b-button
                v-b-tooltip.hover
                :title="`${cyclePaused ? 'Unpauses' : 'Pauses'} cycling`"
                @click="emitPause" squared size="sm" :variant="cyclePaused ? 'outline-secondary': 'outline-info'"
                class="button">
                {{cyclePaused ? 'Interactive' : 'Auto'}}</b-button>
                <b-button
                squared
                size="sm"
                v-b-tooltip.hover
                :title="`${editMode ? 'Deactivates' : 'Activates'} edit`"
                :variant="editMode ? 'info':'outline-info'"
                @click="toggleEditMode"
                class="button"
                >
                  Hide/Unhide
                </b-button>
                <b-button
                v-b-tooltip.hover
                title="Show help"
                squared
                size="sm"
                variant="outline-info"
                @click="$bvModal.show('help-modal')"
                class="button">
                Help
                </b-button>

              </div>
    <b-table-simple fixed sticky-header small hover class="minH flex-grow-1">
      <b-thead>
        <b-tr>
          <b-th class="text-center" colspan="2">
              Run
          </b-th>
          <b-th :colspan="5" class="text-center">Step</b-th>
          <b-th v-if="editMode" class="text-center">Status</b-th>

        </b-tr>
      </b-thead>
      <b-tbody class="overflow-vertical">
          <run-status-table-row
            v-for="run in visibleRuns"
            :selected="selectedRunID === run.run"
            :key="run.run"
            :run="run.run"
            :mouseOn="editMode"
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
          :variant="editMode ? 'light' :  'secondary'"
          :run="run.run"
          :mouseOn="editMode"
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
          v-show="!editMode && !hiddenRuns.length <= 0"
          @click="toggleHidden"
          @mouseover="mouseOn = 'hiddenButton'"
          class="text-center"
          colspan="7">
            <font-awesome-icon :icon="hiddenToggled ? 'angle-up' : 'angle-down'">
            </font-awesome-icon>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>

    <b-modal
      id="help-modal"
      ref="modal"
      title="Track and Trace visual information"
      size="lg"
      hide-footer
      >
      <help-modal-content></help-modal-content></b-modal>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import RunStatusTableRow from '@/components/Track&Trace-Components/RunStatusTableRow.vue'
import helpModalContent from '@/components/Track&Trace-Components/HelpModalContent.vue'
import { RunStatusData } from '@/types/dataTypes'
import { getFilteredArray } from '@/helpers/utils'
import { RunData } from '@/types/Run'

declare module 'vue/types/vue' {
  interface Vue {
    checkbox: boolean;
    mouseLocation: string;
    hiddenToggled: boolean;
    show: number;
    hidden: string[];
    visibleRuns: RunStatusData[];
    hiddenRuns: RunStatusData[];
    hiddenRunsByLength: RunStatusData[];
    editMode: boolean;
    totalRuns: RunStatusData[];
    selectedRun: RunData;
    selectedRunID: string;
    cyclePaused: boolean;
    statusVariant: string;
    mouseOn: string;
    localHidden: string[];
    showHiddenRuns: RunStatusData[];
    hiddenObjects: RunStatusData[];
    toggleHidden(): void;
    toggleEditMode(): void;
    emitPaused(): void;
    emitFinish(run: string): void;
    updateHidden(hidden: string[]): void;
  }
}

export default Vue.extend({
  name: 'run-status-table',
  components: {
    RunStatusTableRow,
    helpModalContent
  },
  data () {
    return {
      checkbox: false,
      mouseLocation: '',
      hiddenToggled: false,
      show: 7,
      hidden: [] as string[],
      visibleRuns: [] as RunStatusData[],
      hiddenRuns: [] as RunStatusData[],
      hiddenRunsByLength: [] as RunStatusData[],
      editMode: false
    }
  },
  props: {
    totalRuns: {
      type: Array,
      required: true
    },

    selectedRun: {
      type: Object,
      required: false,
      default: (): RunData => { return {} as RunData }
    },
    selectedRunID: {
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
    /**
     * toggles the hidden runs
     */
    toggleHidden (): void {
      this.hiddenToggled = !this.hiddenToggled
    },
    /**
     * toggles the edit mode. when true user can hide / unhide runs within the table
     */
    toggleEditMode (): void {
      this.editMode = !this.editMode
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
    /**
     * sorts the totalRuns prop in the following order:
     *  Error > (running in order, how many steps are complete, many steps to less steps) > Finished
     */
    sortedRunEntries(): RunStatusData[] {
      const runs = this.totalRuns
      runs.sort((a: RunStatusData, b: RunStatusData) => { return a.step === 4 ? 1 : b.step === 4 ? -1 : a.containsError ? -1 : b.containsError ? 1 : (b.step + 1) - (a.step + 1) }).sort((a: RunStatusData, b: RunStatusData) => { return a.step === 4 ? 1 : b.step === 4 ? -1 : a.containsError ? -1 : b.containsError ? 1 : (b.step + 1) - (a.step + 1) })
      return runs
    },
    mouseOn: {
      /**
       * returns the mouse location
       */
      get: function (): string {
        return this.mouseLocation
      },
      /**
       * stets the mouse location
       */
      set: function (run: string): void {
        this.mouseLocation = run
      }
    },

    /**
     * When hidden is toggled true return hidden array for display
     *
     * @returns {RunStatusData[]}
     */
    showHiddenRuns (): RunStatusData[] {
      if (this.hiddenToggled || this.editMode) {
        return this.hiddenRuns
      }
      return []
    },

    /**
     * contains the runs that were hidden
     */
    hiddenObjects (): RunStatusData[] {
      const totalRuns = this.sortedRunEntries as RunStatusData[]
      return totalRuns.filter((run) => { return this.hidden.includes(run.run) })
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
    selectedRun: function (): void {
      if (Array.from(this.hiddenRuns, (x: RunStatusData) => {return x.run}).includes(this.selectedRun.run_id)) {
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
      handler (): void {
        const totalRuns = this.sortedRunEntries as RunStatusData[]
        const notHidden = getFilteredArray(totalRuns, this.hiddenObjects) as RunStatusData[]
        this.visibleRuns = notHidden
        this.hiddenRuns = getFilteredArray(this.totalRuns, this.visibleRuns) as RunStatusData[]
      }
    },
    /**
     * when total runs changes, and hidden has a lenght of 0, reset hidden
     */
    totalRuns: function (): void {
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
  max-height: 100%;
  font-size: 1vw;
}

.overflow-vertical {
  overflow-y: scroll
}
.button {
  font-size: 1vw;
}
</style>
