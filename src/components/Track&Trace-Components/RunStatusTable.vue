<template>
  <b-container fluid class="overflow-auto">
    <b-table-simple small fixed hover>
      <b-thead class="">
        <b-tr class="">
          <b-td class="text-center" colspan="2">
            <span>
              <font-awesome-icon 
              v-if="cyclePaused" 
              @click="emitPause()" 
              icon="play-circle"/>

              <font-awesome-icon 
              v-else 
              @click="emitPause()" 
              icon="pause-circle"/>
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
        <b-tr class="" 
        v-for="run in totalRuns" 
        :key="run.run" 
        @click="selectRun(run.run)"
        @mouseenter="showCheckbox()"
        @mouseleave="hideCheckbox()"
        v-show="!hidden.includes(run.run)"
        :variant="selectedRun === run.run ? 'primary' : 'light'">
          <b-td v-show="checkbox">
            <b-form-checkbox
              v-model="hidden"
              :value="run.run"
              :id="run.run"
              switch>
            </b-form-checkbox>
          </b-td>
          <b-td colspan="2" class="text-truncate">{{run.run}}</b-td>
          <b-td colspan="5" class="text-center"><progress-bar @progress-finish="emitFinish(run.run)" class="mt-1" :step="run.step + 1" :totalSteps="5" :variant="run.containsError ? 'danger' : run.step === 4 ? 'success' : 'primary'" :animated="run.step !== 4 && !run.containsError"/></b-td>
        </b-tr>
        <b-tr> <b-td @click="hidden.lenght = 0" class="text-center" colspan="7">more...</b-td></b-tr>
      </b-tbody>
    </b-table-simple>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import ProgressBar from '@/components/Track&Trace-Components/ProgressBar.vue'

export default Vue.extend({
  name: 'run-status-table',
  components: {
    ProgressBar

  },
  data () {
    return {
      checkbox: false,
      hidden: []
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
    showCheckbox(): void {
      this.checkbox = true
    },
    hideCheckbox(): void {
      this.checkbox = false
    }
  }
})
</script>
