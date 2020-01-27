import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue, { BButton } from 'bootstrap-vue'
import vuex from 'vuex'
import testState from '../../store/testState'
//@ts-ignore
import CommentModal from '@/components/Track&Trace-Components/RunTableCommentModal.vue'

const localVue = createLocalVue()
localVue.use(vuex)
localVue.use(BootstrapVue)

const state = testState
const actions = {
  handleCommentSubmit: jest.fn(),
  getExtraProjectInfo: jest.fn()
}
const mutations = {
  updateCommentOnLocalProject: jest.fn()
}

const store = new vuex.Store({state, actions, mutations})
describe('RunTableCommentModal.vue', () => {
  const comment = 'hello, this is a test!'
  const run = 'TestRun1'

  // render commentmodal

  const wrapper = shallowMount(
    CommentModal,
    {
      propsData: {
        run: run,
        comment: comment
      },
      store,
      localVue,
      attachToDocument: true
    }
  )

  beforeEach(() => {
    // Show modal
    wrapper.vm.$bvModal.show('comment-modal')
  })

  afterEach(() => {
    // Close Modal
    wrapper.vm.$bvModal.hide('comment-modal')
  })

  afterAll(() => { wrapper.destroy() })

  test.skip('handle comment submit is called', () => {
    const input = wrapper.find('#textinput')
    
    expect(wrapper.vm.$store.state.loadedProjectInfo[run]).toBe('test comment')
    wrapper.find('#submit-button').trigger('click')
    expect(actions.handleCommentSubmit).toHaveBeenCalled()
  })
  test.skip('displays error if comment is too long', () => {
    let longArray = new Array(655640)
    // set text value too long
    wrapper.find('#comment-modal').find('textarea').setValue(longArray.join('@'))
    longArray = new Array(1)

    // Expect an error
    expect(wrapper.find('#comment-modal').find('#lengthError').exists()).toBeTruthy()

    // expect the error to go away when comment is no longer too long
    wrapper.find('#comment-modal').find('textarea').setValue('reset')
    expect(wrapper.find('#comment-modal').find('#lengthError').exists()).toBeFalsy()
  })
  /* test('displays error if submit failed', () => {
    //@todo
  }) */
})
