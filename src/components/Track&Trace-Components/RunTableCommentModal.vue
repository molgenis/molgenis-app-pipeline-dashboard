<template>
<b-container fluid>
  <b-modal
      id="comment-modal"
      ref="modal"
      :title="run"
      hide-footer
      :static="true"
      >
    <form ref="form">
      <b-form-group>
        <b-form-textarea
          id="textinput"
          v-model="placeHolderComment"
          placeholder="Comment..."
          rows="10"
          max-rows="30"
          :state="rejected ? false : undefined"
          :invalid-feedback="errorMessage"
        ></b-form-textarea>
        
      </b-form-group>
      <b-button class="mt-2" variant="outline-primary" block squared @click="handleCommentSubmit({ project: run, newComment: placeHolderComment, oldComment: comment, validation: validation }).then(commentUpdated, commentNotUpdated)">Submit</b-button>
      <b-button class="mt-2" variant="outline-secondary" block squared @click="closeModal">Cancel</b-button>
    </form>
  </b-modal>
</b-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
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
    }
  },
  data () {
    return {
      name: '',
      placeHolderComment: '',
      submitStatus: true,
      rejected: false,
      resetErrorMessage: 'Could not update comment',
      errorMessage: ''
    }
  },
  computed: {
    ...mapState([
      'projectsTable',
      'CommentUpdatedStatus',
      'CommentNetworkError'
    ]),
    validation() {
      const comment = this.placeHolderComment
      return comment.length <= 65535
    }
  },
  methods: {
    ...mapActions([
      'handleCommentSubmit'

    ]),
    ...mapMutations([
      'updateCommentOnLocalProject'
    ]),
    commentUpdated(message) {
      this.rejected = false
      this.ErrorMessage = this.resetErrorMessage
      this.updateCommentOnLocalProject({projectName: this.run, comment: this.placeHolderComment})
      this.closeModal()
    },
    commentNotUpdated(reason) {
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
    closeModal() {
      this.$bvModal.hide('comment-modal')
      this.rejected = false
    },
    /**
     * Opens the modal
     * 
     * 
     * @returns {void}
     */
    showModal() {
      this.$bvModal.show('comment-modal')
    },
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