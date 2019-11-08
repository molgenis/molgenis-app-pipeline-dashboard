<template>
<b-container fluid>
  <b-modal
      id="comment-modal"
      ref="modal"
      :title="Run"
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
          :state="(!validation || !CommentUpdatedState || !submitStatus) ? false : undefined"
        ></b-form-textarea>
        <b-form-invalid-feedback id='lengthError' v-if="!validation">
          Comment too long. Must be smaller than 65536 characters
        </b-form-invalid-feedback>
        <b-form-invalid-feedback id='updatedError' v-else-if="!CommentUpdatedState">
        Comment updated by another user, try again later
        </b-form-invalid-feedback>
        <b-form-invalid-feedback id='submitError' v-else-if="!submitStatus">
        Could not update comment, please try again later
      </b-form-invalid-feedback>
      </b-form-group>
      <b-button class="mt-2" variant="outline-primary" block squared @click="handleSubmit(Run, placeHolderComment, comment, validation)">Submit</b-button>
      <b-button class="mt-2" variant="outline-secondary" block squared @click="closeModal">Cancel</b-button>
    </form>
  </b-modal>
</b-container>
</template>

<script>
import api from '@molgenis/molgenis-api-client'
import { mapState } from 'vuex'
export default {
  name: 'comment-modal',
  props: {
    Run: {
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
      CommentUpdatedState: true,
      submitStatus: true,


    }
  },
  computed: {
    ...mapState([
      'projectsTable'
    ]),
    validation() {
      const comment = this.placeHolderComment
      return comment.length <= 65535
    }
  },
  methods: {
    /** 
     * Sends the new comment if the user changed the contents
     * 
     * @param {String} Run - run where the comment was added
     * @param {String} placeHolderComment - local saved comment
     * @param {String} comment - comment the user edited
     * @param {Boolean} validation - validation status
     *
     * @returns {Promise<void>}
     */
    async handleSubmit(project, oldComment, newComment, validation) {
      try {
        const CommentUpdated = await this.CheckCommentForUpdates(project, newComment)
        if (CommentUpdated) {
          this.CommentUpdatedState = false
        } else {
          await this.PutNewCommentText(project, oldComment, newComment, validation)
          this.closeModal()
        }
      } catch (error) {
        console.error(error)
      }
    },
    /**
     * Closes modal
     * 
     * 
     * @returns {void}
     */
    closeModal() {
      this.$bvModal.hide('comment-modal')
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
    /**
     * Updates the comment value in MOLGENIS database
     * 
     * @param {String} project - project to update
     * @param {String} newComment - new comment content
     * @param {String} oldComment - old comment
     * @param {Boolean} validated - comment is correct
     * 
     * @returns {Promise<void>}
     */
    async PutNewCommentText(project, newComment, oldComment, validated) {
      if (oldComment !== newComment && validated) {
        await api.put(`/api/v1/${this.projectsTable}/${project}/comment`, { body: JSON.stringify(newComment) })
        .then(
          response => {this.$emit('comment-updated', project, newComment); this.submitStatus = true }, 
          error => { this.submitStatus = false; console.error(error)})
      }
    },
    /**
     * Checks database if there were any users that added other comments
     * is true if there was an update or the check failed
     * @param {String} project - project id
     * @param {String} comment - old comment
     * 
     * @returns {Promise<Boolean>}
     */
    async CheckCommentForUpdates(project, comment) {
      let commentIsUpdated
      this.submitStatus = true
      
      await api.get(`/api/v1/${this.projectsTable}/${project}/comment`)
      .then(function (response) {
        if (!response.comment) {
          commentIsUpdated = false
        } else {
          commentIsUpdated = (response.comment !== comment)
        }
      })
      .catch(function (error) {
        this.submitStatus = false
      })

      return commentIsUpdated
    }
  },
  watch: {
    /**
     * If run changes put the correct comment
     * @returns {void}
     */
    Run: {
      immediate: true,
      handler () {
        this.placeHolderComment = this.comment
        this.CommentUpdatedState = true
        this.submitStatus = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>