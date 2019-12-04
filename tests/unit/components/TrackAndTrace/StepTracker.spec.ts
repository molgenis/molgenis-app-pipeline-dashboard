import { shallowMount } from '@vue/test-utils'
import StepTracker from '@/components/Track&Trace-Components/RunTableStepTrackerRework.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { CombinedVueInstance } from 'vue/types/vue'

/**
 * steps
 *  * 0: demultiplexing
 *  * 1: Copying raw data
 *  * 2: Running pipelines
 *  * 3: Copying results
 *  * 4: finished
 */
describe('StepTracker.vue', () => {
  const wrapper = shallowMount(StepTracker, {
    propsData: {
      currentStep: 0,
      error: false,
      warning: false,
      started: true
    },
    stubs: {
      FontAwesomeIcon: true
    }
  })

  test('Step tracker component renders as running', () => {
    wrapper.setProps({ currentStep: 2 })
    expect(wrapper.text()).toContain('In progress')
    expect(wrapper.text()).toContain('Running pipelines')
  })

  test('Step tracker recognises correct steps', () => {
    wrapper.setProps({ currentStep: 0 })

    expect(wrapper.text()).toContain('Demultiplexing')

    wrapper.setProps({ currentStep: 1 })

    expect(wrapper.text()).toContain('Copying raw data files')

    wrapper.setProps({ currentStep: 2 })

    expect(wrapper.text()).toContain('Running pipelines')

    wrapper.setProps({ currentStep: 3 })

    expect(wrapper.text()).toContain('Copying result files')

    wrapper.setProps({ currentStep: 4 })

    expect(wrapper.text()).toContain('Finished all workflow steps')
  })

  describe
})
