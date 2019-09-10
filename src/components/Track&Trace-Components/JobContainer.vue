<template>
  <tr id="job">
    <td>{{job.run_id}}</td>
    <td>{{job.steps}}</td>
    <td>{{job.project}}</td>
    <td>{{job.step}}</td>
    <td>{{job.status}}</td>
    <td>{{job.runtime}}</td>
    <td>{{job.eta}}</td>
  </tr>
</template>

<script>
export default {
  name: 'job',
  props: {
    job: Object
  }
}
</script>

<style scoped>
</style>
