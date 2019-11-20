<template>
    <b-row id="track-and-trace" no-gutters class="h-100">
      <b-col  class="p-2 h-100" lg="4" cols="12">
        <b-container fluid class="border border-primary p-0 h-100">
          <run-status-table
          @run-finished="addRunToStatistics"
          @cycle-next="cycleRun"
          :total-runs="runStepStatusArray"
          :selected-run="showRun"
          @select-run="setShowRun"
          @toggle-cycle="toggleCycle"
          :cycle-paused="paused"
          class="w-100">
          </run-status-table>
        </b-container>
      </b-col>
    <b-col class="p-2 h-100" cols="12" lg="8" >
      <b-container class="border border-primary h-100 p-0 overflow-auto" fluid>
        <run-table
        :runID="selectedRunID"
        :showRun="showRun"
        :projects="selectedProjects"
        :projectCount="selectedProjectCount"
        :containsError="selectedRunContainsError"
        :currentStep="selectedRunStepNumber"
        :time="time"
        :demultiplexing="selectedRunDemultiplexingStatus"
        :thresholdOnco="thresholdOnco"
        :thresholdPcs="thresholdPcs"
        :thresholdExoom="thresholdExoom"
        :thresholdSvp="thresholdSvp">
        </run-table>
      </b-container>
    </b-col>
    </b-row>
</template>

<script lang="ts">
import Vue from 'vue'
import {mapActions, mapState, mapGetters} from 'vuex'
import RunTable from '@/components/Track&Trace-Components/RunTable.vue'
import RunStatusTable from '@/components/Track&Trace-Components/RunStatusTable.vue'
import projectComponent from '@/components/Track&Trace-Components/RunTableProject.vue'
import { RawDataObject, Run, RunDataObject, ProjectObject, projectDataObject, Job, Step, RunTimeStatistic, statusCode } from '@/types/dataTypes'
import { countJobStatus, countProjectFinishedCopying } from '@/helpers/utils'


declare module 'vue/types/vue' {
  interface Vue {
    runs: RunDataObject[]
    jobs: Job[]
    TotalProjects: projectDataObject[]
    time: number
    showRun: string
    paused: boolean
    loading: boolean
    url: string
    selectedRunObject: Run
    selectedRunID: string
    selectedProjects: ProjectObject[]
    selectedProjectCount: number
    selectedRunContainsError: boolean
    selectedRunDemultiplexingStatus: boolean
    selectedRunStepNumber: number
    mappedRunData: Run[]
    runIdArray: string[]
    runStepStatusArray: Step[]
    graphRuns: string[]
    setSelectedRunIndex(index: number): void
    compareRuns(run1: Run, run2: Run): number
    setShowRun(selectedRunObject: string): void
    timeUp(): void
    setTimer(): void
    getData(): Promise<void>
    cycleRun (): void
    toggleCycle (): void
    getRunProjects (projects: projectDataObject[], selectedRunObject: string): projectDataObject[]
    getProjectJobs (jobs: Job[], project: projectDataObject): Job[]
    runFinished (selectedRunObject: Run): Boolean
    countProjectFinishedCopying (projects: ProjectObject[]): number
    getStatus (project: projectDataObject, jobs: Job[]): string
    findLastDateTime (projects: ProjectObject[]): number
    findStartDateTime (projects: ProjectObject[]): number
    getTrackerData(range: number): Promise<void>
    addRunToStatistics (selectedRunObject: string): void
    getRunObjectByID (runID: string): Run
    getFinishedRuns: string[]
  }
}

