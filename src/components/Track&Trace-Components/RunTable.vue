<template>
    <b-container class="mb-3 h-100 d-flex flex-column m-0 p-0 justify-content-around" fluid>
          <div class="d-flex justify-content-center align-items-center">
            <h4 class="m-0 p-0">{{parsedRunID}}</h4>
          </div>
          <div class="flex-schrink-1 pr-2 pl-2">
            <step-tracker
              :warning="warning"
              :currentStep="currentStep"
              :error="containsError"
              :started="demultiplexing"
              class="mb-4">
            </step-tracker>
          </div>
          <b-container class=" d-flex flex-column d-flex-shrink-1 p-1 overflow-vertical" fluid>
          <div v-for="project in projects" :key="project.projectID" class="pt-0 pb-0 mt-0 mb-0 flex-shrink-1 mpx">
              <run-table-project
                @project-warning="setRunWarning"
                @open-modal="openModal"
                :currentWarningStatus="warning"
                :running="currentStep === 2"
                :key="project.projectID"
                :resultCopy="project.resultCopyStatus"
                :project="project.projectID"
                :jobs="project.jobs" :header="false"
                :projectDates="projectDates[project.projectID]"
                :runID="runID"
                :projectCount="projectCount"
                :time="time"
                :comment="project.comment"

                class="project-row p-0 mb-0">
              </run-table-project>
          </div>
          </b-container>

          <comment-modal
            :run="selectedProject"
            :comment="comment"
            :samples="samples">
          </comment-modal>
    </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import RunTableProject from '@/components/Track&Trace-Components/RunTableProject.vue'
import CommentModal from '@/components/Track&Trace-Components/RunTableCommentModal.vue'
import StepTracker from '@/components/Track&Trace-Components/RunTableStepTracker.vue'
import { Sample } from '@/types/dataTypes.ts'
import { ProjectData } from '@/types/Run'
import { mapState, mapActions } from 'vuex'

declare module 'vue/types/vue' {
  interface Vue {
    warning: boolean;
    selectedProject: string;
    comment: string;
    projects: ProjectData[];
    thresholdOnco: number;
    thresholdExoom: number;
    thresholdPcs: number;
    thresholdSvp: number;
    samples: Sample[];
    loadedProjectInfo: Record<string, {comment: string; samples: Sample[]}>;
    getExtraProjectInfo(projectID: string): Promise<void>;

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
      modalLoading: true
    }
  },
  components: {
    RunTableProject,
    StepTracker,
    CommentModal
  },
  methods: {
    ...mapActions([
      'getExtraProjectInfo'
    ]),
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
    openModal (project: string): void {
      this.selectedProject = ''
      this.modalLoading = true
      this.getExtraProjectInfo(project).then(() => {
          this.modalLoading = false
          this.selectedProject = project
          this.$bvModal.show('comment-modal')
        }).catch(() => {
          this.$bvToast.toast('Loading of extra project infromation failed', {
            title: 'Request failed',
            variant: 'danger',
            toaster: 'b-toaster-bottom-right'
          })
      })
    },

    /**
     * emtis a comment update
     * @param {String} project - project to update
     * @param {String} comment - content
     *
     * @emits 'comment-update'
     * @returns {void}
     */
    emitComment (project: string, comment: string): void {
      this.$emit('comment-update', project, comment)
    },

    /**
     * Updates the stored comment to prevent comment update errors
     * @param {String} project - project comment to update
     * @param {String} comment - comment change
     *
     * @returns {void}
     */
    updateLocalcomment (project: string, comment: string): void {
      this.loadedProjectInfo[project] ? this.loadedProjectInfo[project].comment = comment : this.loadedProjectInfo[project] = {samples: [], comment: comment}
    }
  },
  computed: {
    ...mapState([
      'projectDates',
      'loadedProjectInfo'
    ]),
    /**
     * Removes undersoces and dashes to display as title
     */
    parsedRunID (): string {
      return this.runID.replace(/_/g, ' ').replace(/-/g, ', ')
    },
    /**
     * returns the loaded comment
     */
    comment(): string {
      
      const loadedInfo = this.loadedProjectInfo[this.selectedProject]
      return loadedInfo ? loadedInfo.comment : ''
    },
    /**
     * returns the loaded samples
     */
    samples(): Sample[] {
      const loadedInfo = this.loadedProjectInfo[this.selectedProject]
      return loadedInfo ? loadedInfo.samples : [] as Sample[]
    }
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
.mpx {
  margin-top: 0.1px;
  margin-bottom: 0.1px;
}
.margin-lesspixel-left-right {
  margin-left: 0.5px;
  margin-right: 0.5px;
}
.project-row:hover {
  background-color: $light;
}
.overflow-vertical {
  overflow-y: auto;
  overflow-x: hidden;
}

.minH {
  min-height: 100%
}

h4 {
  font-size: 2vw;
}
</style>
