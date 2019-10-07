<template>
    <b-row id="track-and-trace" no-gutters>
      <b-col  class="p-2" lg="4" cols="12">
        <b-container fluid class="border border-primary h-100 p-0">
          <run-status-table
          @run-finished="addRunToStatistics"
          :total-runs="runSteps"
          :selected-run="showRun"
          @select-run="setShowRun"
          @toggle-cycle="toggleCycle"
          :cycle-paused="paused"
          class="w-100">
          </run-status-table>
        </b-container>
      </b-col>
    <b-col class="p-2" cols="12" lg="8">
      <b-container class="border border-primary h-100" fluid>
      <transition name="fade" mode="out-in">
        <run-table
        :runID="runID"
        :showRun="showRun"
        :projects="runProjects"
        :projectCount="projectCount"
        :containsError="containsError"
        :currentStep="currentStep"
        :time="time"
        :demultiplexing="demultiplexing"/>
      </transition>
      </b-container>
    </b-col>
    </b-row>
</template>

<script>

import RunTable from '@/components/Track&Trace-Components/RunTable'
import RunStatusTable from '@/components/Track&Trace-Components/RunStatusTable'
import projectComponent from '@/components/Track&Trace-Components/RunTableProject'

export default {
  name: 'track-and-trace',
  components: {
    RunTable,
    RunStatusTable
  },
  props: {
    headers: {
      type: Headers,
      required: true
    },

    url: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      runs: [],
      jobs: [],
      projects: [],

      runUrl: '',
      time: 0,

      showRun: '',
      paused: false,
      loading: false
    }
  },
  computed: {
    /**
     * Currently selected run
     * @returns Object run
     */
    run: function () {
      const run = this.runData.find(x => x.run_id === this.showRun)
      if (run !== undefined) {
        return run
      }
      return this.makeRunObject('', [], false)
    },

    /**
     * Currently selected run id
     * @returns String run id
     */
    runID: function () {
      const runID = this.run.run_id
      if (typeof (runID) === 'undefined') {
        return ''
      }
      return this.run.run_id
    },

    /**
     * Currently selected run projects
     * @returns Array of Projects
     */
    runProjects: function () {
      return this.run.projects
    },

    /**
     * Currently selected run project count
     * @returns Number of projects
     */
    projectCount: function () {
      return this.run.len + 1
    },

    /**
     * Currently selected run error status
     * @returns Boolean
     */
    containsError: function () {
      return this.run.containsError
    },

    demultiplexing: function () {
      const demultiplexing = this.run.demultiplexing

      return demultiplexing === 'started' || demultiplexing === 'finished'
    },
    /**
     * Currently selected run step
     * @returns Number step
     */
    currentStep: function () {
      return this.runStep(this.run)
    },

    /**
     * Combines all data into one object
     * @returns Object
     */
    runData: function () {
      let data = []
      this.runs.forEach((run) => { data.push(this.constructRun(run, this.projects, this.jobs)) })
      data = data.sort(this.sortRuns)
      return data
    },

    /**
     * Creates array of runId Strings
     * @returns Array
     */
    runIds: function () {
      let runIds = []
      this.runs.forEach((run) => {
        runIds.push(run.run_id)
      })
      return runIds
    },

    /**
     * creates an Array of run objects for step tracker
     * @returns Array
     */
    runSteps: function () {
      let runSteps = []
      this.runData.forEach((run) => {
        runSteps.push(
          {
            run: run.run_id,
            step: this.runStep(run),
            containsError: run.containsError,
            len: run.len
          }
        )
      })
      return runSteps
    }
  },
  methods: {
    /**
     * changes detailed view to the given index
     * @param index Number
     */
    setCurrentIndex (index) {
      this.showRun = this.runIds[index]
    },

    /**
     * run comparator function
     * @param run1 run 1
     * @param run2 run 2
     * @returns Number
     */
    sortRuns (run1, run2) {
      if (run1.containsError && !run2.containsError) {
        return -1
      } else if (run2.containsError) {
        return 1
      } else if (this.runStep(run1) > this.runStep(run2)) {
        return 1
      } else {
        return 0
      }
    },

    /**
     * pauses the run cycleRun when selecting a run
     * @param run run to select
     */
    setShowRun (run) {
      this.paused = true
      this.showRun = run
    },

    /**
     * increases timer by 1 second
     */
    timeUp () {
      this.time = this.time + 1000
    },

    /**
     * primes the timer for counting runtimes
     */
    setTimer () {
      this.time = new Date().getTime()
      setInterval(this.timeUp, 1000)
    },

    /**
     * Get the available projects in status data.
     */
    async getData () {
      try {
        let runs = await this.fetchData(this.url + 'status_overview?num=10000')
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
      const response = await fetch(ref, {
        headers: this.headers
      })

      const data = await response.json()
      let totalItems = items.concat(data.items)
      if (data.nextHref) {
        totalItems = await this.fetchData(data.nextHref, totalItems)
      } else {
        return totalItems
      }
    },

    /**
     * Cycles the display index by 1
     */
    cycleRun () {
      if (this.paused) {
        return 0
      } else {
        let currentIndex = this.runIds.indexOf(this.showRun)
        if (currentIndex === (this.runIds.length - 1)) {
          currentIndex = 0
        } else {
          currentIndex += 1
        }
        this.showRun = this.runIds[currentIndex]
      }
    },

    /**
     * finds run status step number
     * @param run run to check
     * @returns step Number
     */
    runStep (run) {
      switch (run.demultiplexing) {
        case 'started':
          return 0
        case 'Waiting':
          return -1
      
        default:
      }
      if (run.rawCopy === 'started') {
        return 1
      } else if (run.copyState === (run.len)) {
        return 4
        // run result copying check
      } else if (run.copyState > 0 && this.runFinished(run)) {
        return 3
      } else {
        return 2
      }
    },

    /**
     * pause or resume cycling of detailed view
     */
    toggleCycle () {
      this.paused = !this.paused
    },

    /**
     * filters projects that are linked to run
     * @param projects all projects
     * @param run run to add data
     * @returns filtered projects
     */
    getRunProjects (projects, run) {
      return projects.filter(function (x) {
        return x.run_id === run.run_id
      })
    },

    /**
     * filters jobs that are linked to project
     * @param jobs all jobs
     * @param project project to add data to
     * @returns project jobs
     */
    getProjectJobs (jobs, project) {
      return jobs
        .filter(function (x) {
          return x.project === project.project
        })
        .sort(function (x) {
          return x.job
        })
    },

    /**
     * Checks if a run is finished with its pipelines
     * @param run Object
     * @returns Boolean
     */
    runFinished (run) {
      return run.projects.filter((x) => { return x.status.toLowerCase() === 'finished' }).lenght === run.len
    },

    /**
     * makes run data objects
     * @param run run information
     * @param Projects projects connected to run
     * @param errors error count of jobs
     * @returns Object
     */
    makeRunObject (run, Projects, errors) {
      let runObject = {}
      runObject.run_id = run.run_id
      runObject.projects = Projects
      runObject.demultiplexing = run.demultiplexing
      runObject.rawCopy = run.copy_raw_prm
      runObject.len = Projects.length
      runObject.containsError = errors >= 1
      runObject.copyState = this.countProjectFinishedCopying(Projects)

      return runObject
    },

    /**
     * returns number of finished projects
     * @param projects projects to check
     * @returns Number
     */
    countProjectFinishedCopying (projects) {
      const finishedProjects = projects.filter(function (x) {
        return x.resultCopyStatus === 'finished'
      })
      return finishedProjects.length
    },

    /**
     * combines all available data into one run
     * @param run run to add data to
     * @param projects all projects to filter
     * @param jobs all jobs to filter
     * @returns runObject
     */
    constructRun (run, projects, jobs) {
      let Projects = []
      const runProjects = this.getRunProjects(projects, run)
      let errors = 0
      runProjects.forEach((RunProject) => {
        const ProjectJobs = this.getProjectJobs(jobs, RunProject)
        Projects.push(this.makeProjectObject(
          RunProject,
          ProjectJobs,
          this.getStatus(RunProject, ProjectJobs)
        ))
        errors += this.countJobStatus(ProjectJobs, 'error')
      })
      return this.makeRunObject(run, Projects, errors)
    },

    /**
     * gets the project status
     * @param project project
     * @param jobs project jobs
     * @returns String status
     */
    getStatus (project, jobs) {
      if (project.copy_results_prm === 'finished') {
        return 'finished'
      } else if (this.countJobStatus(jobs, 'finished') === jobs.length) {
        return 'finished'
      } else if (this.countJobStatus(jobs, 'started') >= 1) {
        return 'started'
      } else {
        return 'Waiting'
      }
    },

    /**
     * builds project Object
     * @param project project
     * @param jobs project jobs
     * @returns project Object
     */
    makeProjectObject (project, jobs, status) {
      let projectObject = {}

      projectObject.project = project.project
      projectObject.jobs = jobs
      projectObject.pipeline = project.pipeline
      projectObject.resultCopyStatus = project.copy_results_prm
      projectObject.status = status

      return projectObject
    },

    /**
     * Coutns status occurence in a job Array
     *
     * @returns status count Number
     */
    countJobStatus (jobs, status) {
      return jobs.filter(function (x) { return x.status === status }).length
    },
    findLastDateTime (projects) {
      let FinishedDate = 0
      projects.forEach((project) => {
        project.jobs.forEach((job) => {
          let CurrentJobDate = new Date(job.finished_date).getTime()
          if (FinishedDate < CurrentJobDate && !isNaN(FinishedDate)) {
            FinishedDate = CurrentJobDate
          }
        })
      })
      return FinishedDate
    },
    findStartDateTime (projects) {
      let StartedDate = Infinity
      projects.forEach((project) => {
        project.jobs.forEach((job) => {
          let CurrentJobDate = new Date(job.started_date).getTime()
          if (StartedDate > CurrentJobDate && !isNaN(StartedDate)) {
            StartedDate = CurrentJobDate
          }
        })
      })
      return StartedDate
    },
    addRunToStatistics (run) {
      this.$emit('hello', run)
      const runStats = this.runData.find((x) => {
        return x.run_id === run
      })

      const start = this.findStartDateTime(runStats.projects)
      const finish = this.findLastDateTime(runStats.projects)
      this.$emit('add-statistic', run, start, finish)
    }
  },

  async mounted () {
    await this.getData()
    this.setTimer()
    setInterval(this.getData, 10000)
    this.cycleRun()
    setInterval(this.cycleRun, 10000)
  }
}

</script>

<style lang="scss" scoped>
@import '../../node_modules/bootstrap/scss/bootstrap';
@import '../../node_modules/bootstrap-vue/src/index.scss';

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.run_id {
  border: 2px solid $secondary;
}

.height60 {
  height: 100%;
}
</style>
