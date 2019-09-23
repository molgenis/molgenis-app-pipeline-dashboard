<template>
  <b-container id="track-and-trace" v-on:hover="console.log('mouse here')">
    <transition name="fade" mode="out-in">
      <template v-for="run in runData" >
        <run-table v-if="showRun === run.run_id" :runID="run.run_id" :showRun="showRun" :projects="run.projects" :projectCount="run.len + 1" :containsError="run.containsError" :currentStep="runStep(run)" :key="run.run_id" :time="time"/>
      </template>
    </transition>
    
  </b-container>
</template>

<script>

import RunTable from './Track&Trace-Components/RunTable.vue'

export default {
  name: 'track-and-trace',
  components: {
    RunTable
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
      showRun: ''
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
          containsError: errors >= 1,
          copyState: Projects.filter(function (x) {return x.resultCopyStatus === 'finished'}).length
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
    /**
     * Cycles the display index by 1
     * 
     */
    cycle () {
      let currentIndex = this.runIds.indexOf(this.showRun)
      if (currentIndex === (this.runIds.length - 1)) {
        currentIndex = 0
      } else {
        currentIndex += 1
      }
      this.showRun = this.runIds[currentIndex]
    },
    runStep(run) {
      if (run.demultiplexing !== 'finished') {
        return 0
      } else if (run.copyState === (run.len)) {
        return 3
        // run copying check
      } else if (false) {
        return 2
      } else {
        return 1
      }
    }
  },
  async mounted () {
    await this.getData()
    this.setTimer()
    setInterval(this.getData, 10000)
    this.cycle()
    setInterval(this.cycle, 10000)

  }
}

</script>

<style lang="scss" scoped>
@import '../../node_modules/bootstrap/scss/bootstrap';
@import '../../node_modules/bootstrap-vue/src/index.scss';

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.run_id {
  border: 2px solid $secondary;
}

#track-and-trace {
  height: 600px;
}
</style>
