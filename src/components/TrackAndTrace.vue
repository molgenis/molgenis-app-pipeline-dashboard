<template>
    <b-row id="track-and-trace" no-gutters>
      <b-col  class="p-2" lg="4" cols="12">
        <b-container fluid class="border border-primary rounded h-100 p-0">
          <run-step-table  :runs="runSteps" :selected="showRun" @select-run="setShowRun" @toggle-cycle="toggleCycle" :paused="paused" class="w-100"/>
        </b-container>
      </b-col>
    <b-col class="p-2" cols="12" lg="8">
      <b-container class="border border-primary rounded h-100" fluid>
      <transition name="fade" mode="out-in">
      <template v-for="run in runData" >
        <run-table v-if="showRun === run.run_id" :runID="run.run_id" :showRun="showRun" :projects="run.projects" :projectCount="run.len + 1" :containsError="run.containsError" :currentStep="runStep(run)" :key="run.run_id" :time="time"/>
      </template>
    </transition>
      </b-container>
    </b-col>
    </b-row>
</template>

<script>

import RunTable from './Track&Trace-Components/RunTable.vue'
import RunStepTable from '@/components/Track&Trace-Components/RunStepTable.vue'

export default {
  name: 'track-and-trace',
  components: {
    RunTable,
    RunStepTable
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
      showRun: '',
      paused: false
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
        let runProjects = this.getRunProjects(this.projects, run)
        let errors = 0
        runProjects.forEach((RunProject) => {
          let ProjectJobs = this.getProjectJobs(this.jobs, RunProject)

          let totalSteps = ProjectJobs.length
          let completedSteps = ProjectJobs.filter(function (x) {
            return x.status === 'finished'
          }).length

          let error = ProjectJobs.filter(function (x) {
            return x.status === 'error'
          })

          let project = {
            project: RunProject.project,
            jobs: ProjectJobs,
            pipeline: RunProject.pipeline,
            resultCopyStatus: RunProject.copy_results_prm
          }
          Projects.push(project)
          errors += error.length
        })

        let len = Projects.length
        data.push({
          run_id: run.run_id,
          projects: Projects,
          demultiplexing: run.demultiplexing,
          rawCopy: run.copy_raw_prm,
          len: len,
          containsError: errors >= 1,
          copyState: Projects.filter(function (x) {
            return x.resultCopyStatus === 'finished'
          }).length
        })
      })
      data = data.sort((run1, run2) => {
        if (run1.containsError && !run2.containsError) {
          return -1
        } else if (run2.containsError) {
          return 1
        } else if (this.runStep(run1) > this.runStep(run2)) {
          return 1
        } else {
          return 0
        }
      })
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
    },
    runStatus: function () {
      
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
     *
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
    runStep (run) {
      if (run.demultiplexing !== 'finished') {
        return 0
      } 
      if (run.rawCopy === 'started'){
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
    toggleCycle() {
      this.paused = !this.paused
    },
    getRunProjects (projects, run) {
      return projects.filter(function (x) {
        return x.run_id === run.run_id
      })
    },
    getProjectJobs (jobs, project) {
      return jobs
      .filter(function (x) {
        return x.project === project.project
        })
        .sort(function (x) {
              return x.job
            })
    },
    runFinished(run) {
      return false
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
#track-and-trace {
}
</style>
