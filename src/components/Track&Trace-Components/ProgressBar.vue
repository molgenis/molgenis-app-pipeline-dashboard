<template>
  <b-progress 
  class="progress-middle" 
  :variant="variant" 
  :max="totalSteps" 
  show-progress 
  :animated="animated">
    <b-progress-bar :value="step">
      <strong>{{ step }} / {{ totalSteps }}</strong>
    </b-progress-bar>
  </b-progress>
</template>

<script lang="ts">
import Vue from 'vue'

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
        checkProgress (): void {
            if (this.step === this.totalSteps){
                this.$emit('progress-finish')
            }
        }
    },
    watch: {
        step(): void {
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

</style>
