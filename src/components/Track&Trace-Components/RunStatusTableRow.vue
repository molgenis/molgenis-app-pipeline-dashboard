<template>
  <b-tr
    name="slide"
    :id="'runId-' + run"
    :variant="variant"
    @click="selectRun(run)"
    @mouseover="setMouseOn(run)"
    borderless>
      <b-td v-show="mouseOn" class="align-middle">
        <b-form-checkbox
          v-model="isChecked"
          :value="run"
          :id="run"
          >
        </b-form-checkbox>
      </b-td>
      <b-td :colspan="mouseOn ? 6 : variant === 'primary' ? 6 : 2" class="text-truncate align-middle runID">{{run}}</b-td>
      <b-td :colsoan="1" class="align-middle" v-if="mouseOn || variant === 'primary'">
        <div class="d-flex align-items-end justify-content-center h-100">
          <font-awesome-icon class="icons" :icon="isInQueue ? ['fas', 'hourglass-start'] : finished ? ['fas', 'check-circle'] : error ? ['fas', 'exclamation-circle']:['fas', 'sync-alt']" :class="isInQueue ? 'secondary-dark' : finished ? 'success' : error ? 'danger': 'primary'" size="lg" :spin="!finished && !error && !isInQueue"></font-awesome-icon>
          </div>
          </b-td>
      <b-td colspan="5" v-show="!mouseOn && variant != 'primary'"  class="text-center align-middle">
        <progress-bar
        @progress-finish="emitFinish(run)"
        :totalSteps="5"
        :variant="error ? 'danger' : step === 4 ? 'success' : 'primary'"
        :animated="step !== 4 && !error"
        class="mt-1" :step="step + 1">
        </progress-bar>
      </b-td>
</b-tr>
</template>

<script lang="ts">
import Vue from 'vue'
import ProgressBar from '@/components/Track&Trace-Components/ProgressBar.vue'

declare module 'vue/types/vue' {
  interface Vue {
    run: string;
    mouseOn: string;
    step: number;
    error: boolean;
    hidden: string[];
    variant: string;
    finished: boolean;
    LocalHidden: string[];
    isChecked: boolean;
  }
}
export default Vue.extend({
  name: 'run-status-table-row',

  components: {
    ProgressBar
  },

  props: {
    run: {
      type: String,
      required: true
    },

    mouseOn: {
      type: Boolean,
      required: false,
      default: false
    },

    step: {
      type: Number,
      required: true
    },

    error: {
      type: Boolean,
      required: false,
      return: false
    },

    hidden: {
      type: Array,
      required: false,
      default: (): string[] => {return [] as string[]}
    },

    variant: {
      type: String,
      required: false,
      default: 'light'
    }
  },
  data () {
    return {
      finished: false,
    }
  },
  methods: {
    /**
     * Changes the selected run
     * @param {String} run - run Id to select
     *
     * @emits 'select-run'
     * @returns {void}
     */
    selectRun (run: string): void {
      this.$emit('select-run', run)
    },

    /**
     * Noitifys run as finished
     * @param {String} run - run to pass on with status finished
     *
     * @emits 'progress-finish'
     * @returns {void}
     */
    emitFinish (run: string): void {
      this.finished = true
      this.$emit('progress-finish', run)
    },


    /**
     * Change run where mouse is on
     * @param {String} run - the new run
     *
     * @emits 'mouse-on'
     * @returns {void}
     */
    setMouseOn (run: string): void {
      this.$emit('mouse-on', run)
    }
  },
  computed: {
    LocalHidden: {
      get: function (): string[] {
        return this.hidden
      },
      set: function(value: string): void{
        this.$emit('update-hidden', value)
      }
    },

    isChecked: {
      get: function(): boolean | string {
        return this.LocalHidden.includes(this.run) ? false : this.run
      },
      set: function (value: string): void {
        if (value) {
          this.LocalHidden = this.LocalHidden.filter((x: string) => x !== value)
        } else {
          this.LocalHidden = [this.run, ...this.LocalHidden]
        }
      }
    },
    isInQueue () {
      return this.step === -1
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'bootstrap/scss/bootstrap';
@import 'bootstrap-vue/src/index.scss';

.icons {
  height: 1vw;
  width: 1vw;
}

.runID {
  font-size: 1vw;
}

.success {
    color: $success;
}
.primary {
    color: $primary
}
.secondary {
    color: $gray-300
}
.secondary-dark {
  color: $secondary
}
.warning {
    color: $warning
}
.danger {
    color: $danger
}
</style>
