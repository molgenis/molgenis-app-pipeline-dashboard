<template>
<b-tr :variant="collumnVariant">
  <b-td>{{ run.run_id }}</b-td>
  <b-td>{{ run.pipeline }}</b-td>
  <b-td>
    <progress-bar v-bind:step="completedStepCount" v-bind:totalSteps="totalSteps" v-bind:finished="runFinished"></progress-bar>
  </b-td>
  <b-td>{{ currentStep }}</b-td>
  <b-td>{{ runStatus }}</b-td>
  <b-td>03:22:12</b-td>
  <b-td>03:22:12</b-td>
</b-tr>
</template>

<script>
import ProgressBar from './ProgressBar.vue'

export default {
  name: 'run-item',
  props: {
    run: Object
  },
  components: {
    ProgressBar
  },
  computed: {
    /**
     * The collumn color to use for item
     * @returns String
     */
    collumnVariant: function (){
      switch (this.runStatus){
        case 'Finished':
          return 'success'
          break
        case 'Running':
          return 'info'
          break
        case 'Waiting':
          return 'secondary'
          break
        case 'Not ready':
          return 'warning'
          break
        case 'Error':
          return 'danger'
          break
        default:
          return 'light'
      }
    },
    /**
     * filters all completed pipeline steps
     * @returns Array
     */
    completedSteps: function () {
      return this.run.jobs.filter(function (x) {return x.status === 'finished'})
    },
    /**
     * Calculates step that is currently running
     * @returns String
     */
    currentStep: function () {
      if (this.runStatus !== 'Not ready'){
        let notFinished = this.run.jobs
        .filter(function (x) {return x.status !== 'finished'})
        .sort(function (x) {return x.job})
      
        if (notFinished.length !== 0) {
          return notFinished.slice(0)[0].step
        } else {
          return this.run.jobs.slice(-1)[0].step
        }
      } else {
        return 'No steps loaded'
      }
    },
    /**
     * Gets total step count for run
     * @returns Number
     */
    totalSteps: function () {
      return this.run.jobs.length
    },
    /**
     * Gets completed step count
     * @returns Number
     */
    completedStepCount: function () {
      return this.completedSteps.length
    },
    /**
     * Determines if the run is finished
     * @returns Boolean
     */
    runFinished: function() {
      return this.completedStepCount/this.totalSteps === 1
    },
    /**
     * Determines if there was an error while running
     * @returns Boolean
     * @todo no error reporting in database yet
     */
    runError: function () {
      return false
    },
    /**
     * Determines the run status
     * @returns String
     */
    runStatus: function () {
      if (this.runFinished) {
        return 'Finished'
      } else if (this.runError) {
        return 'Error'
      } else if (this.totalSteps === 0) {
        return 'Not ready'
      } else if (this.completedStepCount === 0) {
        return 'Waiting'
      } else {
        return 'Running'
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
