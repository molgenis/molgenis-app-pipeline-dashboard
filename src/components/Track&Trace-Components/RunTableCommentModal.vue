<template>
<b-container fluid>
  <b-modal
      id="comment-modal"
      ref="modal"
      :title="Run"
      @ok="PutNewCommentText(Run, placeHolderComment, API, headers)"
      >
    <form ref="form">
      <b-form-group>
        <b-form-textarea
          id="textarea"
          v-model="placeHolderComment"
          placeholder="Comment..."
          rows="3"
          max-rows="6"
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
    async PutNewCommentText(project: string, comment: string, APIv1: string, headers: Headers): Promise<void> {
      try {
        const response = await fetch(APIv1 + 'status_projects/' + project + '/comment', {
          method: 'PUT',
          body: JSON.stringify(comment),
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