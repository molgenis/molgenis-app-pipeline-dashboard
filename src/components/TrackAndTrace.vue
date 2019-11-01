<template>
    <b-row id="track-and-trace" no-gutters class="h-100">
      <b-col  class="p-2 h-100" lg="4" cols="12">
        <b-container fluid class="border border-primary p-0 h-100">
          <run-status-table
          @run-finished="addRunToStatistics"
          @cycle-next="cycleRun"
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
      <b-container class="border border-primary h-100 overflow-auto" fluid>
      <transition name="fade" mode="out-in" class="h-100">
        <run-table
        :runID="runID"
        :showRun="showRun"
        :projects="runProjects"
        :projectCount="projectCount"
        :containsError="containsError"
        :currentStep="currentStep"
        :time="time"
        :demultiplexing="demultiplexing"
        :headers="headers"
        :API="APIvOne"
        :thresholdOnco="thresholdOnco"
        :thresholdPcs="thresholdPcs"
        :thresholdExoom="thresholdExoom"
        :thresholdSvp="thresholdSvp">
        </run-table>
      </transition>
      </b-container>
    </b-col>
    </b-row>
</template>

<script lang="ts">
import Vue from 'vue'
import {mapActions} from 'vuex'
import RunTable from '@/components/Track&Trace-Components/RunTable.vue'
import RunStatusTable from '@/components/Track&Trace-Components/RunStatusTable.vue'
import projectComponent from '@/components/Track&Trace-Components/RunTableProject.vue'
import { RawDataObject, Run, RunDataObject, ProjectObject, projectDataObject, Job, Step, RunTimeStatistic } from '@/types/dataTypes'

declare module 'vue/types/vue' {
  interface Vue {
    runs: RunDataObject[]
    jobs: Job[]
    TotalProjects: projectDataObject[]
    runUrl: string
    time: number
    showRun: string
    paused: boolean
    loading: boolean
    headers: object
    url: string
    APIvOne: string
    run: Run
    runID: string
    runProjects: ProjectObject[]
    projectCount: number
    containsError: boolean
    demultiplexing: boolean
    currentStep: number
    runData: Run[]
    runIds: string[]
    runSteps: Step[]
    graphRuns: string[]
    setCurrentIndex(index: number): void
    sortRuns(run1: Run, run2: Run): number
    setShowRun(run: string): void
    timeUp(): void
    setTimer(): void
    getData(): Promise<void>
    fetchData(ref: string, items?: RawDataObject[]): Promise<RawDataObject[]>
    cycleRun (): void
    runStep (run: Run): number
    toggleCycle (): void
    getRunProjects (projects: projectDataObject[], run: string): projectDataObject[]
    getProjectJobs (jobs: Job[], project: projectDataObject): Job[]
    runFinished (run: Run): Boolean
    countProjectFinishedCopying (projects: ProjectObject[]): number
    constructRun (run: RunDataObject, projects: projectDataObject[], jobs: Job[]): Run
    getStatus (project: projectDataObject, jobs: Job[]): string
    countJobStatus (jobs: Job[], status: string): number
    findLastDateTime (projects: ProjectObject[]): number
    findStartDateTime (projects: ProjectObject[]): number
    addRunToStatistics (run: string): void
  }
}

