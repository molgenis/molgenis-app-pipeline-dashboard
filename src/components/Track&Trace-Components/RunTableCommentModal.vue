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
        <b-form-invalid-feedback v-if="!validation">
          Comment too long. Must be smaller than 65536 characters
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!CommentUpdatedState">
        Comment updated by another user, try again later
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!submitStatus">
        Could not update comment, please try again later
      </b-form-invalid-feedback>
      </b-form-group>
      <b-button class="mt-2" variant="outline-primary" block squared @click="handleSubmit(Run, placeHolderComment, comment, API, headers, validation)">Submit</b-button>
      <b-button class="mt-2" variant="outline-secondary" block squared @click="closeModal">Cancel</b-button>
    </form>
  </b-modal>
</b-container>
</template>

<script lang="ts">
import Vue from 'vue'

interface CommentResponseJson{
  href: string,
  comment?: string
}

declare module 'vue/types/vue' {
  interface Vue {
    Run: string
    comment: string
    headers: Headers
    API: string
    CommentUpdatedState: boolean
    placeHolderComment: string
    name: string
    submitStatus: boolean
    validation(): boolean
    PutNewCommentText(Run: string, placeHolderComment: string, comment: string, API: string, headers: Headers, validation: boolean): Promise<void>
    handleSubmit(Run: string, placeHolderComment: string, comment: string, API: string, headers: Headers, validation: boolean): Promise<void>
    CheckCommentUpdate(API: string, Run: string, headers: Headers, comment: string): Promise<boolean>
    closeModal(): void
  }
}

export default Vue.extend({
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
    },
    headers: {
      type: Object,
      required: true
    },
    API: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      name: '',
      placeHolderComment: '',
      CommentUpdatedState: true,
      submitStatus: true

    }
  },
  computed: {
    validation(): boolean {
      const comment: string = this.placeHolderComment
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
     * @param {String} API - API url
     * @param {Headers} headers - headers for api call
     * @param {Boolean} validation - validation status
     *
     * @returns {Promise<void>}
     */
    async handleSubmit(Run: string, placeHolderComment: string, comment: string, API: string, headers: Headers, validation: boolean): Promise<void> {
      try {
        const CommentUpdated = await this.CheckCommentUpdate(API, Run, headers, comment)
        if (CommentUpdated) {
          this.CommentUpdatedState = false
        } else {
        this.PutNewCommentText(Run, placeHolderComment, comment, API, headers, validation)
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
    closeModal(): void {
      this.$bvModal.hide('comment-modal')
    },
    /**
     * Opens the modal
     * 
     * 
     * @returns {void}
     */
    showModal(): void {
      this.$bvModal.show('comment-modal')
    },
    /**
     * Updates the comment value in MOLGENIS database
     * 
     * @param {String} project - project to update
     * @param {String} vModelComment - new comment content
     * @param {String} comment - old comment
     * @param {String} APIv1 - API url
     * @param {Headers} headers - request headers
     * @param {Boolean} validated - comment is correct
     * 
     * @returns {Promise<void>}
     */
    async PutNewCommentText(project: string, vModelComment: string, comment: string, API: string, headers: Headers, validated: Boolean): Promise<void> {
      if (comment !== vModelComment && validated) {
        try {
          const response = await fetch(API + 'status_projects/' + project + '/comment', {
            method: 'PUT',
            body: JSON.stringify(vModelComment),
            headers: headers
          })

          if (response.ok) {
            this.$emit('comment-updated', project, vModelComment)
            this.submitStatus = true
          } else {
            this.submitStatus = false
          }
          
        } catch (error) {
          console.error(error)
        }
      }
    },
    /**
     * Checks database if there were any users that added other comments
     * is true if there was an update or the check failed
     * @param {String} API - Api url
     * @param {String} project - project id
     * @param {Headers} headers - api call headers
     * @param {String} comment - old comment
     * 
     * @returns {Promise<Boolean>}
     */
    async CheckCommentUpdate(API: string, project: string, headers: Headers, comment: string): Promise<boolean> {
      try {
        const response = await fetch(API + 'status_projects/' + project + '/comment', {
            method: 'get',
            headers: headers
          })
        const commentJson: CommentResponseJson = await response.json()
        if (!commentJson.comment) {
          return false
        }
        return commentJson.comment !== comment
      } catch (error) {
        console.error(error)
        return true
      }
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
})
</script>

<style lang="scss" scoped>

</style>