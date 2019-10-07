<template>
<b-row>
  <b-col class="text-center text-truncate">{{project}}</b-col>
  <b-col class="text-center">
    <status-icon :status="status" />
  </b-col>
    <b-col class="text-center">
      <project-timer :startTime="startTime" :started="started" :finishTime="finishTime"></project-timer>
    </b-col>
    <b-col class="d-flex align-items-center justify-content-center">
      <progress-bar
        class="w-100 mt-1"
        :variant="variant"
        :step="steps"
        :totalSteps="totalSteps"
        :HasNoWarning="HasNoWarning"
        :error="false"
        :animated="true"
      ></progress-bar>
    </b-col>
  </b-row>
</template>

<script>
import progressBar from './ProgressBar.vue'
import ProjectTimer from './ProjectTimer.vue'
import StatusIcon from './StatusIcon.vue'

export default {
  name: 'project',
  props: {
    header: {
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
      required: true
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
  computed: {
    /**
     * Check for long runtime
     */
    HasNoWarning: function () {
      const warning = this.thresholdToMs > this.finishTime - this.startTime
      if (warning) {
        this.$emit('project-warning', warning)
      }
      return warning
    },
    /**
     * Converts average hours to milliseconds for timer
     * @returns Number
     */
    thresholdToMs: function () {
      return this.threshold * 3600 * 1000
    },

    /**
     * Filters jobs that are not completed sorted by start date
     * @returns Array
     */
    remainingJobs: function () {
      return this.jobs
        .filter(function (job) {
          return job.status !== 'finished'
        })
        .sort(this.SortJobsByTime)
    },

    /**
     * calculates finished step count
     * @returns Number
     */
    steps: function () {
      return this.jobs.filter(function (job) {
        return job.status === 'finished'
      }).length
    },

    /**
     * Calculates total step count for completion
     * @returns Number
     */
    totalSteps: function () {
      return this.jobs.length
    },

    /**
     * Finds status of project and sets variant
     * @returns String
     */
    status: function () {
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

    variant: function () {
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
    started: function () {
      const startedJobs = this.jobs.filter(function (job) {
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
    finished: function () {
      return (
        this.steps / this.totalSteps === 1 || this.resultCopy === 'finished'
      )
    },

    /**
     * Sums up all job runtimes
     * @returns total runtime
     */
    runtime: function () {
      let runtime = 0
      jobs.forEach(job => {
        if (job.StartedDate && job.FinishedDate) {
          runtime += new Date(job.FinishedDate) - new Date(job.StartedDate)
        }
      })
      return runtime
    },

    /**
     * Gets finished time, if not finished returns now()
     * @returns Number (milliseconds)
     */
    finishTime: function () {
      let FinishedDate = 0
      if (this.finished) {
        return this.findLastDateTime(this.jobs)
      } else {
        return this.time
      }
    },

    /**
     * Gets started time
     * @returns Number (milliseconds)
     */
    startTime: function () {
      return this.findStartDateTime(this.jobs)
    }
  },
  methods: {
    /**
     * emits finished when called
     */
    projectFinished () {
      this.$emit('finished', this.runtime)
    },

    /**
     * Searches data for last or running job date/time
     * @param jobs jobs of project
     * @returns Number finished date in ms
     */
    findLastDateTime (jobs) {
      let FinishedDate = 0
      jobs.forEach(job => {
        let CurrentJobDate = new Date(job.finished_date).getTime()
        if (FinishedDate < CurrentJobDate && !isNaN(FinishedDate)) {
          FinishedDate = CurrentJobDate
        }
      })

      return FinishedDate
    },

    /**
     * Searches data for first job date/time
     * @param jobs jobs of project
     * @returns Number started date in ms
     */
    findStartDateTime (jobs) {
      let StartedDate = Infinity
      jobs.forEach(job => {
        let CurrentJobDate = new Date(job.started_date).getTime()
        if (StartedDate > CurrentJobDate && !isNaN(StartedDate)) {
          StartedDate = CurrentJobDate
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
    SortJobsByTime (Job1, Job2) {
      const Job1StartedDate = Job1.StartedDate
      const Job2StartedDate = Job2.StartedDate

      if (Job1StartedDate === '' && Job2StartedDate === '') {
        return 0
      } else if (Job1StartedDate !== '' && Job2StartedDate === '') {
        return 1
      } else if (Job2StartedDate !== '' && Job1StartedDate === '') {
        return -1
      }

      const Job1Date = new Date(Job1StartedDate).getTime()
      const Job2Date = new Date(Job2StartedDate).getTime()

      if (Job1Date > Job2Date) {
        return 1
      } else if (Job1Date < Job2Date) {
        return -1
      } else return 0
    }
  }
}
</script>

<style scoped>
</style>
