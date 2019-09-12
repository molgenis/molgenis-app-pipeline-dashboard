<template>
  <div id="track-and-trace">
    <b-table-simple hover borderless>
      <colgroup><col><col></colgroup>
      <colgroup><col><col></colgroup>
      <colgroup><col><col></colgroup>
      <b-thead head-variant="light">
        <b-tr>
          <b-th colspan="2">Run Information</b-th>
          <b-th colspan="3">Progress</b-th>
          <b-th colspan="2">Timings</b-th>
        </b-tr>
        <b-tr>
          <b-th>Run ID</b-th>
          <b-th>Pipeline</b-th>
          <b-th>Complete</b-th>
          <b-th>Current Step</b-th>
          <b-th>Status</b-th >
          <b-th>Runtime</b-th>
          <b-th>ETA</b-th>
        </b-tr>
      </b-thead>
      <b-tbody v-for="run in runs" :key="run.run_id">
          <run-item :run="run" ></run-item>
      </b-tbody>
  
    </b-table-simple>
  </div>
</template>

<script>
import runItem from './Track&Trace-Components/RunItem.vue'

export default {
  name: 'track-and-trace',
  components: {
    runItem
  },
  props: {
    headers: Headers
  },
  data () {
    return {
      loading: false,
      jobs: [],
      projects: [],
    }
  },
  computed: {
    runs: function () {
      let runs = []
      this.projects.forEach((project) => {
        let runJobs = this.jobs
        .filter(function (x) {return x.project === project.run_id})
        .sort(function (x) {return x.job})

        let run = {
          run_id: project.run_id,
          pipeline: project.pipeline,
          jobs: runJobs
        }

        runs.push(run)
      
      })

      return runs
    }
  },
  methods: {
    /**
     * Get the available projects in statßus data.
     */
    async getProjects () {
      try {
        this.projects = await this.fetchData('http://localhost:8081/api/v2/status_projects?num=10000')
        
        this.jobs = await this.fetchData('http://localhost:8081/api/v2/status_jobs?num=10000')
      } catch (error) {
        console.error(error)
      }
    },
    async fetchData (ref, items = []) {
      const response = await fetch(ref, {headers: new Headers({'x-molgenis-token':'admin-test-token'})})
      const data = await response.json()
      let totalItems = items.concat(data.items)
      if (data.nextHref) {
        totalItems = await this.fetchData(data.nextHref, totalItems)  
      } else {
        return totalItems}
      },   
  },

  mounted () {
    this.getProjects()
  }
}

</script>

<style scoped>
</style>
