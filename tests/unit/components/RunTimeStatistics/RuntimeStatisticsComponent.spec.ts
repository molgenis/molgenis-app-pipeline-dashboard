import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import VueApexCharts from 'vue-apexcharts'
import RunTimeStatistics from '@/components/RunTimeStatistics.vue'

const localVue = createLocalVue()

localVue.component('apexchart', VueApexCharts)
localVue.use(BootstrapVue)


describe('RunTimeStatistics.vue', () => {
  it('changes maximum view range to max + 10', () => {
    const dataPoints =  [{'test1' : 25}, {'test2' : 8.4}, {'test3' : 26}, {'test4' : 6.6}, {'test5' : 12.3}, {'test6' : 8.1}, {'test7' : 60}, {'test8' : 9.3}, {'test9' : 7.7}, {'test10' : 5.5} ]
    const wrapper = mount(RunTimeStatistics, {
      localVue,
      propsData: {
        runTimes: dataPoints
      }
    })
    wrapper.setProps({runTimes: [{'test1' : 25}, {'test2' : 8.4}, {'test3' : 40}, {'test4' : 6.6}, {'test5' : 12.3}, {'test6' : 8.1}, {'test7' : 30}, {'test8' : 9.3}, {'test9' : 7.7}, {'test10' : 5.5} ]})
    expect(wrapper.vm.$data.maxValue).toBe(50)
  })
})
