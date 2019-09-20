<template>
    <b-table-simple fixed borderless small>
          <colgroup><col></colgroup>
          <colgroup><col><col></colgroup>
          <colgroup><col></colgroup>
        <b-tbody>
        <b-tr>
          <b-th colspan="4" class="text-center align-middle run_id">
            {{runID}}
          </b-th>
        </b-tr>
        <b-tr>
          <b-td colspan="4">
            <step-tracker :steps="['demultiplexing', 'running', 'copying', 'finished']" :currentStep="currentStep" :error="containsError"></step-tracker>
          </b-td>
        </b-tr>
        <template v-for="(project, index) in projects">
          <project-row :key="project.project" :project="project.project" :jobs="project.jobs" :header="false" :runID="runID" :projectCount="projectCount" :time="time"></project-row>
        </template>
        </b-tbody>
    </b-table-simple>
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