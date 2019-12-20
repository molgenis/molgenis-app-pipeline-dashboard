<template>
<div class="d-flex flex-column">
  <div class="d-flex justify-content-around w-100">
    <div class="step" id="demultiplexing">
        <font-awesome-icon class="step-icon" :icon="demultiplexingIcon" :class="demultiplexingColor" size="2x" :spin="demultiplexingStatus === 'running'"></font-awesome-icon>
    </div>
    <div class="status-line border rounded-pill flex-grow-1 align-self-center mr-2 ml-2 devider" :class="stepOneToTwoColor"></div>
    <div class="step" id="raw"><font-awesome-icon class="step-icon" :icon="rawDataIcon" :class="rawDataColor" size="2x" :spin="rawDataStatus === 'running'"></font-awesome-icon></div>
    <div class="status-line border rounded-pill flex-grow-1 align-self-center mr-2 ml-2 devider" :class="stepTwoToThreeColor"></div>
    <div class="step" id="running"><font-awesome-icon class="step-icon" :icon="pipelinesIcon" :class="pipelinesColor" size="2x" :spin="pipelinesStatus === 'running'"></font-awesome-icon></div>
    <div class="status-line border rounded-pill flex-grow-1 align-self-center mr-2 ml-2 devider" :class="stepThreeToFourColor"></div>
    <div class="step" id="results"><font-awesome-icon class="step-icon" :icon="resultsDataIcon" :class="resultsDataColor" size="2x" :spin="resultsDataStatus === 'running'"></font-awesome-icon></div>
    <div class="status-line border rounded-pill flex-grow-1 align-self-center mr-2 ml-2 devider" :class="stepFourToFiveColor"></div>
    <div class="step" id="finished"><font-awesome-icon class="step-icon" :icon="finishedIcon" :class="finishedColor" size="2x"></font-awesome-icon></div>
  </div>
  <div class="d-flex pt-2  justify-content-center w-100">
    <div class="border rounded-pill pr-2 pl-2 pt-1 pb-1 message" :class="messageBorder">{{statusLabel}} {{message}}</div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

