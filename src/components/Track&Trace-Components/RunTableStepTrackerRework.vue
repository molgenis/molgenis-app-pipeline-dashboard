<template>
<div class="d-flex flex-column">
  <div class="d-flex justify-content-around w-100">
    <div class="step" id="demultiplexing">
        <font-awesome-icon :icon="demultiplexingIcon" :class="demultiplexingColor" size="2x" :spin="demultiplexingStatus === 'running'"></font-awesome-icon>
    </div>
    <div class="border rounded-pill flex-grow-1 align-self-center mr-2 ml-2 devider" :class="stepOneToTwoColor"></div>
    <div class="step" id="raw"><font-awesome-icon :icon="rawDataIcon" :class="rawDataColor" size="2x" :spin="rawDataStatus === 'running'"></font-awesome-icon></div>
    <div class="border rounded-pill flex-grow-1 align-self-center mr-2 ml-2 devider" :class="stepTwoToThreeColor"></div>
    <div class="step" id="running"><font-awesome-icon :icon="pipelinesIcon" :class="pipelinesColor" size="2x" :spin="pipelinesStatus === 'running'"></font-awesome-icon></div>
    <div class="border rounded-pill flex-grow-1 align-self-center mr-2 ml-2 devider" :class="stepThreeToFourColor"></div>
    <div class="step" id="results"><font-awesome-icon :icon="resultsDataIcon" :class="resultsDataColor" size="2x" :spin="resultsDataStatus === 'running'"></font-awesome-icon></div>
    <div class="border rounded-pill flex-grow-1 align-self-center mr-2 ml-2 devider" :class="stepFourToFiveColor"></div>
    <div class="step" id="finished"><font-awesome-icon :icon="finishedIcon" :class="finishedColor" size="2x"></font-awesome-icon></div>
  </div>
  <div class="d-flex pt-2  justify-content-center w-100">
    <div class="border rounded-pill pr-2 pl-2 pt-1 pb-1" :class="messageBorder">{{statusLabel}} {{message}}</div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

