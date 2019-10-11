<template>
<b-container fluid>
  <b-modal
      id="comment-modal"
      ref="modal"
      :title="Run"
      @ok="submitComment"
      >
    <form ref="form" @submit.stop.prevent="submitComment" >
      <b-form-group>
        <b-form-textarea
          id="textarea"
          v-model="text"
          placeholder="Comment..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>
      </b-form-group>
      
    </form>
    <b-card class="text-left mt-1 mb-1" v-for="comment in comments" :key="comment.value"> 
      <b-card-text>{{comment}}</b-card-text>
    </b-card>
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
    comments: {
      type: Array,
      required: false,
      default: []
    }
  },
  data () {
    return {
      name: '',
      text: 'dit is test text'
    }
  },
  methods: {
    submitComment (): void {
      this.comments.unshift(this.text)
      this.clearInput()
    },
    clearInput (): void {
      this.text = ''
    }
  }
})
</script>

<style lang="scss" scoped>

</style>