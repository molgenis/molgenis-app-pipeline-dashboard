<template>
  <div id="app">
    <track-and-trace :headers="headers" />
  </div>
</template>

<script>
import TrackAndTrace from './components/TrackAndTrace.vue'

console.log(new Date().getTime())

export default {
  name: 'app',
  components: {
    TrackAndTrace
  },
  data () {
    return {
      time: new Date(),
      headers: new Headers({'x-molgenis-token' : 'admin-test-token'})
        }
    }
}

</script>

<style>

</style>
