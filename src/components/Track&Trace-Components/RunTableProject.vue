<template>
<b-row @click="toggleLogBox">
  <b-col class="text-center text-truncate">{{project}}</b-col>
  <b-col class="text-center">
    <status-icon :status="status" />
  </b-col>
    <b-col class="text-center">
      <project-timer
      :startTime="startTime"
      :started="started"
      :finishTime="finishTime">
      </project-timer>
    </b-col>
    <b-col v-if="running" class="d-flex align-items-center justify-content-center">
      <progress-bar
        :variant="variant"
        :step="steps"
        :totalSteps="totalSteps"
        :HasNoWarning="HasNoWarning"
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
     */
    HasNoWarning (): Boolean {
      const warning = (this.thresholdToMs > this.finishTime - this.startTime) || !this.started
      if (!warning) {
        this.$emit('project-warning', !warning)
      }
      return warning
    },
    /**
     * Converts average hours to milliseconds for timer
     * @returns Number
     */
    thresholdToMs (): number {
      return this.threshold * 3600 * 1000
    },

    /**
     * Filters jobs that are not completed sorted by start date
     * @returns Array
     */
    remainingJobs (): Job[] {
      let jobArray: Job[] = this.jobs as Job[]
      return jobArray
        .filter(function (job: Job) {
          return job.status !== 'finished'
        })
        .sort(this.SortJobsByTime)
    },

    /**
     * calculates finished step count
     * @returns Number
     */
    steps (): number {
      let jobArray = this.jobs as Job[]
      return jobArray.filter(function (job) {
        return job.status === 'finished'
      }).length
    },

    /**
     * Calculates total step count for completion
     * @returns Number
     */
    totalSteps (): number {
      return this.jobs.length
    },

    /**
     * Finds status of project and sets variant
     * @returns String
     */
    status (): string {
      if (this.finished) {
        return 'finished'
      } else if (
        this.remainingJobs.filter(function (job) {
          return job.status === 'error'
        }).length >= 1
      ) {
        return 'error'
      } else if (!this.HasNoWarning) {
        return 'warning'
      } else if (
        this.remainingJobs.filter(function (job) {
          return job.status === 'started'
        }).length >= 1
      ) {
        return 'running'
      } else {
        return 'waiting'
      }
    },

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
     * @returns Boolean
     */
    started (): boolean {
      let jobArray: Job[] = this.jobs as Job[]
      const startedJobs = jobArray.filter(
        (job: Job) => {
          return job.status === 'started'
        }).length

      if (this.steps > 0) {
        return true
      } else if (startedJobs > 0) {
        return true
      }
      return false
    },

    /**
     * Checks if all steps are completed
     * @returns Boolean
     */
    finished (): boolean {
      return (
        this.steps / this.totalSteps === 1 || this.resultCopy === 'finished'
      )
    },

    /**
     * Sums up all job runtimes
     * @returns total runtime
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
     * @returns Number (milliseconds)
     */
    finishTime (): number {
      let FinishedDate = 0
      if (this.finished) {
        return this.findLastDateTime(this.jobs as Job[])
      } else {
        return this.time
      }
    },

    /**
     * Gets started time
     * @returns Number (milliseconds)
     */
    startTime (): number {
      return this.findStartDateTime(this.jobs as Job[])
    }
  },
  methods: {
    toggleLogBox (): void {
     this.$emit('open-modal', this.project, this.comment) 
    },
    /**
     * emits finished when called
     */
    projectFinished (): void {
      this.$emit('finished', this.runtime)
    },

    /**
     * Searches data for last or running job date/time
     * @param jobs jobs of project
     * @returns Number finished date in ms
     */
    findLastDateTime (jobs: Job[]): number {
      let FinishedDate = 0
      jobs.forEach(job => {
        if (job.finished_date) {
          let CurrentJobDate = new Date(job.finished_date).getTime()
          if (FinishedDate < CurrentJobDate && !isNaN(FinishedDate)) {
            FinishedDate = CurrentJobDate
          }
        }
      })

      return FinishedDate
    },

    /**
     * Searches data for first job date/time
     * @param jobs jobs of project
     * @returns Number started date in ms
     */
    findStartDateTime (jobs: Job[]): number {
      let StartedDate = Infinity
      jobs.forEach(job => {
        if (job.started_date) {
          let CurrentJobDate = new Date(job.started_date).getTime()
          if (StartedDate > CurrentJobDate && !isNaN(StartedDate)) {
            StartedDate = CurrentJobDate
          }
        }
      })
      return StartedDate
    },

    /**
     * Comperator function for job sorting by time
     * @param Job1 first job
     * @param Job2 second job
     * @returns Number sort order
     */
    SortJobsByTime (Job1: Job, Job2: Job): number {
      const Job1StartedDate = Job1.started_date
      const Job1Type = typeof (Job1StartedDate)
      const Job2StartedDate = Job2.started_date
      const Job2Type = typeof (Job2StartedDate)

      if ((Job1StartedDate === '' && Job2StartedDate === '') || (Job1Type === undefined && Job2Type === undefined)) {
        return 0
      } else if ((Job1StartedDate !== '' && Job2StartedDate === '') || Job1Type === undefined) {
        return 1
      } else if ((Job2StartedDate !== '' && Job1StartedDate === '') || Job2Type === undefined) {
        return -1
      }

      const Job1Date = new Date(Job1StartedDate!).getTime()
      const Job2Date = new Date(Job2StartedDate!).getTime()

      if (Job1Date > Job2Date) {
        return 1
      } else if (Job1Date < Job2Date) {
        return -1
      } else return 0
    }
  }
})
</script>

<style scoped>
</style>
