<template>
  <div id="track-and-trace">
    <transition name="fade" mode="out-in">
      <template v-for="run in runData" >
        <b-table-simple v-if="showRun === run.run_id" borderless fixed small :key="run.run_id">
          <colgroup><col></colgroup>
          <colgroup><col><col></colgroup>
          <colgroup><col><col></colgroup>
        <b-tbody>
        <b-tr>
          <b-th colspan="5" class="text-center align-middle">
            {{run.run_id}}
          </b-th>
        </b-tr>
        <b-tr>
          <b-td colspan="5">
            <step-tracker :steps="['demultiplexing', 'running', 'copying', 'finished']" :currentStep="run.demultiplexing !== 'finished' ? 0 : 1" :error="run.containsError"></step-tracker>
          </b-td>
        </b-tr>
        <template v-for="(project, index) in run.projects">
          <project-row :key="project.project" :project="project.project" :jobs="project.jobs" :header="false" :runID="run.run_id" :projectCount="run.len + 1" :time="time"></project-row>
        </template>
        </b-tbody>
    </b-table-simple>
      </template>
    </transition>
    
  </div>
</template>

<script>
import ProjectRow from './Track&Trace-Components/ProjectRow'
import ProgressBar from './Track&Trace-Components/ProgressBar.vue'
import StepTracker from './Track&Trace-Components/StepTracker.vue'

export default {
  name: 'track-and-trace',
  components: {
    ProjectRow,
    ProgressBar,
    StepTracker
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
      showRun: '170612_M01785_0041_000000000-B5P3V_QXTR_11'
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
        let errors = 0
        runProjects.forEach((RunProject) => {
          let ProjectJobs = this.jobs
          .filter(function (x) {return x.project === RunProject.project})
          .sort(function (x) {return x.job})

        let totalSteps = ProjectJobs.length
        let completedSteps = ProjectJobs.filter(function (x) {return x.status === 'finished'}).length

        let error = ProjectJobs.filter(function (x) {
          return x.status === 'error'
        })

        let project = {
          project: RunProject.project,
          jobs: ProjectJobs,
          pipeline: RunProject.pipeline,
          resultCopyStatus: RunProject.copy_results_prm,
        }
        Projects.push(project)
        errors += error.length
        })
        
        let len = Projects.length
        data.push({
          run_id: run.run_id,
          projects: Projects,
          demultiplexing: run.demultiplexing,
          len: len,
          containsError: errors >= 1
        })
      })
      return data
    },
    runIds: function () {
      let runIds = []
      this.runs.forEach((run) => {
        runIds.push(run.run_id)
      })
      return runIds
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
    },
    cycle () {
      let currentIndex = this.runIds.indexOf(this.showRun)
      console.log('currentIndex:', currentIndex)
      if (currentIndex === (this.runIds.length - 1)) {
        currentIndex = 0
      } else {
        currentIndex += 1
      }
      this.showRun = this.runIds[currentIndex]
    }
  },
  async mounted () {
    await this.getData()
    this.setTimer()
    setInterval(this.getData, 10000)
    setInterval(this.cycle, 10000)
  }
}

</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