interface IconTypes {
  done: string[2];
  waiting: string[2];
  running: string[2];
  error: string[2];
  warning: string[2];
}
enum steps {
  demultiplexing,
  rawData,
  pipelines,
  resultData,
  finished,
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
    runningDemultiplexing: boolean;
    rawDataCopy: boolean;
    runningProjects: boolean;
    resultDataCopy: boolean;
    pipelineFinished: boolean;
    iconTypes: IconTypes;
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
    /**
     * retruns the correct fontawesome icon for each stepStatus type
     * @param status - stepStatus type
     * 
     * @returns {['fontawesome-package', 'icon-id']}
     */
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
    /**
     * returns the correct color for each stepStatus type
     * @param status - stepStatus type
     */
    returnColor (status: stepStatus): string {
      return status === stepStatus.waiting ? 'secondary' : this.error ? 'danger' : this.currentStep === 4 ? 'success' : this.warning ? 'warning' : 'primary'
    },
    /**
     * returns the correct stepStatus type
     * @param step - current step
     */
    checkStepStatus (step: number): stepStatus {
      if (this.currentStep < step) {
        return stepStatus.waiting
      }
      if (this.currentStep === step) {
        return this.error ? stepStatus.error : this.warning ? stepStatus.warning : stepStatus.running
      }
      return stepStatus.finished
    },
    /**
     * returns the correct border colors and background variants
     * @param status - stepStatus Type
     * 
     * @returns {['border-color-class', 'background-color-class']}
     */
    getLineColor (status: stepStatus): string[] {
      if (status === stepStatus.waiting) {
        return []
      }
      const colorVariant = this.returnColor(status)
      return [`border-${colorVariant}`, `bg-${colorVariant}`]
    }
  },
  computed: {
    /**
     * returns the current demultiplexing status
     * 
     * @returns {stepStatus}
     */
    demultiplexingStatus (): stepStatus {
      return this.checkStepStatus(0)
    },
    /**
     * returns the correct demultiplexing icon
     * running, finished, waiting
     */
    demultiplexingIcon (): string[2] {
      return this.returnIcon(this.demultiplexingStatus)
    },
    /**
     * returns the correct demultiplexing color
     * running: primary, Error: danger, Warning: warning, waiting: secondary, Finished: success
     */
    demultiplexingColor (): string {
      return this.returnColor(this.demultiplexingStatus)
    },
    /**
     * determines the color of the line between step one and step two
     */
    stepOneToTwoColor (): string[] {
      return this.getLineColor(this.rawDataStatus)
    },
    /**
     * returns the current raw data copy status
     * 
     * @returns {stepStatus}
     */
    rawDataStatus (): stepStatus {
      return this.checkStepStatus(1)
    },
    /**
     * returns the correct raw data copy icon
     * running, finished, waiting
     */
    rawDataIcon (): string[2] {
      return this.returnIcon(this.rawDataStatus)
    },
    /**
     * returns the correct raw data copy color
     * running: primary, Error: danger, Warning: warning, waiting: secondary, Finished: success
     */
    rawDataColor (): string {
      return this.returnColor(this.rawDataStatus)
    },
    /**
     * determines the color of the line between step tow and step three
     */
    stepTwoToThreeColor (): string[] {
      return this.getLineColor(this.pipelinesStatus)
    },
    /**
     * returns the current pipline Running status
     * 
     * @returns {stepStatus}
     */
    pipelinesStatus (): stepStatus {
      return this.checkStepStatus(2)
    },
    /**
     * returns the correct pipeline running icon
     * running, finished, waiting
     */
    pipelinesIcon (): string[2] {
      return this.returnIcon(this.pipelinesStatus)
    },
    /**
     * returns the correct pipeline running color
     * running: primary, Error: danger, Warning: warning, waiting: secondary, Finished: success
     */
    pipelinesColor (): string {
      return this.returnColor(this.pipelinesStatus)
    },

    stepThreeToFourColor (): string[] {
      return this.getLineColor(this.resultsDataStatus)
    },
    /**
     * returns the current results data copy status
     * 
     * @returns {stepStatus}
     */
    resultsDataStatus (): stepStatus {
      return this.checkStepStatus(3)
    },
    /**
     * returns the correct results data copy icon
     * running, finished, waiting
     */
    resultsDataIcon (): string[2] {
      return this.returnIcon(this.resultsDataStatus)
    },
    /**
     * returns the correct results data copy color
     * running: primary, Error: danger, Warning: warning, waiting: secondary, Finished: success
     */
    resultsDataColor (): string {
      return this.returnColor(this.resultsDataStatus)
    },

    stepFourToFiveColor (): string[] {
      return this.getLineColor(this.finishedStatus)
    },
    /**
     * returns the run finished status
     * 
     * @returns {stepStatus}
     */
    finishedStatus (): stepStatus {
      return this.currentStep === 4 ? stepStatus.finished : stepStatus.waiting
    },
    /**
     * returns the correct finished icon
     * finished, waiting
     */
    finishedIcon (): string[2] {
      return this.returnIcon(this.finishedStatus)
    },
    /**
     * returns the correct finished color
     * waiting: secondary, Finished: success
     */
    finishedColor (): string {
      return this.returnColor(this.finishedStatus)
    },
    /**
     * Returns the assigned step message, and can be extended with an custom message
     */
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
    /**
     * returns the border color of the displayed message
     */
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
    /**
     * Retruns the label for the message
     */
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
  border-width: 0.2vw !important;
  background-color: $gray-300
}

.step-icon {
  height: 2vw;
  width: 2vw;
}

.message {
  font-size: 1vw;
  border-width: 0.1vw !important;
}

</style>
