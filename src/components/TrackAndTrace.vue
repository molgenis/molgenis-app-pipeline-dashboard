<template>
  <div id="track-and-trace">
    <b-table-simple borderless fixed>
      <colgroup><col><col></colgroup>
      <colgroup><col><col></colgroup>
      <colgroup><col><col></colgroup>
      <b-tbody v-for="run in runData" :key="run.run_id">
        <template v-for="(project, index) in run.projects">
          <project-row :key="project.project" :project="project.project" :jobs="project.jobs" :header="index === 0" :runID="run.run_id" :projectCount="run.len" :time="time"></project-row>
        </template>
      </b-tbody>
    </b-table-simple>
  </div>
</template>

<script>
import ProjectRow from './Track&Trace-Components/ProjectRow'

export default {
  name: 'track-and-trace',
  components: {
    ProjectRow
  },
  props: {
    headers: Headers,
    url: String
  },
  data () {
    return {
      loading: false,
      jobs: [],
      runs: [],
      projects: [],
      runUrl: '',
      time: 0,
    }
  },
  computed: {
    /**
     * Combines all data into one object
     * @returns Object
     */
    runData: function () {
      let data = []
      this.runs.forEach((run) => {
        let Projects = []
        let runProjects = this.projects
        .filter(function (x) {return x.run_id === run.run_id})

        runProjects.forEach((RunProject) => {
          let ProjectJobs = this.jobs
          .filter(function (x) {return x.project === RunProject.project})
          .sort(function (x) {return x.job})

        let totalSteps = ProjectJobs.length
        let completedSteps = ProjectJobs.filter(function (x) {return x.status === 'finished'}).length

        let project = {
          project: RunProject.project,
          jobs: ProjectJobs,
          pipeline: RunProject.pipeline,
          resultCopyStatus: RunProject.copy_results_prm
        }
        Projects.push(project)
        })
        let len = Projects.length
        data.push({
          run_id: run.run_id,
          projects: Projects,
          len: len
        })
      })
      return data
    }
  },
  methods: {
    /**
     * increases timer by 1 second
     */
    timeUp() {
      this.time = this.time + 1000
    },
    /**
     * primes the timer for counting runtimes
     */
    setTimer() {
      this.time = new Date().getTime()
      setInterval(this.timeUp, 1000)
    },
    /**
     * Get the available projects in status data.
     */
    async getData () {
      try {
        let runs =  await this.fetchData(this.url + 'status_overview?num=10000')
        let projects = await this.fetchData(this.url + 'status_projects?num=10000')
        let jobs = await this.fetchData(this.url + 'status_jobs?num=10000')

        if (jobs !== this.jobs) {
          this.jobs = jobs
        }
        if (projects !== this.projects) {
          this.projects = projects
        }
        if (runs !== this.runs) {
          this.runs = runs
        }

      } catch (error) {
        console.error(error)
      }
    },
    /**
     * fetches data from specified location
     * @param ref fetch location url
     * @returns Array of items
     */
    async fetchData (ref, items = []) {
      const response = await fetch(ref, {headers: new Headers({'x-molgenis-token':'admin-test-token'})})
      const data = await response.json()
      let totalItems = items.concat(data.items)
      if (data.nextHref) {
        totalItems = await this.fetchData(data.nextHref, totalItems)  
      } else {
        return totalItems}
    }
  },
  async mounted () {
    await this.getData()
    this.setTimer()
    setInterval(this.getData, 10000)
  }
}

</script>

<style scoped>
</style>
