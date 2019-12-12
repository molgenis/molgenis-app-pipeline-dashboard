<template>
<b-container fluid>
  <b-modal
      id="comment-modal"
      ref="modal"
      size="xl"
      :title="run"
      hide-footer
      :static="true"
    >
    <b-row>
      <b-col cols="6">
        <h5>Project Log</h5>
        <form ref="form">
          <b-form-group>
            <b-form-textarea
              id="textinput"
              v-model="placeHolderComment"
              placeholder="Comment..."
              rows="30"
              max-rows="30"
              :state="rejected ? false : undefined"
              :invalid-feedback="errorMessage"
            ></b-form-textarea>

          </b-form-group>
          <div class="d-flex justify-content-between w-100"> 
            <b-button class="mt-2 mr-2" variant="outline-primary" block squared @click="handleCommentSubmit({ project: run, newComment: placeHolderComment, oldComment: comment, validation: validation }).then(commentUpdated, commentNotUpdated)">Submit</b-button>
            <b-button class="mt-2 ml-2" variant="outline-secondary" block squared @click="closeModal">Cancel</b-button>
          </div>
        </form>
      </b-col>
      <b-col cols="6" class="overflow-auto p-0 pr-1">
        <h5>Project Samples</h5>
        <b-table hover sticky-header show-empty :fields="fields" :items="samples">
          <template v-slot:empty="scope">
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

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { Gender } from '@/types/dataTypes.ts'
export default {
  name: 'comment-modal',
  props: {
    run: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: false,
      default: ''
    },
    samples: {
      type: Array,
      required: false,
      default: []
    }
  },
  data () {
    return {
      name: '',
      placeHolderComment: '',
      submitStatus: true,
      rejected: false,
      resetErrorMessage: 'Could not update comment',
      errorMessage: '',
      fields: [
        {key: 'sequencer', label: 'Sequencer'},
        {key: 'lane', label: 'Lane'},
        {key: 'gender', label: 'Gender'},
        {key: 'archive', label: 'Archive'},
      ]
    }
  },
  computed: {
    ...mapState([
      'projectsTable',
      'CommentUpdatedStatus',
      'CommentNetworkError'
    ]),
    validation () {
      const comment = this.placeHolderComment
      return comment.length <= 65535
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
    commentUpdated (message) {
      this.rejected = false
      this.ErrorMessage = this.resetErrorMessage
      this.updateCommentOnLocalProject({ projectName: this.run, comment: this.placeHolderComment })
      this.closeModal()
    },
    commentNotUpdated (reason) {
      this.rejected = true
      this.ErrorMessage = reason
      this.$bvToast.toast(reason, {
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
    closeModal () {
      this.$bvModal.hide('comment-modal')
      this.rejected = false
    },
    /**
     * Opens the modal
     *
     *
     * @returns {void}
     */
    showModal () {
      this.$bvModal.show('comment-modal')
    }
  },
  watch: {
    /**
     * If run changes put the correct comment
     * @returns {void}
     */
    run: {
      immediate: true,
      handler () {
        this.placeHolderComment = this.comment
        this.submitStatus = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
