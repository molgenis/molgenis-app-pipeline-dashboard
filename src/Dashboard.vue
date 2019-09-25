<template>
<b-container id="dashboard" fluid>
  <b-row  no-gutters class="h-50">
    <b-col class="h-100">
      <track-and-trace :headers="headers" :url="rootUrl" class="h-100"/>
    </b-col>
  </b-row>
  <b-row no-gutters class="h-40 d-none">
    <b-col class="border border-primary m-3 rounded d-flex h-100 align-items-center justify-content-center">
      <h3 class="align-middle" >Statistics placeholder</h3>
    </b-col>
    <b-col class="border border-primary m-3 rounded d-flex h-100 align-items-center justify-content-center">
      <h3 class="align-middle" >Statistics placeholder</h3>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import TrackAndTrace from './components/TrackAndTrace.vue'
import StatusIcon from './components/Track&Trace-Components/StatusIcon.vue'
import ProgressBar from './components/Track&Trace-Components/ProgressBar'
import RunStepTable from './components/Track&Trace-Components/RunStepTable'

export default {
  name: 'app',
  components: {
    TrackAndTrace,
    RunStepTable
  },
  data () {
    return {
      time: new Date(),
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
