<template>
    <b-container class="mb-3 h-100 overflow-auto">
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
              :threshold="getThreshold(project)"
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
import { ProjectObject, pipelineType } from '@/types/dataTypes.ts'

declare module 'vue/types/vue' {
  interface Vue {
    warning: boolean
    selectedProject: string
    comment: string
    projects: ProjectObject[]
    thresholdOnco: number
    thresholdExoom: number
    thresholdPcs: number
    thresholdSvp: number
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
      type: Object,
      required: true
    },

    API: {
      type: String,
      required: true
    },

    thresholdExoom: {
      type: Number,
      required: false,
      default: 15
    },

    thresholdPcs: {
      type: Number,
      required: false,
      default: 15
    },

    thresholdSvp: {
      type: Number,
      required: false,
      default: 15
    },

    thresholdOnco: {
      type: Number,
      required: false,
      default: 15
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
     * @param {Boolean} warning - warning status to set
     */
    setRunWarning (warning: boolean): void {
      this.warning = warning
    },
    /**
     * opens the modal for the project
     * @param {String} project - project to comment
     * @param {String} comment - project comment content
     * 
     * @returns {void}
     */
    openModal(project: string, comment: string): void {
      this.selectedProject = project
      this.comment = comment
      this.$bvModal.show('comment-modal')
    },
    /**
     * emtis a comment update
     * @param {String} project - project to update
     * @param {String} comment - content
     * 
     * @emits 'comment-update'
     * @returns {void}
     */
    emitComment(project: string, comment: string): void {
      this.$emit('comment-update', project, comment)
    },
    /**
     * Updates the stored comment to prevent comment update errors
     * @param {String} project - project comment to update
     * @param {String} comment - comment change
     * 
     * @returns {void}
     */
    updateLocalComment(project: string, comment: string): void {
      for (let i = 0; i < this.projects.length; i++) {
        if (this.projects[i].project === project){
          this.projects[i].Comment = comment
          break
        }
      }
    },
    /**
     * Gets the correct threshold for each pipeline type
     * @param {ProjectObject} project - project
     * 
     * @returns {Number} threshold number
     */
    getThreshold(project: ProjectObject): number {
      switch (project.type) {
        case pipelineType.ONCO:
          return this.thresholdOnco
        case pipelineType.Exoom:
          return this.thresholdExoom
        case pipelineType.PCS:
          return this.thresholdPcs
        case pipelineType.SVP:
          return this.thresholdSvp
        default:
          return 15
      }
    }
  },
  computed: {
  },
  watch: {
    /**
     * resets warning if new run is selected
     * 
     * @returns {void}
     */
    runID: function (): void {
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

.minH {
  min-height: 100%
}
</style>
