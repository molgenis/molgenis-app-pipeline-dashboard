<template>
    <b-container>
        <b-row>
          <b-col class="text-center align-middle run_id p-1 m-2 font-weight-bold text-truncate">
            {{runID}}
          </b-col>
        </b-row>
          <step-tracker 
          :steps="['demultiplexing', 'raw data copy','running', 'results data copy', 'finished']" 
          :warning="warning" 
          :currentStep="currentStep" 
          :error="containsError" 
          class="mb-4" 
          :started="demultiplexing">
          </step-tracker>
          <template v-for="project in projects">
              <run-table-project 
              @project-warning="setRunWarning" 
              :currentWarningStatus="warning" 
              :running="currentStep >= 2" 
              :threshold="timeThreshold" 
              :key="project.project" 
              :resultCopy="project.resultCopyStatus" 
              :project="project.project" 
              :jobs="project.jobs" :header="false" 
              :runID="runID" 
              :projectCount="projectCount" 
              :time="time"/>
          </template>
    </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import RunTableProject from '@/components/Track&Trace-Components/RunTableProject.vue'
import ProgressBar from '@/components/Track&Trace-Components/ProgressBar.vue'
import StepTracker from '@/components/Track&Trace-Components/RunTableStepTracker.vue'

export default Vue.extend({
  name: 'run-table',
  props: {
    runID: {
      type: String,
      required: true
    },

    projects: {
      type: Array,
      required: true
    },

    containsError: {
      type: Boolean,
      required: false,
      default: false
    },

    currentStep: {
      type: Number,
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

    demultiplexing: {
      type: Boolean,
      required: true
    },

    timeThreshold: {
      type: Number,
      required: false,
      default: 15
    }

  },
  data () {
    return {
      warning: false
    }
  },
  components: {
    RunTableProject,
    StepTracker
  },
  methods: {
    setRunWarning (warning: boolean): void {
      this.warning = warning
    }
  },
  watch: {
    runID(): void {
      this.warning = false
    }
  }
  
}) 
</script>
