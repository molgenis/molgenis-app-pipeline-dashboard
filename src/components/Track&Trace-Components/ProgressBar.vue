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

<script lang="ts">
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    step: number;
    totalSteps: number;
    noWarning: boolean;
    varaint: string;
    animated: boolean;
    checkProgress(): void;
  }
}

export default Vue.extend({
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
    /**
     * Bootstrap variant string
     * primary, secondary, warning, danger, light, info
     */
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
    checkProgress (): void {
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
    step (): void {
      this.checkProgress()
    }
  },
  mounted (): void {
    this.checkProgress()
  }

})

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
