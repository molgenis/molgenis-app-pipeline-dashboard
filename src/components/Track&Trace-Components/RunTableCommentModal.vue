<template>
<b-container fluid>
  <b-modal
      id="comment-modal"
      ref="modal"
      :title="Run"
      @ok="PutNewCommentText(Run, placeHolderComment, comment, API, headers)"
      >
    <form ref="form">
      <b-form-group>
        <b-form-textarea
          id="textarea"
          v-model="placeHolderComment"
          placeholder="Comment..."
          rows="10"
          max-rows="30"
        ></b-form-textarea>
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
  },
  methods: {
    emitCommentUpdate(comment: string): void {
      this.$emit('update-comment', comment)
    },
    async PutNewCommentText(project: string, vModelComment: string, comment: string, APIv1: string, headers: Headers): Promise<void> {
      if (comment !== vModelComment)
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
    comment(): void {
      this.placeHolderComment = this.comment
    }
  }
})
</script>

<style lang="scss" scoped>

</style>