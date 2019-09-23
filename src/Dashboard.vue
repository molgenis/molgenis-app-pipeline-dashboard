<template>
<b-container fluid>
  <b-row id="dashboard" no-gutters>
    <b-col cols="4" class="">
      <b-row class="h-50" no-gutters>
        <b-col class="border border-primary mb-2 mr-3 ml-3 mt-3 rounded d-flex align-items-center justify-content-center">
          <h3>Pipeline Statistics</h3>
        </b-col>
      </b-row>
      <b-row class="h-50" no-gutters>
        <b-col class="border border-primary mt-2 mr-3 mb-3 ml-3 rounded d-flex align-items-center justify-content-center">
          <h3>Sample statistics</h3>
        </b-col>
      </b-row>
    </b-col>
    <b-col class="border border-primary rounded m-3">
      <track-and-trace :headers="headers" :url="rootUrl"/>
    </b-col>
  </b-row>
  <b-row no-gutters>
    <b-col class="border border-primary m-3 rounded height300 d-flex align-items-center justify-content-center">
      <h3 class="align-middle" >System Usage Information</h3>
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
      time: new Date(),
      headers: new Headers({'x-molgenis-token' : 'admin-test-token'}),
      rootUrl: 'http://localhost:8081/api/v2/'
      }
      
    }
}

</script>

<style lang="scss" scoped>
.remainder-height {
  height: 400px;
}
.height300 {
  height: 300px;
}
</style>


