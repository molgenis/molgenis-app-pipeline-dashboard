<template>
<b-container id="dashboard" fluid>
  <b-row  no-gutters class="h-50">
    <b-col class="h-100">
      <track-and-trace :headers="headers" :url="rootUrl" @add-statistic="addStatistics" @token-expired="setToken" class="h-100 mt-1"/>
    </b-col>
  </b-row>
  <b-row no-gutters class="h-50">
    <b-col><run-time-statistics :run-times="runtimes"/></b-col>
  </b-row>
</b-container>
</template>

<script>
import TrackAndTrace from './components/TrackAndTrace.vue'
import RunTimeStatistics from '@/components/RunTimeStatistics'


export default {
  name: 'app',
  components: {
    TrackAndTrace,
    RunTimeStatistics
  },
  data () {
    return {
      username: 'admin',
      password: 'admin',
      token: 'admin-test-token',
      rootUrl: 'http://localhost:8081/api/v2/',
      runtimes: [8.2,8.4,8.1,7.8,6.9, 8.9, 7.6, 7.4, 8.0, 8.1]
    }
  },
  computed: {
    headers: function () {
      return new Headers({'x-molgenis-token': this.token})
    }
  },
  methods: {
    async getToken (username, password) {
      const response = await fetch('http://localhost:8081/api/v1/login', {"username": username, "password": password})
      return await response.json().token
    },
    async setToken() {
      this.token = await this.getToken(this.username, this.password)
    },
    addStatistics(run, start, finish) {
      let timeArray = this.runtimes
      if (timeArray.length >= 10) {
        timeArray.shift()
      }

      const hours = Math.round((((finish - start)/1000)/3600) * 10) / 10
      timeArray.push(hours)

      this.runtimes = timeArray
    }
  },
  mounted() {
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