export default Vue.extend({
  name: 'track-and-trace',
  components: {
    RunTable,
    RunStatusTable
  },
  props: {
    headers: {
      type: Object,
      required: true
    },

    url: {
      type: String,
      required: true
    },
    APIvOne: {
      type: String,
      required: true
    },
    thresholdOnco: {
      type: Number,
      required: true
    },
    thresholdPcs: {
      type: Number,
      required: true
    },
    thresholdExoom: {
      type: Number,
      required: true
    },
    thresholdSvp: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      runUrl: '',
      time: 0,
      showRun: '',
      paused: false,
      loading: false,
      graphRuns: []
    }
  },
  computed: {
    /**
     * Retrieves runs from store
     * 
     * @returns {RunDataObject[]}
     */
    runs (): RunDataObject[] {
      return this.$store.state.runs
    },
    /**
     * Retrieves projects from store
     * 
     * @returns {projectDataObject[]}
     */
    TotalProjects (): projectDataObject[] {
      return this.$store.state.projects
    },
    /**
     * Retrieves jobs from store
     * 
     * @returns {Job[]}
     */
    jobs (): Job[] {
      return this.$store.state.jobs
    },
    /**
     * Currently selected run
     * @returns {Run}
     */
    run (): Run {
      const run = this.runData.find((x: Run) => { return x.run_id === this.showRun })
      if (run) {
        return run!
      }
      return new Run('', [], '', '', 0, false, 0)
    },
    /**
     * Currently selected run id
     * 
     * @returns {String} run id
     */
    runID (): string {
      const runID = this.run.run_id
      if (typeof (runID) === 'undefined') {
        return ''
      }
      return this.run.run_id
    },

    /**
     * Currently selected run projects
     * 
     * @returns {ProjectObject[]}
     */
    runProjects (): ProjectObject[] {
      return this.run.projects
    },

    /**
     * Currently selected run project count
     * 
     * @returns {Number}
     */
    projectCount (): number {
      return this.run.len + 1
    },

    /**
     * Currently selected run error status
     * 
     * @returns {Boolean}
     */
    containsError (): Boolean {
      return this.run.containsError
    },

    /**
     * checks if run is busy demultiplexing
     * 
     * @returns {Boolean}
     */
    demultiplexing (): Boolean {
      const demultiplexing = this.run.demultiplexing

      return demultiplexing === 'started' || demultiplexing === 'finished'
    },
    /**
     * Currently selected run step
     * 
     * @returns {Number}
     */
    currentStep (): number {
      return this.runStep(this.run)
    },

    /**
     * Combines all data into one object
     * 
     * @returns {Run[]}
     */
    runData (): Run[] {
      let data: Run[] = []
      this.runs.forEach((run: RunDataObject) => { data.push(this.constructRun(run, this.TotalProjects, this.jobs)) })
      data = data.sort(this.sortRuns)
      return data
    },

    /**
     * Creates array of runId Strings
     * 
     * @returns {String[]}
     */
    runIds (): string[] {
      let runIds: string[] = []
      this.runData.forEach((run: Run) => {
        runIds.push(run.run_id)
      })
      return runIds
    },

    /**
     * creates an Array of run objects for step tracker
     * 
     * @returns {Step[]}
     */
    runSteps (): Step[] {
      let runSteps: Step[] = []
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
    setCurrentIndex (index: number): void {
      this.showRun = this.runIds[index]
    },

    /**
     * run comparator function
     * @param run1 first run
     * @param run2 second run
     * @returns Number Sort order
     */
    sortRuns (run1: Run, run2: Run): number {
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
    setShowRun (run: string): void {
      this.paused = true
      this.showRun = run
    },

    /**
     * increases timer by 1 second
     * 
     * @returns {void}
     */
    timeUp (): void {
      this.time = this.time + 1000
    },

    /**
     * primes the timer for counting runtimes
     * 
     * @returns {void}
     */
    setTimer ():void {
      this.time = new Date().getTime()
      setInterval(this.timeUp, 1000)
    },

    /**
     * Get the available projects in status data.
     * 
     * @returns {Promise<void>}
     */
    async getData (): Promise<void> {
      this.$store.dispatch('getTrackerData')
    },
    /**
     * fetches data from specified location
     * @param {String} ref - fetch location url
     * @param {Promise<RawDataObject[]>} items - fetch previous page contents
     * 
     * @returns {Promise<RawDataObject[]>}
     */
    async fetchData (ref: string, items = []): Promise<RawDataObject[]> {
      const response = await fetch(ref, {
        headers: this.headers
      })

      const data = await response.json()
      let totalItems: RawDataObject[] = items.concat(data.items)
      if (data.nextHref) {
        totalItems = await this.fetchData(data.nextHref, totalItems)
      }
      return totalItems
    },

    /**
     * Cycles the display index by 1
     * 
     * @returns {void}
     */
    cycleRun (): void {
      if (!this.paused) {
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
     * @param {Run} run - run to check
     * 
     * @returns {Number}
     */
    runStep (run: Run): number {
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
    toggleCycle (): void {
      this.paused = !this.paused
    },

    /**
     * filters projects that are linked to run
     * @param projects all projects
     * @param run run to add data
     * @returns filtered projects
     */
    getRunProjects (projects: projectDataObject[], run: string): projectDataObject[] {
      return projects.filter(function (x) {
        return x.run_id === run
      })
    },

    /**
     * filters jobs that are linked to project
     * @param {Job[]} jobs all jobs
     * @param {projectDataObject} project project to add data to
     * 
     * @returns {Job[]}
     */
    getProjectJobs (jobs: Job[], project: projectDataObject): Job[] {
      return jobs
        .filter(function (x: Job) {
          return x.project === project.project
        })
        .sort(function (a: Job, b: Job) {
          if (a.job > b.job) {
            return 1
          } else if (a.job < b.job) {
            return -1
          } else {
            return 0
          }
        })
    },

    /**
     * Checks if a run is finished with its pipelines
     * @param {Run} run - run to check pipelines
     * 
     * @returns {Boolean}
     */
    runFinished (run: Run): Boolean {
      return run.projects.filter((x) => { return x.status.toLowerCase() === 'finished' }).length === run.len
    },
    /**
     * returns number of finished projects
     * @param {ProjectObject[]} projects - projects to check
     * 
     * @returns {Number}
     */
    countProjectFinishedCopying (projects: ProjectObject[]): number {
      const finishedProjects = projects.filter(function (x) {
        return x.resultCopyStatus === 'finished'
      })
      return finishedProjects.length
    },

    /**
     * combines all available data into one run
     * @param {RunDataObject} run - run to add data to
     * @param {ProjectDataObject[]} projects - all projects to filter
     * @param {Job[]} jobs - all jobs to filter
     * 
     * @returns {Run}
     */
    constructRun (run: RunDataObject, projects: projectDataObject[], jobs: Job[]): Run {
      let Projects: ProjectObject[] = []
      const runProjects = this.getRunProjects(projects, run.run_id)
      let errors = 0
      runProjects.forEach((RunProject: projectDataObject) => {
        const ProjectJobs = this.getProjectJobs(jobs, RunProject)

        Projects.push(
          new ProjectObject(
            RunProject.project,
            ProjectJobs,
            RunProject.pipeline,
            this.getStatus(RunProject, ProjectJobs),
            RunProject.copy_results_prm,
            RunProject.comment
          )
        )

        errors += this.countJobStatus(ProjectJobs, 'error')
      })
      return new Run(run.run_id, Projects, run.demultiplexing, run.copy_raw_prm, Projects.length, errors >= 1, this.countProjectFinishedCopying(Projects))
    },

    /**
     * gets the project status
     * @param {projectDataObject} project - project
     * @param {Job[]} jobs - project jobs
     * 
     * @returns {String} - status
     */
    getStatus (project: projectDataObject, jobs: Job[]): string {
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
     * Coutns status occurence in a job Array
     *
     * @returns {Number} - status count
     */
    countJobStatus (jobs: Job[], status: string): number {
      return jobs.filter(function (x) { return x.status === status }).length
    },
    /**
     * resolves the last known finish date
     * @param {ProjectObject} projects - Projects to search for finish date
     * 
     * @returns {Number} - finished date in ms
     */
    findLastDateTime (projects: ProjectObject[]): number {
      let FinishedDate = 0
      projects.forEach((project: ProjectObject) => {
        project.jobs.forEach((job: Job) => {
          if (typeof (job.finished_date) !== 'undefined') {
            let CurrentJobDate = new Date(job.finished_date!).getTime()
            if (FinishedDate < CurrentJobDate && !isNaN(FinishedDate)) {
              FinishedDate = CurrentJobDate
            }
          }
        })
      })
      return FinishedDate
    },
    /**
     * resolves the start date of the project array
     * @param {ProjectObject[]} projects - projects to search
     * 
     * @returns {Number} - started date in ms
     */
    findStartDateTime (projects: ProjectObject[]): number {
      let StartedDate = Infinity
      projects.forEach((project: ProjectObject) => {
        project.jobs.forEach((job: Job) => {
          if (typeof (job.started_date) !== 'undefined') {
            let CurrentJobDate = new Date(job.started_date!).getTime()
            if (StartedDate > CurrentJobDate && !isNaN(StartedDate)) {
              StartedDate = CurrentJobDate
            }
          }
        })
      })
      return StartedDate
    },
    /**
     * Creates a RunTimeStatistic object and sends it to the grah
     * @param {String} run run to add to graph
     * 
     * @returns {void}
     */
    addRunToStatistics (run: string): void {
      if (!this.graphRuns.includes(run)) {
        const runObj = this.runData.find((x: Run) => { return x.run_id === run })
        const runTimeStats = new RunTimeStatistic(runObj!.projects, run)
        this.$emit('add-statistic', runTimeStats)
        this.graphRuns.push(run)
      }
    }
  },

  async mounted (): Promise<void> {
    await this.getData()
    this.setTimer()
    this.cycleRun()
    setInterval(this.cycleRun, 10000)
    setInterval(this.getData, 10000)
  }
})

</script>

<style lang="scss" scoped>
@import 'bootstrap/scss/bootstrap';
@import 'bootstrap-vue/src/index.scss';

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
