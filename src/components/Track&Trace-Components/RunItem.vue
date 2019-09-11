<template>
<b-tr>
  <b-th>{{ run.run_id }}</b-th>
  <b-th>{{ run.pipeline }}</b-th>
  <b-th>
    <b-progress :variant="false ? 'primary' : 'success'" :max="100" show-progress animated>
          <b-progress-bar :value="50">
            <strong>50 / 100</strong>
          </b-progress-bar>
        </b-progress>
  </b-th>
  <b-th>Test_step</b-th>
  <b-th>Running</b-th>
  <b-th>03:22:12</b-th>
  <b-th>03:22:12</b-th>
  <!--    
      <template v-slot:cell(progress)="percentage">
        <b-progress :variant="percentage.value.total != percentage.value.current ? 'primary' : 'success'" :max="percentage.value.total" show-progress animated>
          <b-progress-bar :value="percentage.value.current">
            <strong>{{ percentage.value.current }} / {{ percentage.value.total }}</strong>
          </b-progress-bar>
        </b-progress>
      </template>
      -->
</b-tr>
</template>

<script>
export default {
  name: 'run-item',
  props: {
    run: Object
  },
  computed: {

  }
}
</script>

<style scoped>

</style>
