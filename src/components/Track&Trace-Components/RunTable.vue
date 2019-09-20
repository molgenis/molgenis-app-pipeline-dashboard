<template>
    <b-container>
        <b-row>
          <b-col class="text-center align-middle run_id">
            {{runID}}
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <step-tracker :steps="['demultiplexing', 'running', 'copying', 'finished']" :currentStep="currentStep" :error="containsError"></step-tracker>
          </b-col>
        </b-row>
            <template v-for="(project, index) in projects">
              <b-col :key="project.projects">
                <project-row :key="project.project" :project="project.project" :jobs="project.jobs" :header="false" :runID="runID" :projectCount="projectCount" :time="time"></project-row>
              </b-col>
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
        currentStep: String,
        projectCount: Number,
        time: Number

    },
    components: {
        ProjectRow,
        ProgressBar,
        StepTracker
    }
}
</script>