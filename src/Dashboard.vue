<template>
<b-container id="dashboard" fluid>
  <b-row  no-gutters class="h-50">
    <b-col class="h-100">
      <track-and-trace :headers="headers" :url="rootUrl" class="h-100 mt-1"/>
    </b-col>
  </b-row>
</b-container>
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
      headers: new Headers({
        'x-molgenis-token': 'admin-test-token'
      }),
      rootUrl: 'http://localhost:8081/api/v2/'
    }
  }
}

</script>

<style lang="scss" scoped>
#dashboard {
  height: 100vh;
}
.h-40 {
height: 45%;
}
</style>
