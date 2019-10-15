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
        <transition
        v-for="run in totalRuns"
        :key="run.run" name="slide">
          <b-tr :id="'runId-' + run.run" class=""
          @click="selectRun(run.run)"
          @mouseover="mouseOn = run.run"
          v-show="!hidden.includes(run.run)"
          :variant="selectedRun === run.run ? 'primary' : 'light'">
            <b-td v-show="mouseOn === run.run">
              <b-form-checkbox
                v-model="hidden"
                :value="run.run"
                :id="run.run"
                switch>
              </b-form-checkbox>
            </b-td>
            <b-td :colspan="mouseOn !== run.run ? 2 : 6" class="text-truncate">{{run.run}}</b-td>
            <b-td colspan="5" v-show="mouseOn !== run.run" class="text-center">
              <progress-bar
              @progress-finish="emitFinish(run.run)"
              :totalSteps="5"
              :variant="run.containsError ? 'danger' : run.step === 4 ? 'success' : 'primary'"
              :animated="run.step !== 4 && !run.containsError"
              class="mt-1" :step="run.step + 1">
              </progress-bar>
            </b-td>
          </b-tr>
        </transition>
        <b-tr v-show="hidden.length > 0">
          <b-td
          @click="hidden = []"
          class="text-center"
          colspan="7">
            <font-awesome-icon icon="angle-down">
            </font-awesome-icon>
          </b-td>
        </b-tr>
        <b-tr v-show="hidden === 'shown'">
          <b-td v-for="hiddenRun in hidden" :key="hiddenRun.value">

          </b-td>
        </b-tr>
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
      hidden: [],
      mouseOn: ''
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
    showCheckbox (): void {
      this.checkbox = true
    },
    hideCheckbox (): void {
      this.checkbox = false
    }
  },
  watch: {
    selectedRun: function (oldRun, newRun) {
      if (this.hidden.includes(this.selectedRun)){
        this.$emit('cycle-next')
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
</style>
