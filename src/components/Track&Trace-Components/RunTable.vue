<template>
    <b-container>
        <b-row>
          <b-col class="text-center align-middle run_id p-1 m-2 font-weight-bold">
            {{runID}}
          </b-col>
        </b-row>
          <step-tracker :steps="['demultiplexing', 'rawcopy','running', 'resultcopy', 'finished']" :warning="warning" :currentStep="currentStep" :error="containsError" class="mb-4" :started="demultiplexing"></step-tracker>
            <template v-for="project in projects">
                <run-table-project @project-warning="toggleRunWarning" :threshold="timeThreshold" :key="project.project" :resultCopy="project.resultCopyStatus" :project="project.project" :jobs="project.jobs" :header="false" :runID="runID" :projectCount="projectCount" :time="time"/>
            </template>
    </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import RunTableProject from './RunTableProject.vue'
import ProgressBar from './ProgressBar.vue'
import StepTracker from './RunTableStepTracker.vue'

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
  }
})
</script>
