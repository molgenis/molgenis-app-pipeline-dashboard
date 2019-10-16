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
              :running="currentStep === 2"
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
          @comment-updated="updateLocalComment"></comment-modal>
    </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import RunTableProject from '@/components/Track&Trace-Components/RunTableProject.vue'
import CommentModal from '@/components/Track&Trace-Components/RunTableCommentModal.vue'
import ProgressBar from '@/components/Track&Trace-Components/ProgressBar.vue'
import StepTracker from '@/components/Track&Trace-Components/RunTableStepTracker.vue'
import { ProjectObject } from '@/types/dataTypes.ts'

declare module 'vue/types/vue' {
  interface Vue {
    warning: boolean
    selectedProject: string
    comment: string
    projects: ProjectObject[]
  }

}

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
    /**
     * sets Warning status for run
     * @param warning warning status to set
     */
    setRunWarning (warning: boolean): void {
      this.warning = warning
    },
    /**
     * opens the modal for the project
     * @param project project to comment
     * @param comment project comment content
     */
    openModal(project: string, comment: string) {
      this.selectedProject = project
      this.comment = comment
      this.$bvModal.show('comment-modal')
    },
    /**
     * emtis a comment update
     * @param project project to update
     * @param comment content
     */
    emitComment(project, comment) {
      this.$emit('comment-update', project, comment)
    },
    updateLocalComment(project, comment) {
      console.log('update:', project)
      for (let i = 0; i < this.projects.length; i++) {
        if (this.projects[i].project === project){
          this.projects[i].Comment = comment
          break
        }
      }
    }
  },
  computed: {
  },
  watch: {
    /**
     * resets warning if new run is selected
     */
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
