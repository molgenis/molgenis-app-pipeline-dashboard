<template>
<b-container fluid>
  <b-button v-b-modal.comment-modal>Launch demo modal</b-button>
  <b-modal
      id="comment-modal"
      ref="modal"
      title="test comment"
      @ok="submitComment"
      >
    <form ref="form" @submit.stop.prevent="submitComment" >
      <b-form-group
       
        :state="nameState"
        :label="Run"
        label-for="name-input"
        invalid-feedback="Name is required"
      >
        <b-form-input
          id="name-input"
          v-model="name"
          :state="nameState"
          required
          class="mb-1"
        ></b-form-input>
        <b-form-textarea
          id="textarea"
          v-model="text"
          placeholder="Comment..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>
        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form-group>
      
    </form>
    <b-card class="text-left mt-1 mb-1" v-for="comment in comments" :key="comment.name" :sub-title="comment.name"> 
      <b-card-text>{{comment.comment}}</b-card-text>
    </b-card>
  </b-modal>
</b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Comment } from '@/types/dataTypes.ts'

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
      default: [{name: 'jprofijt', comment: 'Vreemde errors en vertraginen, graag uitzoeken!'}, {name: 'IT', comment: 'Hier wordt aan gewerkt'}]
    }
  },
  data () {
    return {
      name: '',
      text: ''
    }
  },
  methods: {
    submitComment (): void {
      this.comments.unshift(new Comment(this.name, this.text))
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