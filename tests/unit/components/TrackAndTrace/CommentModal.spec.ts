import { mount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import CommentModal from '@/components/Track&Trace-Components/RunTableCommentModal.vue'
import {BFormText} from 'bootstrap-vue'

const localVue = createLocalVue()

localVue.use(BootstrapVue)

describe('RunTableCommentModal.vue', () => {
  

  it('Contains the correct comment and saves it locally', async () => {
    const comment = 'hello, this is a test!'
    const run = 'TestRun1'
    const API = 'localTest:8080'

    // render commentmodal
    const wrapper = mount(
      CommentModal,
      {
        propsData: {
          Run: run,
          comment: comment, 
          headers: {}, 
          API: API
        },
        localVue: localVue,
        attachToDocument: true
      }
    )
    
    expect(wrapper.isVueInstance()).toBeTruthy()

    // Unhide comment modal

    wrapper.vm.$bvModal.show('comment-modal')

    const modal = wrapper.find('#comment-modal')

    //Rendered Comment modal
    expect(modal.exists()).toBeTruthy()

    // title is same as run
    expect(modal.find('.modal-title').text()).toEqual(run)

    // 
    let textarea = modal.find('textarea')

    expect(textarea.exists()).toBeTruthy()

    // assert placeholder comment has been saved
    expect(wrapper.vm.$data.placeHolderComment).toBe('hello, this is a test!')

    // Select Submit button
    let button = modal.findAll('button').at(1)
    expect(button.text()).toEqual('Submit')


    // Put new value
    textarea.setValue('Updated Comment!')

    // assert placeholder updated
    expect(wrapper.vm.$data.placeHolderComment).toEqual('Updated Comment!')
    
    // Make sure it exists
    wrapper.destroy()

    // User changed the comment
    


    
    
  })
  
})