import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import ProgressBar from '@/components/Track&Trace-Components/ProgressBar.vue'

const localVue = createLocalVue()

localVue.use(BootstrapVue)


describe('ProgressBar.vue', () => {
  test('renders a bootstrap progress bar when passed', () => {
    const step = 44
    const totalSteps = 120
    const wrapper = mount(ProgressBar, {
      localVue,
      propsData: { step, totalSteps }
    })
    expect(wrapper.text()).toMatch(step + ' / ' + totalSteps)
  })

  test('Emits finished when progressbar is complete', () => {
    const step = 2
    const totalSteps = 2
    const wrapper = mount(ProgressBar, {
      localVue,
      propsData: {step, totalSteps}
    })
    expect(wrapper.emitted('progress-finish')).toBeTruthy()
  })
})
