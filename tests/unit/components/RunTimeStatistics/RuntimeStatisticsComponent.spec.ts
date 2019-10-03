import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import ApexCharts from 'apexcharts'
import RunTimeStatistics from '@/components/RunTimeStatistics.vue'

const localVue = createLocalVue()

localVue.use(BootstrapVue)

describe('RunTimeStatistics.vue', () => {
  it('changes maximum view range to max + 10', () => {
    const dataPoints =  [5, 5, 5, 5, 6, 7, 8, 40, 5, 60]
    const wrapper = mount(RunTimeStatistics, {
      localVue,
      propsData: {
        runTimes: dataPoints
      }
    })
    expect(wrapper.vm.$data.chartOptions.yaxis.max).toBe(70)
    wrapper.setProps({runTimes: [5, 5, 5, 5, 6, 7, 8, 40, 5, 8]})
    expect(wrapper.vm.$data.chartOptions.yaxis.max).toBe(50)
  })
})
