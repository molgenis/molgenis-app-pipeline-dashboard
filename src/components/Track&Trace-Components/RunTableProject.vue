<template>
<b-row @click="toggleLogBox">
  <b-col cols="4" class="text-center"><p class="text-truncate fontvw">{{project}}</p></b-col>
  <b-col cols="4" class="text-center pt-1">
    <status-icon :status="status" :comment="comment.length > 0"/>
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
        class="w-100 mt-1"
      ></progress-bar>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue from 'vue'
import progressBar from '@/components/Track&Trace-Components/ProgressBar.vue'
import ProjectTimer from '@/components/Track&Trace-Components/ProjectTimer.vue'
import StatusIcon from '@/components/Track&Trace-Components/StatusIcon.vue'
import { Job } from '@/types/dataTypes.ts'
import { countJobStatus } from '../../helpers/utils'

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

    jobs: {
      type: Array,
      required: true
    },
    startedDate: {
      type: Number,
      required: false
    },

    finishedDate: {
      type: Number,
      required: false
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
    },
    comment: {
      type: String,
      required: false,
      default: ''
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
     * Filters jobs that are not completed sorted by start date
     * @returns {Job[]}
     */
    remainingJobs (): Job[] {
      let jobArray: Job[] = this.jobs
      return jobArray
        .filter(function (job: Job) {
          return job.status !== 'finished'
        })
        .sort(this.SortJobsByTime)
    },

    /**
     * calculates finished step count
     * @returns {Number}
     */
    steps (): number {
      if (this.resultCopy === 'finished' || this.resultCopy === 'started') {
        return this.totalSteps
      }
      let jobArray = this.jobs as Job[]
      return countJobStatus(jobArray, 'finished')
    },

    /**
     * Calculates total step count for completion
     * @returns {Number}
     */
    totalSteps (): number {
      return this.jobs.length
    },

    /**
     * Finds status of project and sets variant
     * @returns {String}
     */
    status (): string {
      if (this.finished) {
        return 'finished'
      } else if (countJobStatus(this.remainingJobs, 'error') >= 1) {
        return 'error'
      } else if (!this.hasNoWarning) {
        return 'warning'
      } else if (
        countJobStatus(this.remainingJobs, 'started') >= 1
      ) {
        return 'running'
      } else {
        return 'waiting'
      }
    },
    /**
     * Sets the correct color variant
     * @returns {String}
     */
    variant (): string {
      switch (this.status) {
        case 'finished':
          return 'success'
        case 'error':
          return 'danger'
        case 'warning':
          return 'warning'
        case 'running':
          return 'primary'
        default:
          return 'waiting'
      }
    },

    /**
     * Checks if project has been started
     * @returns {Boolean}
     */
    started (): boolean {
      return this.steps > 0 || countJobStatus(this.jobs, 'started') > 0
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
        if (job.started_date && job.finished_date) {
          runtime += new Date(job.started_date!).getTime() - new Date(job.finished_date!).getTime()
        }
      })
      return runtime
    },

    /**
     * Gets finished time, if not finished returns now()
     * @returns {Number} (milliseconds)
     */
    finishTime (): number {
      return this.finished ? this.finishedDate : this.time
    },

    /**
     * Gets started time
     * @returns {Number} (milliseconds)
     */
    startTime (): number {
      return this.startedDate
    }
  },
  methods: {
    /**
     * emits job to open the modal
     * 
     * @emits 'open-modal'
     * @returns {void}
     */
    toggleLogBox (): void {
     this.$emit('open-modal', this.project, this.comment) 
    },
    /**
     * Checks if the project contains warnings
     * 
     * @emits 'project-warning'
     * @returns {void}
     */
    checkForWarnings(): void {
      if (!this.hasNoWarning) {
        this.$emit('project-warning', !this.hasNoWarning)
      }
    },
    /**
     * emits finished when called
     * 
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
      const job1StartedDate = job1.started_date
      const job2StartedDate = job2.started_date

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

<style scoped>
.fontvw {
  font-size: '150%';
}
</style>
