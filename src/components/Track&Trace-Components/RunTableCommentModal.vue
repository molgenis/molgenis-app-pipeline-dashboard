<template>
<b-container fluid>
  <b-modal
      id="comment-modal"
      ref="modal"
      :title="Run"
      @ok="PutNewCommentText(Run, placeHolderComment, comment, API, headers, validation)"
      >
    <form ref="form">
      <b-form-group>
        <b-form-textarea
          id="textarea"
          v-model="placeHolderComment"
          placeholder="Comment..."
          rows="10"
          max-rows="30"
          :state="validation ? undefined : false"
        ></b-form-textarea>
        <b-form-invalid-feedback :state="validation">
        Comment is too long. Must be smaller than 65535 characters
      </b-form-invalid-feedback>
      </b-form-group>
    </form>
  </b-modal>
</b-container>
</template>

<script lang="ts">
import Vue from 'vue'

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
      placeHolderComment: ''
    }
  },
  computed: {
    validation() {
      const comment: string = this.placeHolderComment
      return comment.length <= 65535
    }
  },
  methods: {
    /**
     * Updates the comment value in MOLGENIS database
     * @param project project to update
     * @param vModelComment new comment content
     * @param comment old comment
     * @param APIv1 API url
     * @param headers request headers
     */
    async PutNewCommentText(project: string, vModelComment: string, comment: string, APIv1: string, headers: Headers, validated: boolean): Promise<void> {
      if (comment !== vModelComment && validated)
        try {
          const response = await fetch(APIv1 + 'status_projects/' + project + '/comment', {
            method: 'PUT',
            body: JSON.stringify(vModelComment),
            headers: headers
          })
          
        } catch (error) {
          console.error(error)
        }
    },

  },
  watch: {
    /**
     * watches for changes in the comment and sets the editable placeHolderComment
     */
    comment(): void {
      this.placeHolderComment = this.comment
    }
  }
})
</script>

<style lang="scss" scoped>

</style>