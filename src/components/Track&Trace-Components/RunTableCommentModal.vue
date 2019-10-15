<template>
<b-container fluid>
  <b-modal
      id="comment-modal"
      ref="modal"
      :title="Run"
      @ok="PutNewCommentText(Run, placeHolderComment, comment, API, headers, validation)"
      hide-footer
      >
    <form ref="form">
      <b-form-group>
        <b-form-textarea
          id="textarea"
          v-model="placeHolderComment"
          placeholder="Comment..."
          rows="10"
          max-rows="30"
          :state="validation || CommentUpdatedState? undefined : false"
        ></b-form-textarea>
        <b-form-invalid-feedback :state="validation">
        Comment is too long. Must be smaller than 65535 characters
      </b-form-invalid-feedback>
      <b-form-invalid-feedback :state="CommentUpdatedState">
        Comment Updated by different user, Please try again later...
      </b-form-invalid-feedback>
      </b-form-group>
      <b-button class="mt-2" variant="primary" block @click="handleSubmit(Run, placeHolderComment, comment, API, headers, validation)"></b-button>
       <b-button class="mt-2" variant="danger" block @click="closeModal"></b-button>
    </form>
  </b-modal>
</b-container>
</template>

<script lang="ts">
import Vue from 'vue'

interface CommentResponseJson{
  href: string,
  comment: string
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
      name: '',
      placeHolderComment: '',
      CommentUpdatedState: true
    }
  },
  computed: {
    validation(): boolean {
      const comment: string = this.placeHolderComment
      return comment.length <= 65535
    }
  },
  methods: {
    async handleSubmit(Run: string, placeHolderComment: string, comment: string, API: string, headers: Headers, validation: boolean): Promise<void> {
      const CommentUpdated = await this.CheckCommentUpdate(API, Run, headers, comment)
      if (CommentUpdated) {
        this.CommentUpdatedState = false
      } else {
      this.PutNewCommentText(Run, placeHolderComment, comment, API, headers, validation)
      this.closeModal()
      }
    },
    closeModal(): void {
      this.$bvModal.hide('modal')
    },
    /**
     * Updates the comment value in MOLGENIS database
     * @param project project to update
     * @param vModelComment new comment content
     * @param comment old comment
     * @param APIv1 API url
     * @param headers request headers
     */
    async PutNewCommentText(project, vModelComment, comment, API, headers, validated) {
      if (comment !== vModelComment && validated) {
        try {
          const response = await fetch(API + 'status_projects/' + project + '/comment', {
            method: 'PUT',
            body: JSON.stringify(vModelComment),
            headers: headers
          })
          
        } catch (error) {
          console.error(error)
        }
      }
    },
    async CheckCommentUpdate(API: string, project: string, headers: Headers, comment: string): Promise<boolean> {
      try {
        const response = await fetch(API + 'status_projects/' + project + '/comment', {
            method: 'get',
            headers: headers
          })
        const commentJson: CommentResponseJson = await response.json()
        return commentJson.comment !== comment
      } catch (error) {
        console.error(error)
        return true
      }
    }
  },
  watch: {
    /**
     * watches for changes in the comment and sets the editable placeHolderComment
     */
    comment(): void {
      this.placeHolderComment = this.comment
      this.CommentUpdatedState = true
    }
  }
})
</script>

<style lang="scss" scoped>

</style>