<template>
    <b-row id="track-and-trace" no-gutters class="h-100">
      <b-col  class="p-2 h-100" lg="4" cols="12">
        <b-container fluid class="border border-primary p-0 h-100">
          <run-status-table
          @cycle-next="cycleRun"
          :total-runs="runStepStatusArray"
          :selected-run="selectedRunObject"
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
        :demultiplexing="selectedRunDemultiplexingStatus">
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
import { countJobStatus } from '@/helpers/utils'


declare module 'vue/types/vue' {
  interface Vue {
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
    runObjects: Run[]
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
    getTrackerData(range: number): Promise<void>
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
      
      return selectedRunObject ? selectedRunObject : new Run('', 'waiting', 'waiting', 0, false, 0, false) // if no run is found substitute with an empty one
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
     * Creates array of runId Strings
     * 
     * @returns {String[]}
     */
    runIdArray (): string[] {
      const runIdArray: string[] = this.runObjects.map((run: Run) => run.run_id)
      return runIdArray
    },

    /**
     * creates an Array of Run objects for step tracker
     * 
     * @returns {Step[]}
     */
    runStepStatusArray (): Step[] {
      const runStepStatusArray: Step[] = this.runObjects.map((RunObject: Run) => {
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
      } else if (run1.containsError || run2.getCurrentStep() > run1.getCurrentStep()) {
        return -1
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
