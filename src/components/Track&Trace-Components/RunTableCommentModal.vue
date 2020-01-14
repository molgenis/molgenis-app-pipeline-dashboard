<template>
<b-container fluid>
  <b-modal
      id="comment-modal"
      ref="modal"
      size="xl"
      :title="run"
      hide-footer
      :static="false"
    >
    <b-row>
      <b-col cols="6">
        <h5>Project Log</h5>
        <form ref="form">
          <b-form-group>
            <b-form-textarea
              id="textinput"
              v-model="localComment"
              placeholder="Comment..."
              rows="30"
              max-rows="30"
              :state="rejected ? false : undefined"
              :invalid-feedback="errorMessage"
            ></b-form-textarea>

          </b-form-group>
          <div class="d-flex justify-content-between w-100">
            <b-button class="mt-2 mr-2" variant="outline-primary" block squared @click="handleCommentSubmit({ project: run, oldComment: placeHolderComment, newComment: loadedProjectInfo[run].comment, validation: validation }).then(commentUpdated, commentNotUpdated)">Submit</b-button>
            <b-button class="mt-2 ml-2" variant="outline-secondary" block squared @click="closeModal">Cancel</b-button>
          </div>
        </form>
      </b-col>
      <b-col cols="6" class="overflow-auto p-0 pr-1">
        <h5>Project Samples</h5>
        <b-table hover sticky-header show-empty :fields="fields" :items="samples">
          <template v-slot:empty>
            <h3>No samples found</h3>
          </template>
          <template v-slot:cell(gender)="data">
            {{data.gender === 0 ? 'Male' : data.gender === 1 ? 'Female' : 'Unknown' }}
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-modal>
</b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapActions, mapMutations } from 'vuex'
import { Sample } from '../../types/dataTypes'

declare module 'vue/types/vue' {
  interface Vue {
    name: string;
    placeHolderComment: string;
    rejected: boolean;
    resetErrorMessage: string;
    errorMessage: string;
    fields: { key: string; label: string }[];
    loadedProjectInfo: Record<string, {comment: string; samples: Sample[]}>;
    commentUpdated(): void;
    commentNotUpdated(reason: string): void;
    showModal(): void;
    closeModal(): void;
    handleCommentSubmit(): Promise<void>;
    getExtraProjectInfo(): Promise<void>;
  }
}

export default Vue.extend({
  name: 'comment-modal',
  props: {
    run: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    samples: {
      type: Array,
      required: false,
      default: (): object[] => { return [] }
    }
  },
  data () {
    return {
      name: '',
      placeHolderComment: '',
      rejected: false,
      resetErrorMessage: 'Could not update comment',
      errorMessage: '',
      fields: [
        { key: 'sequencer', label: 'Sequencer' },
        { key: 'lane', label: 'Lane' },
        { key: 'gender', label: 'Gender' },
        { key: 'archive', label: 'Archive' }
      ]
    }
  },
  computed: {
    ...mapState([
      'projectsTable',
      'loadedProjectInfo',
      'CommentUpdatedStatus',
      'CommentNetworkError'
    ]),
    /**
     * Check if comment has a valid lenght
     */
    validation (): boolean {
      const comment = this.placeHolderComment
      return comment.length <= 65535
    },
    localComment: {
      /**
       * gets the comment beloning to project
       */
      get: function (): string {
        return this.loadedProjectInfo[this.run] ? this.loadedProjectInfo[this.run].comment : ''
      },
      /**
       * sets the loaded project info corretly when comment changes
       */
      set: function (value: string): void {
        this.loadedProjectInfo[this.run] = this.loadedProjectInfo[this.run] ? {comment: value, samples: this.loadedProjectInfo[this.run].samples} : {comment: value, samples: [] as Sample[]}
      }
    }
  },
  methods: {
    ...mapActions([
      'handleCommentSubmit',
      'getExtraProjectInfo'

    ]),
    ...mapMutations([
      'updateCommentOnLocalProject'
    ]),
    /**
     * When comment submit succeeded this resets the error states and closes modal
     */
    commentUpdated (): void {
      this.rejected = false
      this.errorMessage = this.resetErrorMessage
      this.closeModal()
    },
    /**
     * when comment update failed an error toast is shown
     */
    commentNotUpdated (reason: Error): void {
      this.rejected = true
      this.errorMessage = reason.message
      this.$bvToast.toast(reason.message, {
        title: 'Error updating comment',
        variant: 'danger',
        toaster: 'b-toaster-bottom-right',
        noAutoHide: true
      })
    },
    /**
     * Closes modal
     *
     *
     * @returns {void}
     */
    closeModal (): void {
      this.$bvModal.hide('comment-modal')
      this.rejected = false
    },
    /**
     * Opens the modal
     *
     *
     * @returns {void}
     */
    showModal (): void {
      this.$bvModal.show('comment-modal')
    }
  },
  watch: {
    /**
     * If run changes put the correct comment
     * @returns {void}
     */
    run (): void {
      this.placeHolderComment = this.comment
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
