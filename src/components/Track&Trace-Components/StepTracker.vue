<template>
    <b-container class="container" fluid>
        <b-row class="progressbar" >
            <b-col v-for="step in steps" :key="step" :class="getStepStatus(step)" class="circle-container text-center align-middle">
                <div class="mx-auto">
                    <span class="progress-text"> 
                        {{step}}
                    </span>
                        <font-awesome-icon v-if="isFinalStep(step) && StepRunning(step) && !error" icon="check-circle"/>
                        <b-spinner v-else-if="StepRunning(step) && !error" variant="primary" small/> 
                        <font-awesome-icon v-else-if="StepRunning(step) && error" icon="exclamation-circle"/> 
                        <font-awesome-icon v-else-if="StepComplete(step) && !error" icon="check-circle"/>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    name: 'step-tracker',
    props: {
        steps: Array,
        currentStep: Number,
        error: Boolean
    },
    data () {
        return {
        }
    },
    computed: {
    },
    methods: {
        getStepStatus(step) {
            if (this.isFinalStep(step) && this.StepRunning(step)) {
                return 'complete'
            } else if (this.steps[this.currentStep] === step) {
                if (!this.error) { 
                    return 'running'}
                else { 
                    return 'error'}
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
        StepRunning(step) {
            return this.steps[this.currentStep] === step
        },

        StepComplete(step) {
            let index = this.steps.indexOf(step)
            
            return ((index < this.currentStep))
        },

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
      margin: 0 auto 5px auto;
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