interface iconTypes {
  done: string[2]
  waiting: string[2]
  running: string[2]
  error: string[2]
  warning: string[2]
}
enum steps {
  demultiplexing = 0,
  rawData = 1,
  pipelines = 2,
  resultData = 3,
  finished = 4
}
enum stepStatus {
  waiting = 'waiting',
  running = 'running',
  error = 'error',
  warning = 'warning',
  finished = 'finished'
}
declare module 'vue/types/vue' {
  interface Vue {
    runningDemultiplexing: boolean
    rawDataCopy: boolean
    runningProjects: boolean
    resultDataCopy: boolean
    pipelineFinished: boolean
    iconTypes: iconTypes
  }
}
export default Vue.extend({
  name: 'step-tracker',
  data () {
    return {
      runningDemultiplexing: false,
      rawDataCopy: false,
      runningProjects: false,
      resultDataCopy: false,
      pipelineFinished: false,
      iconTypes: {
        done: ['fas', 'circle'],
        waiting: ['far', 'circle'],
        running: ['fas', 'sync-alt'],
        error: ['fas', 'exclamation-circle'],
        warning: ['fas', 'exclamation-circle']
      }
    }
  },
  props: {
    currentStep: {
      type: Number,
      required: false,
      default: 0
    },

    error: {
      type: Boolean,
      required: false,
      default: false
    },

    warning: {
      type: Boolean,
      required: false,
      default: false
    },

    started: {
      type: Boolean,
      required: false,
      default: true
    },

    customMessage: {
      type: String,
      required: false
    }
  },
  methods: {
    returnIcon (status: stepStatus): string[2] {
      switch (status) {
        case stepStatus.waiting:
          return this.iconTypes.waiting
        case stepStatus.running:
          return this.iconTypes.running
        case stepStatus.error:
          return this.iconTypes.error
        case stepStatus.warning:
          return this.iconTypes.warning
        default:
          return this.iconTypes.done
      }
    },
    returnColor (status: stepStatus): string {
      return status === stepStatus.waiting ? 'secondary' : this.error ? 'danger' : this.currentStep === 4 ? 'success' : this.warning ? 'warning' : 'primary'
    },
    checkStepStatus (step: number): stepStatus {
      if (this.currentStep < step) {
        return stepStatus.waiting
      }
      if (this.currentStep === step) {
        return this.error ? stepStatus.error : this.warning ? stepStatus.warning : stepStatus.running
      }
      return stepStatus.finished
    },
    getLineColor (status: stepStatus): string[] {
      if (status === stepStatus.waiting) {
        return []
      }
      const colorVariant = this.returnColor(status)
      return [`border-${colorVariant}`, `bg-${colorVariant}`]
    }
  },
  computed: {
    demultiplexingStatus (): stepStatus {
      return this.checkStepStatus(0)
    },
    demultiplexingIcon (): string[2] {
      return this.returnIcon(this.demultiplexingStatus)
    },
    demultiplexingColor (): string {
      return this.returnColor(this.demultiplexingStatus)
    },

    stepOneToTwoColor (): string[] {
      return this.getLineColor(this.rawDataStatus)
    },

    rawDataStatus (): stepStatus {
      return this.checkStepStatus(1)
    },
    rawDataIcon (): string[2] {
      return this.returnIcon(this.rawDataStatus)
    },
    rawDataColor (): string {
      return this.returnColor(this.rawDataStatus)
    },

    stepTwoToThreeColor (): string[] {
      return this.getLineColor(this.pipelinesStatus)
    },

    pipelinesStatus (): stepStatus {
      return this.checkStepStatus(2)
    },
    pipelinesIcon (): string[2] {
      return this.returnIcon(this.pipelinesStatus)
    },
    pipelinesColor (): string {
      return this.returnColor(this.pipelinesStatus)
    },

    stepThreeToFourColor (): string[] {
      return this.getLineColor(this.resultsDataStatus)
    },

    resultsDataStatus (): stepStatus {
      return this.checkStepStatus(3)
    },
    resultsDataIcon (): string[2] {
      return this.returnIcon(this.resultsDataStatus)
    },
    resultsDataColor (): string {
      return this.returnColor(this.resultsDataStatus)
    },

    stepFourToFiveColor (): string[] {
      return this.getLineColor(this.finishedStatus)
    },

    finishedStatus (): stepStatus {
      return this.currentStep === 4 ? stepStatus.finished : stepStatus.waiting
    },
    finishedIcon (): string[2] {
      return this.returnIcon(this.finishedStatus)
    },
    finishedColor () : string {
      return this.returnColor(this.finishedStatus)
    },

    message (): string {
      if (this.customMessage) {
        return this.customMessage
      }
      switch (this.currentStep) {
        case (steps.demultiplexing):
          return 'Demultiplexing'
        case (steps.rawData):
          return 'Copying raw data files'
        case (steps.pipelines):
          return 'Running pipelines'
        case (steps.resultData):
          return 'Copying result files'
        case (4):
          return 'Finished all workflow steps'
        default:
          return ''
      }
    },
    messageBorder (): string {
      if (this.currentStep === 4) {
        return 'border-success'
      }
      if (this.error) {
        return 'border-danger'
      }
      if (this.warning) {
        return 'border-warning'
      }
      if (this.currentStep >= 0) {
        return 'border-primary'
      }
      return 'border-secondary'
    },
    statusLabel (): string {
      if (this.currentStep === 4) {
        return 'Complete:'
      }
      if (this.error) {
        return 'Error while'
      }
      if (this.warning) {
        return 'Longer runtime while'
      }
      if (this.currentStep >= 0) {
        return 'In progress:'
      }

      return 'In Queue'
    }

  }

})
</script>

<style lang="scss" scoped>
@import 'bootstrap/scss/bootstrap';
@import 'bootstrap-vue/src/index.scss';

.success {
    color: $success;
}
.primary {
    color: $primary
}
.secondary {
    color: $gray-300
}
.warning {
    color: $warning
}
.danger {
    color: $danger
}
.step-label {
  z-index: 2;
  align-self: center;
  position: absolute;
  left: -10;
}

.devider {
  border-width: 3px !important;
  background-color: $gray-300
}
</style>
