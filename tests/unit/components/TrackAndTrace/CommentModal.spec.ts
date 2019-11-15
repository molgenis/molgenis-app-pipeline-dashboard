
import { mount, createLocalVue} from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import vuex from 'vuex'
import CommentModal from '@/components/Track&Trace-Components/RunTableCommentModal.vue'

const localVue = createLocalVue()
localVue.use(vuex)
localVue.use(BootstrapVue)




describe.skip('RunTableCommentModal.vue', () => {
  const comment = 'hello, this is a test!'
  const run = 'TestRun1'
  const API = 'localTest.com/'
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

  test('Is Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
  
  test('exists', () => {
    //Rendered Comment modal
    expect(wrapper.find('#comment-modal').exists()).toBeTruthy()
  })

  test('Has correct initial content', () => {
    // title is same as run
    expect(wrapper.find('#comment-modal').find('.modal-title').text()).toEqual(run)

    // assert placeholder comment has been saved
    expect(wrapper.vm.$data.placeHolderComment).toEqual(comment)
    
  })

  test('Updates local comment on text change', () => {
    const newComment = 'Updated Comment!'

    //Comment equals old comment before change
    expect(wrapper.vm.$data.placeHolderComment).toEqual(comment)

    //Change textarea content
    wrapper.find('#comment-modal').find('textarea').setValue(newComment)

    //Comment changed locally
    expect(wrapper.vm.$data.placeHolderComment).toEqual(newComment)
  })

  
  /* test('displays error if comment has been changed on remote', () => {
    //Set remote TODO: add fetch mock
    
    //Set new comment
    wrapper.find('#comment-modal').find('textarea').setValue('Comment has changed?')

    // expect an error when submitting
    wrapper.find('#comment-modal').findAll('button').at(1).trigger('click')
    expect(fetchMock.called()).toBeTruthy()
    expect(wrapper.find('#comment-modal').find('#updateError').exists()).toBeTruthy()
    
  })*/

  test('displays error if comment is too long', () => {
    let longArray = new Array(655640)
    // set text value too long
    wrapper.find('#comment-modal').find('textarea').setValue(longArray.join('@'))
    longArray = new Array(1)

    // Expect an error
    expect(wrapper.find('#comment-modal').find('#lengthError').exists()).toBeTruthy()

    //expect the error to go away when comment is no longer too long
    wrapper.find('#comment-modal').find('textarea').setValue('reset')
    expect(wrapper.find('#comment-modal').find('#lengthError').exists()).toBeFalsy()

  })
  /*test('displays error if submit failed', () => {
    //@todo
  })*/
})