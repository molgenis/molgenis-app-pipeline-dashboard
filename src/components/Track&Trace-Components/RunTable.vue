<template>
    <b-container class="mb-3">
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
          :started="demultiplexing"
          class="mb-4">
          </step-tracker>
          <template v-for="project in projects">
              <run-table-project
              @project-warning="setRunWarning"
              @open-modal="openModal"
              :currentWarningStatus="warning"
              :running="currentStep >= 2"
              :threshold="timeThreshold"
              :key="project.project"
              :resultCopy="project.resultCopyStatus"
              :project="project.project"
              :jobs="project.jobs" :header="false"
              :runID="runID"
              :projectCount="projectCount"
              :time="time"
              :comment="project.Comment"
              class="project-row">
              </run-table-project>
          </template>
          
          <comment-modal
          :Run="selectedProject"
          :comment="comment"
          :API="API"
          :headers="headers"
          @comment-update="emitComment"></comment-modal>
    </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import RunTableProject from '@/components/Track&Trace-Components/RunTableProject.vue'
import CommentModal from '@/components/Track&Trace-Components/RunTableCommentModal.vue'
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
    },

    headers: {
      type: Headers,
      required: true
    },

    API: {
      type: String,
      required: true
    }

  },
  data () {
    return {
      warning: false,
      selectedProject: '',
      comment: ''
    }
  },
  components: {
    RunTableProject,
    StepTracker,
    CommentModal
  },
  methods: {
    setRunWarning (warning: boolean): void {
      this.warning = warning
    },
    openModal(project: string, comment: string) {
      this.selectedProject = project
      this.comment = comment
      this.$bvModal.show('comment-modal')
    },
    emitComment(project, comment) {
      this.$emit('comment-update', project, comment)
    }
  },
  computed: {
  },
  watch: {
    runID: function (old: any, newID: any): void {
      this.warning = false
    } 
  }
})
</script>

<style lang="scss" scoped>
@import 'bootstrap/scss/bootstrap';
@import 'bootstrap-vue/src/index.scss';
.project-row:hover{
  background-color: $light
}
</style>
