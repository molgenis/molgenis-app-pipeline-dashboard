<template>
<b-row @click="toggleLogBox">
  <b-col cols="4" class="d-flex align-items-center justify-content-center text-center"><p class="text-truncate fontvw m-0">{{project}}</p></b-col>
  <b-col v-if="comment" cols="2" class="d-flex align-items-center justify-content-center text-center"><font-awesome-icon :icon="['fas', 'envelope-square']" class="secondary icons"/> </b-col>
  <b-col :cols="comment ? 2 : 4" class="d-flex align-items-center justify-content-center text-center pt-0 pb-0">
    <status-icon :status="status" :comment="comment" :warning="currentWarningStatus"/>
  </b-col>
    <b-col :cols="running ? 2 : 4" class="text-center float-left">
      <project-timer
      :startTime="startTime"
      :started="started"
      :finishTime="finishTime">
      </project-timer>
    </b-col>
    <b-col cols="2" v-if="running" class="d-flex align-items-center justify-content-center">
      <progress-bar
        :variant="variant"
        :step="steps"
        :totalSteps="totalSteps"
        :noWarning="hasNoWarning"
        :error="false"
        :animated="true"
        class="w-100"
      ></progress-bar>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue from 'vue'
import progressBar from '@/components/Track&Trace-Components/ProgressBar.vue'
import ProjectTimer from '@/components/Track&Trace-Components/ProjectTimer.vue'
import StatusIcon from '@/components/Track&Trace-Components/StatusIcon.vue'
import { Job, statusCode } from '@/types/dataTypes.ts'
import { JobCounts } from '../../types/Run'

declare module 'vue/types/vue' {
  interface Vue {
    jobs: JobCounts
  }
}
export default Vue.extend({
  name: 'project',
  props: {
    header: {
      type: Boolean,
      required: false,
      default: false
    },

    running: {
      type: Boolean,
      required: false,
      default: true
    },

    currentWarningStatus: {
      type: Boolean,
      required: false,
      default: false
    },

    project: {
      type: String,
      required: true
    },

    comment: {
      type: Boolean,
      required: false,
      default: false
    },

    jobs: {
      type: Object,
      required: true
    },
    projectDates: {
      type: Object,
      required: false,
      default: () => {return {startedDate: new Date(), finishedDate: new Date()}}
    },

    runID: {
      type: String,
      required: true
    },

    projectCount: {
      type: Number,
      required: true
    },

    time: {
      type: Number,
      required: true
    },

    resultCopy: {
      type: String,
      required: false,
      default: 'waiting'
    },

    threshold: {
      type: Number,
      required: false,
      default: 15
    }
  },
  components: {
    progressBar,
    ProjectTimer,
    StatusIcon
  },
  data () {
    return {
      logDisplay: false
    }
  },
  computed: {
    /**
     * Check for long runtime
     *
     * @returns {Boolean}
     */
    hasNoWarning (): Boolean {
      return this.finished || !this.started || (this.thresholdToMs > (this.finishTime - this.startTime))
    },
    /**
     * Converts average hours to milliseconds for timer
     *
     * @returns {Number}
     */
    thresholdToMs (): number {
      return this.threshold * 3600 * 1000
    },

    /**
     * calculates finished step count
     * @returns {Number}
     */
    steps (): number {
      if (this.resultCopy === 'finished' || this.resultCopy === 'started') {
        return this.totalSteps
      }
      
      return this.jobs.finished
    },

    /**
     * Calculates total step count for completion
     * @returns {Number}
     */
    totalSteps (): number {
      const jobs: JobCounts = this.jobs
      return jobs.waiting + jobs.started + jobs.finished + jobs.error
    },

    /**
     * Finds status of project and sets variant
     * @returns {String}
     */
    status (): statusCode {
      return this.jobs.getStatus()
    },
    /**
     * Sets the correct color variant
     * @returns {String}
     */
    variant (): string {
      switch (this.status) {
        case statusCode.finished:
          return 'success'
        case statusCode.error:
          return 'danger'
        case statusCode.started:
          return this.currentWarningStatus ? 'warning' : 'primary'
        case statusCode.waiting:
          return 'secondary'
        default:
          return 'warning'
      }
    },

    /**
     * Checks if project has been started
     * @returns {Boolean}
     */
    started (): boolean {
      return this.status === statusCode.started || this.status === statusCode.finished || this.status === statusCode.error
    },

    /**
     * Checks if all steps are completed
     * @returns {Boolean}
     */
    finished (): boolean {
      return (
        this.steps / this.totalSteps === 1
      )
    },

    /**
     * Sums up all job runtimes
     * @returns {Number}
     */
    runtime (): number {
      let runtime = 0
      let jobArray = this.jobs as Job[]
      jobArray.forEach(job => {
        if (job.startedDate && job.finishedDate) {
          runtime += new Date(job.startedDate!).getTime() - new Date(job.finishedDate!).getTime()
        }
      })
      return runtime
    },

    /**
     * Gets finished time, if not finished returns now()
     * @returns {Number} (milliseconds)
     */
    finishTime (): number {
      return this.projectDates.finishedDate ? this.projectDates.finishedDate.getTime() : this.finished ? NaN : this.time 
    },

    /**
     * Gets started time
     * @returns {Number} (milliseconds)
     */
    startTime (): number {
      return this.projectDates.startedDate ? this.projectDates.startedDate.getTime() : NaN
    }
  },
  methods: {
    /**
     * emits job to open the modalc
     * @emits 'open-modal'
     * @returns {void}
     */
    toggleLogBox (): void {
      this.$emit('open-modal', this.project)
    },
    /**
     * Checks if the project contains warnings
     * @emits 'project-warning'
     * @returns {void}
     */
    checkForWarnings (): void {
      if (!this.hasNoWarning) {
        this.$emit('project-warning', !this.hasNoWarning)
      }
    },
    /**
     * emits finished when called
     * @emits 'finished'
     * @returns {void}
     */
    projectFinished (): void {
      this.$emit('finished', this.runtime)
    },
    /**
     * Comperator function for job sorting by time
     * @param {Job} Job1 - first job
     * @param {Job} Job2 - second job
     * @returns {Number} sort order
     */
    SortJobsByTime (job1: Job, job2: Job): number {
      const job1StartedDate = job1.startedDate
      const job2StartedDate = job2.startedDate

      if ((job1StartedDate === '' && job2StartedDate === '') || (!job1StartedDate && !job2StartedDate)) {
        return 0
      } else if ((job1StartedDate !== '' && job2StartedDate === '') || !job1StartedDate) {
        return 1
      } else if ((job2StartedDate !== '' && job1StartedDate === '') || !job2StartedDate) {
        return -1
      }

      const job1Date = new Date(job1StartedDate!).getTime()
      const job2Date = new Date(job2StartedDate!).getTime()

      if (job1Date > job2Date) {
        return 1
      } else if (job1Date < job2Date) {
        return -1
      } else return 0
    }
  },
  mounted () {
    this.checkForWarnings()
    setInterval(this.checkForWarnings, 30000)
  }
})
</script>

<style lang="scss" scoped>
@import 'bootstrap/scss/bootstrap';
@import 'bootstrap-vue/src/index.scss';

.icons {
  height: 1vw;
  width: 1vw;
}

.secondary {
  color: $secondary;
}

p {
  font-size: 1vw;
}

</style>
