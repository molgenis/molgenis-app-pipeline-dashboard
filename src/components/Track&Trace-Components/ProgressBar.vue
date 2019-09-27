<template>
    <b-progress class="progress-middle" :variant="variant" :max="totalSteps" show-progress :animated="animated">
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
        variant: String,
        animated: Boolean
    }
}

</script>

<style scoped>
.progress-middle {
    margin-top: auto;
    margin-bottom: auto;
}
</style>
