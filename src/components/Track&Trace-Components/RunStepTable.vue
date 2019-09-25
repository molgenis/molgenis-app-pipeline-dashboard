<template>
  <b-container>
    <b-table-simple small fixed hover>
      <b-thead class="">
        <b-tr class="">
          <b-td class="text-center" colspan="2">
            <span><font-awesome-icon v-if="paused" @click="emitPause()" icon="play-circle"/>
            <font-awesome-icon v-else @click="emitPause()" icon="pause-circle"/></span>
            <span> Run</span>

          </b-td>
          <b-th class="text-right">De- multiplex</b-th>
          <b-th class="text-right">Running Projects</b-th>
          <b-th class="text-right">Copying Results</b-th>
          <b-th class="text-right">Finished</b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <b-tr class="" v-for="run in runs" :key="run.run" @click="selectRun(run.run)" :variant="[selected === run.run ? 'primary' : 'light']">
          <b-td colspan="2" class="text-truncate">{{run.run}}</b-td>
          <b-td colspan="4" class="text-center"><progress-bar class="mt-1" :step="run.step + 1" :totalSteps="4" :variant="[run.containsError ? 'danger' : [run.step === 3 ? 'success' : 'primary']]" :animated="run.step !== 3 && !run.containsError"/></b-td>
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
