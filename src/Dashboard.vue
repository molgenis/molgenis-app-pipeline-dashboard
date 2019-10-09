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
import TrackAndTrace from '@/components/TrackAndTrace.vue'
import RunTimeStatistics from '@/components/RunTimeStatistics.vue'
import {RunTime, responseJSON, RunTimeStatistics} from '@/types'

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
        null,null,null,null,null,null,null,null, null, null
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
    addStatistics (run: RunTimeStatistics) {
      let timeArray: RunTimeStatistics[] = this.runtimes
      if (timeArray.length >= 10) {
        timeArray.shift()
      }
      let currentRun = run
      timeArray.push(run)

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
