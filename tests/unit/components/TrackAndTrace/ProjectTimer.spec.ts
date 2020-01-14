import { shallowMount } from '@vue/test-utils'
//@ts-ignore
import ProjectTimer from '@/components/Track&Trace-Components/ProjectTimer.vue'

describe('ProjectTimer.vue', () => {
  const wrapper: any = shallowMount(ProjectTimer, {
    propsData: {
      startTime: 0,
      finishTime: 0
    }
  })

  test('Calculates and shows the correct seconds', () => {
    const second = 1000

    wrapper.setProps({
      startTime: 0,
      finishTime: second * 6
    })

    expect(wrapper.vm.formattedSeconds).toBe('06')

    wrapper.setProps({
      startTime: 0,
      finishTime: second * 32
    })

    expect(wrapper.vm.formattedSeconds).toBe('32')
  })

  test('Calculates and shows the correct minutes', () => {
    const minute = 60000

    wrapper.setProps({
      startTime: 0,
      finishTime: minute * 45
    })

    expect(wrapper.vm.formattedMinutes).toBe('45')

    wrapper.setProps({
      startTime: 0,
      finishTime: minute * 1
    })

    expect(wrapper.vm.formattedMinutes).toBe('01')

    wrapper.setProps({
      startTime: 0,
      finishTime: minute * 61
    })

    expect(wrapper.vm.formattedMinutes).toBe('01')
  })

  test('Calculates and shows the correct hours', () => {
    const hour = 3600000

    wrapper.setProps({
      startTime: 0,
      finishTime: hour * 1
    })

    expect(wrapper.vm.formattedHours).toBe('01')

    wrapper.setProps({
      startTime: 0,
      finishTime: hour * 25
    })

    expect(wrapper.vm.formattedHours).toBe('25')

    wrapper.setProps({
      startTime: 0,
      finishTime: hour * 123
    })

    expect(wrapper.vm.formattedHours).toBe('123')
  })

  test("when not started renders 'Not Started'", () => {
    wrapper.setProps({
      startTime: 0,
      finishTime: 0,
      started: false
    })

    expect(wrapper.text()).toContain('Not Started')
  })

  test("when start or finished time is missing in database renders uncalculated time", () => {
    wrapper.setProps({
      startTime: 0,
      finishTime: undefined
    })

    expect(wrapper.text()).toContain('--:--:--')

    wrapper.setProps({
      startTime: undefined,
      finishTime: undefined
    })

    expect(wrapper.text()).toContain('--:--:--')


    wrapper.setProps({
      startTime: undefined,
      finishTime: 0
    })

    expect(wrapper.text()).toContain('--:--:--')
  })

  test('when not waiting, renders correct format', () => {
    const second = 1000
    const minute = second * 60
    const hour = minute * 60

    const hours = hour * 3
    const minutes = minute * 35
    const seconds = second * 15

    wrapper.setProps({
      startTime: 0,
      finishTime: hours + minutes + seconds,
      started: true
    })

    expect(wrapper.text()).toMatch(/.*03:35:15.*/)
  })
})
