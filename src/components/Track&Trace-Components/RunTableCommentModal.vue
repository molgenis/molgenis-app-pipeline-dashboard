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
          :state="(!validation || !commentUpdatedState || !submitStatus) ? false : undefined"
        ></b-form-textarea>
        <b-form-invalid-feedback id='lengthError' v-if="!validation">
          Comment too long. Must be smaller than 65536 characters
        </b-form-invalid-feedback>
        <b-form-invalid-feedback id='updatedError' v-else-if="!commentUpdatedState">
        Comment updated by another user, try again later
        </b-form-invalid-feedback>
        <b-form-invalid-feedback id='submitError' v-else-if="!submitStatus">
        Could not update comment, please try again later
      </b-form-invalid-feedback>
      </b-form-group>
      <b-button class="mt-2" variant="outline-primary" block squared @click="handleSubmit(run, placeHolderComment, comment, validation)">Submit</b-button>
      <b-button class="mt-2" variant="outline-secondary" block squared @click="closeModal">Cancel</b-button>
    </form>
  </b-modal>
</b-container>
</template>

<script>
import api from '@molgenis/molgenis-api-client'
import { mapState, mapActions } from 'vuex'
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
      commentUpdatedState: true,
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
    ...mapActions([
      'getProjectComment',
      'updateProjectComment'
    ]),
    /** 
     * Sends the new comment if the user changed the contents
     * 
     * @param {String} run - run where the comment was added
     * @param {String} placeHolderComment - local saved comment
     * @param {String} comment - comment the user edited
     * @param {Boolean} validation - validation status
     *
     * @returns {Promise<void>}
     */
    async handleSubmit(project, oldComment, newComment, validation) {
      try {
        const commentUpdated = await this.checkCommentForUpdates(project, newComment)
        if (commentUpdated) {
          this.commentUpdatedState = false
        } else {
          await this.putNewComment(project, oldComment, newComment, validation)
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
    async putNewComment(project, newComment, oldComment, validated) {
      if (oldComment !== newComment && validated) {
        await this.updateProjectComment({project: project, comment: newComment})
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
    async checkCommentForUpdates(project, comment) {
      let commentIsUpdated
      this.submitStatus = true
      
      await this.getProjectComment(project).then(function (response) {
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
    run: {
      immediate: true,
      handler () {
        this.placeHolderComment = this.comment
        this.commentUpdatedState = true
        this.submitStatus = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>