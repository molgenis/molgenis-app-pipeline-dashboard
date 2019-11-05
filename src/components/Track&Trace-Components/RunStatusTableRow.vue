<template>
  <b-tr
    name="slide"
    :id="'runId-' + run"
    :variant="variant"
    @click="selectRun(run)"
    @mouseover="setMouseOn(run)"
    borderless>
      <b-td v-show="mouseOn === run" class="align-middle">
        <b-form-checkbox
          v-model="LocalHidden"
          :value="run"
          :id="run"
          >
        </b-form-checkbox>
      </b-td>
      <b-td :colspan="mouseOn !== run ? 2 : 6" class="text-truncate align-middle">{{run}}</b-td>
      <b-td colspan="5" v-show="mouseOn !== run" class="text-center align-middle">
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

<script>
import ProgressBar from '@/components/Track&Trace-Components/ProgressBar.vue'

export default {
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
      type: String,
      required: false,
      default: ''
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
      required: true
    },
    
    variant: {
      type: String,
      required: false,
      default: 'light'
    }
  },
  computed: {
    LocalHidden: {
      get: function() {
        return this.hidden
      },
      set: function(value){
        this.$emit('update-hidden', value)
      }
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
    selectRun(run) {
      this.$emit('select-run', run)
    },
    /**
     * Noitifys run as finished
     * @param {String} run - run to pass on with status finished
     * 
     * @emits 'progress-finish'
     * @returns {void}
     */
    emitFinish(run) {
      this.$emit('progress-finish', run)
    },
    /**
     * Calculates diffrence between two arrays
     * @param {Array} array1 - 1st array
     * @param {Array} array2 - 2nd array
     * 
     * @returns {Array} diffrence
     */
    arrayDiffrence (array1, array2) {
      return array1.filter((item) => { return array2.indexOf(item) < 0 })
    },
    /**
     * Change run where mouse is on
     * @param {String} run - the new run
     * 
     * @emits 'mouse-on'
     * @returns {void}
     */
    setMouseOn(run) {
      this.$emit('mouse-on', run)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>