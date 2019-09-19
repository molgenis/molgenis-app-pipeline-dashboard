<template>
    <div class="container">
        <ul class="progressbar" v-for="step in steps" :key="step">
            <li :class="getStepStatus(step)" class="text-center">
                <span class="progress-text"> 
                    {{step}}
                </span>
                    <b-spinner v-if="StepRunning(step) && !error" variant="primary" small/> 
                    <font-awesome-icon v-else-if="StepRunning(step) && error" icon="exclamation-circle"/> 
                    <font-awesome-icon v-else-if="StepComplete(step)" icon="check-circle"/>
            </li>
        </ul>
    </div>
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
        stepWidth: function () {
            return (100 / (this.steps.length)) + '%'
        }
    },
    methods: {
        getStepStatus(step) {
            if (this.steps[this.currentStep] === step) {
                if (!this.error) { 
                    return 'running'}
                else { 
                    return 'error'}
            } else {
                if (this.StepComplete(step)) {
                    return 'complete'
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
            return ((index < this.currentStep) && (!this.error))
        }
    }
}
</script>

<style lang="scss" scoped>

@import '../../../node_modules/bootstrap/scss/bootstrap';
@import '../../../node_modules/bootstrap-vue/src/index.scss';

.container {
    width: 100%;
}

.progressbar {
    counter-reset: step;

}

.progressbar li {
    list-style-type: none;
    width: 25%;
    float: left;
    font-size: 12px;
    position: relative;
    text-align: center;
    text-transform: uppercase;
    color: $secondary;
}

.progressbar li:before {
      width: 40px;
      height: 40px;
      content: '';
      line-height: 38px;
      border: 2px solid $secondary;
      display: block;
      text-align: center;
      margin: 0 auto 20px auto;
      border-radius: 50%;
      background-color: $light;
  }
  .progressbar li:after {
      width: 100%;
      height: 2px;
      content: '';
      position: absolute;
      background-color: $secondary;
      top: 19px;
      left: -50%;
      z-index: -1;
  }
  .progressbar li:first-child:after {
      content: none;
  }
  .progressbar li.complete {
      color: $success;
      
  }
  .progressbar li.complete:before {
      border-color: $success;
      background-color: $success;
  }
  .progressbar li.running {
      color: $primary;
  }
  .progressbar li.running:before {
      border-color: $primary;
      background-color: $primary;
  }
  .progressbar li.error {
      color: $danger;
  }
  .progressbar li.error:before {
      border-color: $danger;
      background-color: $danger;
  }
  .progressbar li.error:after {
      border-color: $danger;
  }

  .progressbar li.complete + li:after {
      background-color: $success;
  }

  .centre {
      position: middle;
  }
  .progress-text {
      vertical-align: middle;
  }
</style>