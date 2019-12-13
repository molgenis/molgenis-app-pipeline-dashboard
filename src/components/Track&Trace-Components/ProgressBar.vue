<template>
  <b-progress
  class="progress-middle"
  :variant="variant"
  :max="totalSteps"
  show-progress
  :animated="animated"
  height="1vw">
    <b-progress-bar :value="step">
      <strong>{{ step }} / {{ totalSteps }}</strong>
    </b-progress-bar>
  </b-progress>
</template>

<script>

export default {
  name: 'progress-bar',
  props: {
    step: {
      type: Number,
      required: true
    },

    totalSteps: {
      type: Number,
      required: true
    },

    noWarning: {
      type: Boolean,
      required: false,
      default: false
    },

    variant: {
      type: String,
      required: false,
      default: 'primary'
    },

    animated: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  methods: {
    /**
         * If progress is finished emits 'progress-finish'
         *
         * @emits 'progress-finish'
         * @returns {void}
         */
    checkProgress () {
      if (this.step === this.totalSteps) {
        this.$emit('progress-finish')
      }
    }
  },
  watch: {
    /**
         * If step changes check te progress
         *
         * @returns {void}
         */
    step () {
      this.checkProgress()
    }
  },
  mounted () {
    this.checkProgress()
  }

}

</script>

<style scoped>
.progress-middle {
    margin-top: auto;
    margin-bottom: auto;
    
}

strong {
  font-size: 1vw;
}

</style>
