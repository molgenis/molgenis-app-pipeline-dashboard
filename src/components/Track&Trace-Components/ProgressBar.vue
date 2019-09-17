<template>
    <b-progress :variant="variant" :max="totalSteps" show-progress animated>
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
        step: Number,
        totalSteps: Number,
        noWarning: Boolean,
        error: Boolean
    },
    computed: {
        finished: function () {
            if (this.step/this.totalSteps === 1) {
                this.$emit('finished')
                return true
            } else {
                return false
            }
        },
        variant: function () {
            if (!this.noWarning) {
                return 'warning'
            } else if (this.finished) {
                return 'success'
            } else if (this.error){
                return 'danger'
            } 
            return 'primary'
        }
    },
    methods: {
    }
})
</script>

<style>

</style>