<template>
    <b-container>
        <b-row>
          <b-col class="text-center align-middle run_id p-1 m-2 font-weight-bold">
            {{runID}}
          </b-col>
        </b-row>
          <step-tracker :steps="['demultiplexing', 'rawcopy','running', 'resultcopy', 'finished']" :currentStep="currentStep" :error="containsError" class="mb-4"></step-tracker>
            <template v-for="project in projects">
                <project-row :key="project.project" :resultCopy="project.resultCopyStatus" :project="project.project" :jobs="project.jobs" :header="false" :runID="runID" :projectCount="projectCount" :time="time"></project-row>
            </template>
    </b-container>
</template>

<script>
import ProjectRow from './ProjectRow.vue'
import ProgressBar from './ProgressBar.vue'
import StepTracker from './StepTracker.vue'

export default {
    name: 'run-table',
    props: {
        showRun: String,
        runID: String,
        projects: Array,
        containsError: Boolean,
        currentStep: Number,
        projectCount: Number,
        time: Number,
        

    },
    components: {
        ProjectRow,
        ProgressBar,
        StepTracker
    }
}
</script>