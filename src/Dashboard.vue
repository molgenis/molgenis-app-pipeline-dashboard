<template>
  <b-row id="dashboard" no-gutters>
    <b-col align-v="center">
      <track-and-trace :headers="headers" :url="rootUrl"/>
    </b-col>
  </b-row>
</template>

<script>
import TrackAndTrace from './components/TrackAndTrace.vue'

export default {
  name: 'app',
  components: {
    TrackAndTrace
  },
  data () {
    return {
      time: new Date(),
      headers: new Headers({'x-molgenis-token' : 'admin-test-token'}),
      rootUrl: 'http://localhost:8081/api/v2/'
      }
      
    }
}

</script>

<style lang="scss" scoped>

.outlined {
  border: 2px solid black;
}
</style>


