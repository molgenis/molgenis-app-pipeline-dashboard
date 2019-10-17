<template>
  <b-container fluid @mouseleave="mouseOn = ''" class="overflow-auto h-5r">
    <b-table-simple small fixed hover >
      <b-thead class="">
        <b-tr class="">
          <b-td class="text-center" colspan="2">
            <span>
              <font-awesome-icon
              @click="emitPause()"
              v-if="cyclePaused"
              icon="play-circle"
              size="lg"/>

              <font-awesome-icon
              @click="emitPause()"
              v-else
              icon="pause-circle"
              size="lg"/>
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
      <b-tbody class="">
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
            @mouse-on="setMouseOn"
            @progress-finish="emitFinish"
          ></run-status-table-row>
          <run-status-table-row 
          v-for="run in hiddenRuns"
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
          @mouse-on="setMouseOn"
          @click="selectRun(run)"
          @progress-finish="emitFinish"
          ></run-status-table-row>
        <b-tr v-show="hidden.length > 0">
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

declare module 'vue/types/vue' {
  interface Vue {
    hidden: string[]
  }
}

export default Vue.extend({
  name: 'run-status-table',
  components: {
    RunStatusTableRow

  },
  data () {
    return {
      checkbox: false,
      hidden: [],
      mouseOn: '',
      hiddenToggled: false
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
    toggleHidden() {
      this.hiddenToggled = !this.hiddenToggled
    },
    /**
     * emit selected run
     * @param run to be selected
     */
    selectRun (run: string): void {
      this.$emit('select-run', run)
    },
    /**
     * emit pause to stop cycling runs
     */
    emitPause (): void {
      this.$emit('toggle-cycle')
    },

    emitFinish (run: string): void {
      this.$emit('run-finished', run)
    },
    showCheckbox (): void {
      this.checkbox = true
    },
    hideCheckbox (): void {
      this.checkbox = false
    },
    insertRuns() {
      this.visibleRuns.push(...this.totalRuns)
    },
    setMouseOn(run: string) {
      this.mouseOn = run
    },
    updateHidden(hidden: string[]){
      this.hidden = hidden
    }
  },
  computed: {
    visibleRuns() {
      return this.totalRuns.filter((run) => { return !this.hidden.includes(run.run) })
    },
    hiddenRuns () {
      if (this.hiddenToggled){
        return this.totalRuns.filter((run) => { return this.hidden.includes(run.run)})
      }
      return []
    }
  },
  watch: {
    selectedRun: function (oldRun, newRun) {
      if (this.hidden.includes(this.selectedRun)){
        this.$emit('cycle-next')
      }
    },
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
</style>