export default Vue.extend({
  name: 'track-and-trace',
  components: {
    RunTable,
    RunStatusTable
  },
  props: {
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
    },
    loadingStatus: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      time: 0,
      showRun: '',
      paused: false,
      loading: false,
      graphRuns: [],
      errorToastActive: false
    }
  },
  computed: {
    ...mapState({
      runs: 'runs',
      TotalProjects: 'projects',
      jobs: 'jobs',
      projectObjects: 'projectObjects',
      runObjects: 'runObjects'
    }),
    ...mapGetters([
      'getRunObjectByID',
      'getFinishedRuns'
    ]),
    /**
     * Currently selected run
     * @returns {Run}
     */
    selectedRunObject (): Run {
      const id = this.showRun
      const selectedRunObject: Run | undefined = this.getRunObjectByID(id)
      
      return selectedRunObject ? selectedRunObject : new Run('', 'waiting', 'waiting', 0, false, 0)
    },
    /**
     * Currently selected run id
     * 
     * @returns {String} run id
     */
    selectedRunID (): string {
      const selectedRunID = this.selectedRunObject.run_id
      return selectedRunID ? selectedRunID : ''
    },

    /**
     * Currently selected projects belonging to the selected run
     * 
     * @returns {ProjectObject[]}
     */
    selectedProjects (): ProjectObject[] {
      const selectedProjects = this.projectObjects[this.selectedRunID]
      return  selectedProjects ? selectedProjects : []
    },

    /**
     * Currently selected project count
     * 
     * @returns {Number}
     */
    selectedProjectCount (): number {
      return this.selectedRunObject.len + 1
    },

    /**
     * Currently selected run error status
     * 
     * @returns {Boolean}
     */
    selectedRunContainsError (): Boolean {
      return this.selectedRunObject.containsError
    },

    /**
     * checks if selected run is busy demultiplexing
     * 
     * @returns {Boolean}
     */
    selectedRunDemultiplexingStatus (): Boolean {
      const selectedRunDemultiplexingStatus = this.selectedRunObject.getDemultiplexingStatus()
      return (selectedRunDemultiplexingStatus === statusCode.started || selectedRunDemultiplexingStatus === statusCode.finished)
    },
    /**
     * Currently selected run step number
     * 
     * @returns {Number}
     */
    selectedRunStepNumber (): number {
      return this.selectedRunObject.getCurrentStep()
    },

    /**
     * Combines all data into one object
     * 
     * @returns {Run[]}
     */
    mappedRunData (): Run[] {
      const data: Run[] = this.runObjects.sort(this.compareRuns)
      return data
    },

    /**
     * Creates array of runId Strings
     * 
     * @returns {String[]}
     */
    runIdArray (): string[] {
      const runIdArray: string[] = this.mappedRunData.map((run: Run) => run.run_id)
      return runIdArray
    },

    /**
     * creates an Array of Run objects for step tracker
     * 
     * @returns {Step[]}
     */
    runStepStatusArray (): Step[] {
      const runStepStatusArray: Step[] = this.mappedRunData.map((RunObject: Run) => {
        return {
          run: RunObject.run_id,
          step: RunObject.getCurrentStep(),
          containsError: RunObject.containsError,
          len: RunObject.len
          }
        })
      return runStepStatusArray
    }
  },
  methods: {
    ...mapActions([
      'getTrackerData'
    ]),
    /**
     * changes detailed view to the given index
     * @param {Number} index - index of current selectedRunObject
     */
    setSelectedRunIndex (index: number): void {
      this.showRun = this.runIdArray[index]
    },

    /**
     * selectedRunObject comparator function
     * @param {Run} run1 - first selectedRunObject
     * @param {Run} run2 - second selectedRunObject
     * @returns Number Sort order
     */
    compareRuns (run1: Run, run2: Run): number {
      if (run1.containsError && !run2.containsError) {
        return -1
      } else if (run2.containsError || run1.getCurrentStep() > run2.getCurrentStep()) {
        return 1
      } else {
        return 0
      }
    },

    /**
     * pauses the run cycle when selecting a run
     * @param {String} runID - run id of a run to select
     */
    setShowRun (runID: string): void {
      this.paused = true
      this.showRun = runID
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
     * Calls data fetch action
     * 
     * @returns {Promise<void>}
     */
    getData () {
      this.getTrackerData(20)
      .then(() => {
        if (this.errorToastActive) {
          this.$bvToast.hide('errorToast')
          this.errorToastActive = false
          this.$bvToast.toast('Connection to MOLGENIS restored', {
            title: 'Updated',
            variant: 'success',
            toaster: 'b-toaster-bottom-right',
          })
        }
      })
      .catch((reason) => {
        if (!this.errorToastActive) {
          this.errorToastActive = true
          this.$bvToast.toast(reason, {
            id: 'errorToast',
            title: 'Error',
            variant: 'danger',
            toaster: 'b-toaster-bottom-right',
            noAutoHide: true
          })
        }
      })
    },
    /**
     * Cycles the display index by 1
     * 
     * @returns {void}
     */
    cycleRun (): void {
      if (!this.paused) {
        let currentIndex = this.runIdArray.indexOf(this.showRun)
        if (currentIndex === (this.runIdArray.length - 1)) {
          currentIndex = 0
        } else {
          currentIndex += 1
        }
        this.showRun = this.runIdArray[currentIndex]
      }
    },

    /**
     * pause or resume cycling of detailed view
     */
    toggleCycle (): void {
      this.paused = !this.paused
    },

    /**
     * filters projects that are linked to selectedRunObject
     * @param projects all projects
     * @param selectedRunObject selectedRunObject to add data
     * @returns filtered projects
     */
    getRunProjects (projects: projectDataObject[], selectedRunObject: string): projectDataObject[] {
      return projects.filter(function (x) {
        return x.run_id === selectedRunObject
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
     * @param {Run} run - selectedRunObject to check pipelines
     * 
     * @returns {Boolean}
     */
    runFinished (run: Run): Boolean {
      return run.run_id in this.getFinishedRuns
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
     * gets the project status
     * @param {projectDataObject} project - project
     * @param {Job[]} jobs - project jobs
     * 
     * @returns {String} - status
     */
    getStatus (project: projectDataObject, jobs: Job[]): string {
      if (project.copy_results_prm === 'finished' || countJobStatus(jobs, 'finished') === jobs.length) {
        return 'finished'
      } else if (countJobStatus(jobs, 'started') >= 1) {
        return 'started'
      } else {
        return 'Waiting'
      }
    },

    /**
     * Creates a RunTimeStatistic object and sends it to the grah
     * @param {String} selectedRunObject selectedRunObject to add to graph
     * 
     * @returns {void}
     */
    addRunToStatistics (selectedRunObject: string): void {
      if (!this.graphRuns.includes(selectedRunObject)) {
        const runObj = this.mappedRunData.find((x: Run) => { return x.run_id === selectedRunObject })
        const runTimeStats = new RunTimeStatistic(this.projectObjects[runObj!.run_id], selectedRunObject)
        this.$emit('add-statistic', runTimeStats)
        this.graphRuns.push(selectedRunObject)
      }
    }
  },
  watch: {
    loadingStatus () {
      this.setSelectedRunIndex(0)
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
