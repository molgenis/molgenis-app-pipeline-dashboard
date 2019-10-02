<template>
        <b-row class="progressbar" >
            <b-col v-for="step in steps" :key="step" :class="getStepStatus(step)" class="circle-container ">
                <div class="container">
                    <span class=""> 
                        {{step}}
                    </span>
                    <span>
                        <font-awesome-icon v-if="isFinalStep(step) && StepRunning(step) && !error" icon="check-circle"/>
                        <b-spinner v-else-if="StepRunning(step) && !error" variant="primary" small/> 
                        <font-awesome-icon v-else-if="StepRunning(step) && error" icon="exclamation-circle"/> 
                        <font-awesome-icon v-else-if="StepComplete(step) && !error" icon="check-circle"/>
                    </span>
                </div>
                
            </b-col>
        </b-row>
</template>

<script>
export default {
    name: 'step-tracker',
    props: {
        steps: {
            type: Array,
            required: false,
            default: ['demultiplexing', 'rawcopy','running', 'resultcopy', 'finished']
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

        started: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    methods: {
        /**
         * Finds status of current step
         * @returns String status
         */
        getStepStatus(step) {
            if (this.isFinalStep(step) && this.StepRunning(step)) {
                return 'complete'
            } else if (this.steps[this.currentStep] === step) {
                if (!this.started) {
                    return ''
                }
                if (!this.error) { 
                    return 'running'
                }
                    return 'error'
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
         * @param step String 
         * @returns Boolean
         */
        StepRunning(step) {
            if (!this.started) {
                return false
            }
            return this.steps[this.currentStep] === step
        },
        /**
         * Checks if step has been completed
         * @returns Boolean
         */
        StepComplete(step) {
            let index = this.steps.indexOf(step)
            if (!this.started) {
                return false
            }
            
            return ((index < this.currentStep))
        },
        /**
         * Checks if step is final step
         * @returns Boolean
         */
        isFinalStep(step) {
            let index = this.steps.indexOf(step)
            return (step === this.steps.slice(-1)[0])
        }
    }
}
</script>

<style lang="scss" scoped>

@import '../../../node_modules/bootstrap/scss/bootstrap';
@import '../../../node_modules/bootstrap-vue/src/index.scss';

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
