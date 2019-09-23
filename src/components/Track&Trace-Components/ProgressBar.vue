<template>
    <b-progress class="progress-middle" height="75%" :variant="variant" :max="totalSteps" show-progress animated>
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
    },
    methods: {
    }
}

</script>

<style scoped>
.progress-middle {
    margin-top: auto;
    margin-bottom: auto;
}
</style>
