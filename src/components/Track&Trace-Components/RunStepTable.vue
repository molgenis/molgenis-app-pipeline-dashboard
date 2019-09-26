<template>
  <b-container fluid class="">
    <b-table-simple small fixed hover>
      <b-thead class="">
        <b-tr class="">
          <b-td class="text-center" colspan="2">
            <span><font-awesome-icon v-if="paused" @click="emitPause()" icon="play-circle"/>
            <font-awesome-icon v-else @click="emitPause()" icon="pause-circle"/></span>
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
        <b-tr class="" v-for="run in runs" :key="run.run" @click="selectRun(run.run)" :variant="selected === run.run ? 'primary' : 'light'">
          <b-td colspan="2" class="text-truncate">{{run.run}}</b-td>
          <b-td colspan="5" class="text-center"><progress-bar class="mt-1" :step="run.step + 1" :totalSteps="5" :variant="run.containsError ? 'danger' : run.step === 4 ? 'success' : 'primary'" :animated="run.step !== 4 && !run.containsError"/></b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </b-container>
</template>

<script>
import ProgressBar from './ProgressBar'
export default {
  name: 'run-step-table',
  components: {
    ProgressBar

  },
  props: {
    runs: Array,
    selected: String,
    paused: Boolean,
    runSteps: Array,
    variant: String
  },
  methods: {
    selectRun (run) {
      this.$emit('select-run', run)
    },
    emitPause () {
      this.$emit('toggle-cycle')
    }
  }
}
</script>
