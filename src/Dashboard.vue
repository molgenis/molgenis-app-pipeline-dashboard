<template>
<b-container id="dashboard" fluid>
  <b-row  no-gutters class="h-50">
    <b-col class="h-100">
      <track-and-trace :headers="headers" :url="rootUrl" @add-statistic="addStatistics" @token-expired="setToken" :runtime-threshold="threshold" class="h-100 mt-1"/>
    </b-col>
  </b-row>
  <b-row no-gutters class="h-50">
    <b-col><run-time-statistics :run-times="runtimes" @new-threshold="setThreshold"/></b-col>
  </b-row>
</b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import TrackAndTrace from './components/TrackAndTrace.vue'
import RunTimeStatistics from '@/components/RunTimeStatistics.vue'

interface responseJSON {
  token: string
  username: string
}

interface Run {
  runId: string
  runtime: number
}
export default Vue.extend({
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
      runtimes: [
        { runId: 'test1', runtime: 8.2 },
        { runId: 'test2', runtime: 8.4 },
        { runId: 'test3', runtime: 26 },
        { runId: 'test4', runtime: 6.6 },
        { runId: 'test5', runtime: 12.3 },
        { runId: 'test6', runtime: 8.1 },
        { runId: 'test7', runtime: 30 },
        { runId: 'test8', runtime: 9.3 },
        { runId: 'test9', runtime: 7.7 },
        { runId: 'test10', runtime: 5.5 }
      ],
      threshold: 20
    }
  },
  computed: {
    headers (): Headers {
      const token: string = this.token
      const header = new Headers({ 'x-molgenis-token': token })

      return header
    }
  },
  methods: {
    /**
     * Gets the new login token
     */
    async getToken (username: string, password: string): Promise<string> {
      const response = await fetch('http://localhost:8081/api/v1/login')

      let json: responseJSON = await response.json()

      const token: string = json.token
      return token
    },

    /**
     * Sets the access token
     */
    async setToken () {
      this.token = await this.getToken(this.username, this.password)
    },
    /**
     * Adds new runtime statistics to graph
     * @param run String runId
     * @param start Number start time in ms
     * @param finish Number finish time in ms
     */
    addStatistics (run: string, start: number, finish: number) {
      let timeArray: Array<Run> = this.runtimes
      if (timeArray.length >= 10) {
        timeArray.shift()
      }
      const hours = Math.round((((finish - start) / 1000) / 3600) * 10) / 10
      let currentRun: Run = { runId: run, runtime: hours }
      timeArray.push(currentRun)

      this.runtimes = timeArray
    },

    setThreshold (threshold: number) {
      this.threshold = threshold
    }
  }
})

</script>

<style lang="scss" scoped>
#dashboard {
  height: 100vh;
}
.h-40 {
height: 45%;
}
</style>
