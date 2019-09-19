<template>
    <b-progress :variant="variant" :max="totalSteps" show-progress animated>
          <b-progress-bar :value="step">
            <strong>{{ step }} / {{ totalSteps }}</strong>
          </b-progress-bar>
        </b-progress>
</template>

<script>
export default {
    name: 'progress-bar',
    props: {
        step: Number,
        totalSteps: Number,
        noWarning: Boolean,
        error: Boolean,
        variant: String
    },
    computed: {
        /**
         * checks if all steps are complete and emits finished
         * @returns Boolean
         */
        finished: function () {
            if (this.step/this.totalSteps === 1) {
                this.$emit('finished')
                return true
            } else {
                return false
            }
        }
    },
    methods: {
    }
}

</script>

<style>

</style>