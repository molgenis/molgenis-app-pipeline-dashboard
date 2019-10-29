import { shallowMount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import CommentModal from '@/components/Track&Trace-Components/RunTableCommentModal.vue'
import {BFormText} from 'bootstrap-vue'
const localVue = createLocalVue()

localVue.use(BootstrapVue)



describe('RunTableCommentModal.vue', () => {
  

  it('Contains the correct comment and saves it locally', () => {
    const comment = 'hello, this is a test!'
    const run = 'TestRun1'
    const header = new Headers()
    header.append('x-molgenis-token', 'test')
    header.append('Content-Type', 'application/json')
    const API = 'localTest:8080'
    const wrapper = shallowMount(CommentModal, {
      propsData: {
        Run: run,
        comment: comment, 
        headers: header, 
        API: API},
        localVue: localVue
    })

    expect(wrapper.vm.$data.placeHolderComment).toBe('hello, this is a test!')
    expect(wrapper.find('b-form-textarea').exists()).toBe(true)
    
    
  })
  
})