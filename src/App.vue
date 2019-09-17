<template>
  <div id="app">
    <track-and-trace :headers="headers" :url="rootUrl"/>
  </div>
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

<style>

</style>
