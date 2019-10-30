import { mount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import CommentModal from '@/components/Track&Trace-Components/RunTableCommentModal.vue'
import {BFormText} from 'bootstrap-vue'

const localVue = createLocalVue()

localVue.use(BootstrapVue)

describe('RunTableCommentModal.vue', () => {
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
  
  beforeEach(() => {
    //Show modal
    wrapper.vm.$bvModal.show('comment-modal')
  })

  afterEach(() => {
    //Close Modal
    wrapper.vm.$bvModal.hide('comment-modal')
  })

  afterAll(() => { wrapper.destroy() })

  it('Is Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
  
  it('exists', () => {
    //Rendered Comment modal
    expect(wrapper.find('#comment-modal').exists()).toBeTruthy()
  })

  it('Has correct initial content', () => {
    // title is same as run
    expect(wrapper.find('#comment-modal').find('.modal-title').text()).toEqual(run)

    // assert placeholder comment has been saved
    expect(wrapper.vm.$data.placeHolderComment).toEqual(comment)
    
  })

  it('Updates local comment on text change', () => {
    const newComment = 'Updated Comment!'

    //Comment equals old comment before change
    expect(wrapper.vm.$data.placeHolderComment).toEqual(comment)

    //Change textarea content
    wrapper.find('#comment-modal').find('textarea').setValue(newComment)

    //Comment changed locally
    expect(wrapper.vm.$data.placeHolderComment).toEqual(newComment)
  })

  it('displays error if comment has been changed on remote', () => {
    //@todo
  })
  it('displays error if comment is too long', () => {
    //@todo
  })
  it('displays error if submit failed', () => {
    //@todo
  })
})