<template>
  <div id="track-and-trace">
    <b-table-simple fixed small>
      <colgroup><col><col></colgroup>
      <colgroup><col><col></colgroup>
      <colgroup><col><col></colgroup>
      <b-thead head-variant="light">
        <b-tr>
          <b-th colspan="2">Run Information</b-th>
          <b-th colspan="2">Timing</b-th>
          <b-th colspan="2">Progress</b-th>
        </b-tr>
        <b-tr>
          <b-th>Run ID</b-th>
          <b-th>Projects</b-th>
          <b-th>Run Time</b-th>
          <b-th>ETA</b-th >
          <b-th>Steps Complete</b-th>
          <b-th>Pipeline status</b-th>
        </b-tr>
      </b-thead>
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
      time: 0
    }
  },
  computed: {
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
        console.log(Projects)
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
    timeUp() {
      this.time = this.time + 1000
    },
    setTimer() {
      this.time = new Date().getTime()
      setInterval(this.timeUp, 1000)
    },
    /**
     * Get the available projects in statßus data.
     */
    async getData () {
      try {
        this.runs = await this.fetchData(this.url + 'status_overview?num=10000')
        this.projects = await this.fetchData(this.url + 'status_projects?num=10000')
        this.jobs = await this.fetchData(this.url + 'status_jobs?num=10000')
      } catch (error) {
        console.error(error)
      }
      console.log('done')
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
      async runUpdater() {

        const updateUrl = this.url + 'status_projects?q=' + this.runUrl
        const update = await this.fetchData(updateUrl)
        console.log(update)
      }
  },
  async mounted () {
    await this.getData()
    this.setTimer()
  }
}

</script>

<style scoped>
</style>
