<template>
  <b-tr
    name="slide"
    :id="'runId-' + run" class=""
    :variant="variant"
    @click="selectRun(run)"
    @mouseover="setMouseOn(run)"
    borderless>
      <b-td v-show="mouseOn === run">
        <b-form-checkbox
          v-model="LocalHidden"
          :value="run"
          :id="run"
          switch>
        </b-form-checkbox>
      </b-td>
      <b-td :colspan="mouseOn !== run ? 2 : 6" class="text-truncate">{{run}}</b-td>
      <b-td colspan="5" v-show="mouseOn !== run" class="text-center">
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
    selectRun(run) {
      this.$emit('select-run', run)
    },
    emitFinish(run) {
      this.$emit('progress-finish', run)
    },
    arrayDiffrence (array1, array2) {
      return array1.filter((item) => { return array2.indexOf(item) < 0 })
    },
    setMouseOn(run) {
      this.$emit('mouse-on', run)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>