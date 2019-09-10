<template>
  <div id="track-and-trace">
    <b-table hover :items="jobs" :fields="fields">
      <template v-slot:cell(progress)="percentage">
        <b-progress :variant="percentage.value.total != percentage.value.current ? 'primary' : 'success'" :max="percentage.value.total" show-progress animated>
          <b-progress-bar :value="percentage.value.current">
            <strong>{{ percentage.value.current }} / {{ percentage.value.total }}</strong>
          </b-progress-bar>
        </b-progress>
      </template>
    </b-table>
  </div>
</template>

<script>

export default {
  name: 'track-and-trace',
  props: {
    jobs: Array,
    fields: Array
  }
}
</script>

<style scoped>
</style>
