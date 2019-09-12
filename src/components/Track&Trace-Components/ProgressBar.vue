<template>
    <b-progress :variant="!finished ? 'primary' : 'success'" :max="totalSteps" show-progress animated>
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
        finished: Boolean
    }
})
</script>

<style>

</style>