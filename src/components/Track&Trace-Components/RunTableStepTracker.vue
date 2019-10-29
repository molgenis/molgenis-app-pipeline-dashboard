<template>
  <b-row class="progressbar" >
    <b-col
    v-for="(step, index) in steps"
    :key="step"
    :class="getStepStatus(step)"
    class="circle-container">
      <div class="container">
        <span class="d-none d-lg-block">
          {{step}}
        </span>
        <span class="d-lg-none">{{index + 1}}</span>
        <span>
          <template v-if="StepRunning(step)">
            <font-awesome-icon v-if="error" icon="exclamation-circle"/>
            <font-awesome-icon v-else-if="isFinalStep(step)" icon="check-circle"/>
            <font-awesome-icon v-else-if="warning" icon="exclamation-triangle"/>
            <b-spinner v-else variant="primary" small/>
          </template>
          <font-awesome-icon v-else-if="StepComplete(step) && !error" icon="check-circle"/>
        </span>
      </div>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'step-tracker',
  props: {
    steps: {
      type: Array,
      required: false,
      default: function (): string[] {
        return ['demultiplexing', 'rawcopy', 'running', 'resultcopy', 'finished']
      }
    },

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
    }
  },
  methods: {
    /**
     * Finds status of current step
     * @returns {String} status
     */
    getStepStatus (step: string): string {
      if (this.isFinalStep(step) && this.StepRunning(step)) {
        return 'complete'
      } else if (this.steps[this.currentStep] === step) {
        if (!this.started) {
          return ''
        }
        if (this.error) {
          return 'error'
        }
        if (this.warning) {
          return 'warning'
        }
        return 'running'
      } else {
        if (this.StepComplete(step)) {
          if (this.error) {
            return 'error'
          } else {
            return 'complete'
          }
        } else {
          return ''
        }
      }
    },
    /**
     * Checks if step is currently running
     * @param {String} step - step to check
     * 
     * @returns {Boolean}
     */
    StepRunning (step: string): boolean {
      return this.started && (this.steps[this.currentStep] === step)
    },
    /**
     * Checks if step has been completed
     * @param {String} step - step to check
     * 
     * @returns {Boolean}
     */
    StepComplete (step: string): boolean {
      return this.started && (this.getStepIndex(step) < this.currentStep)
    },
    /**
     * Checks if step is final step
     * @param {String} step - step to check
     * 
     * @returns {Boolean}
     */
    isFinalStep (step: string): boolean {
      return this.getStepIndex(step) === this.steps.length-1
    },
    /**
     * gets Step index
     * @param {String} step - Step to get index of
     * @returns {Number} index
     */
    getStepIndex (step: string): number {
      return this.steps.indexOf(step)
    }
  }
})
</script>

<style lang="scss" scoped>

@import 'bootstrap/scss/bootstrap';
@import 'bootstrap-vue/src/index.scss';

.progressbar {
  counter-reset: step;

}

.circle-container {
  list-style-type: none;
  float: left;
  font-size: 14px;
  text-align: center;
  text-transform: uppercase;
  color: $secondary;
}

.circle-container:before {
    width: 40px;
    height: 40px;
    content: '';
    line-height: 38px;
    border: 2px solid $secondary;
    display: block;
    text-align: center;
    margin: 0 auto 10px auto;
    border-radius: 50%;
    background-color: $light;
}

.circle-container:first-child:after {
    content: none;
}
.circle-container.warning {
    color: $warning
}

.circle-container.warning::before {
  border-color: $warning;
  background-color: $warning;
}
.circle-container.complete {
    color: $success;
}
.circle-container.complete:before {
    border-color: $success;
    background-color: $success;
}
.circle-container.running {
    color: $primary;
}
.circle-container.running:before {
    border-color: $primary;
    background-color: $primary;
}
.circle-container.error {
    color: $danger;
}
.circle-container.error:before {
    border-color: $danger;
    background-color: $danger;
}
.circle-container.error:after {
    border-color: $danger;
}

.circle-container li.complete + li:after {
    background-color: $success;
}

.centre {
    position: middle;
}
.progress-text {
    vertical-align: middle;
}
</style>
