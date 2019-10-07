<template>
    <b-container>
        <b-row>
          <b-col class="text-center align-middle run_id p-1 m-2 font-weight-bold">
            {{runID}}
          </b-col>
        </b-row>
          <step-tracker :steps="['demultiplexing', 'rawcopy','running', 'resultcopy', 'finished']" :currentStep="currentStep" :error="containsError" class="mb-4" :started="demultiplexing"></step-tracker>
            <template v-for="project in projects">
                <run-table-project :key="project.project" :resultCopy="project.resultCopyStatus" :project="project.project" :jobs="project.jobs" :header="false" :runID="runID" :projectCount="projectCount" :time="time"/>
            </template>
    </b-container>
</template>

<script>
import RunTableProject from './RunTableProject.vue'
import ProgressBar from './ProgressBar.vue'
import StepTracker from './RunTableStepTracker.vue'

export default {
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
    }

  },
  components: {
    RunTableProject,
    StepTracker
  }
}
</script>
