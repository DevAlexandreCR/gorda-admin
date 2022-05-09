import {flushPromises, mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import AssignDriver from '@/components/services/AssingDriver.vue'
import DriverMock from '../../../mocks/entities/DriverMock'
import {nextTick} from 'vue'
import AutoComplete from '@/components/AutoComplete.vue'
import waitForExpect from 'wait-for-expect'

describe('AssignDriver.vue', () => {
  let wrapper: VueWrapper<any>
  const root = document.getElementById('root')
  const button = document.createElement('button')
  button.id = 'service-id'
  button.setAttribute('data-bs-toggle', 'modal')
  button.setAttribute('data-bs-target', '#driverModal')
  root?.appendChild(button)
  beforeEach(async () => {
    wrapper = mount(AssignDriver,
      {
        attachTo: '#root',
        props: {
          drivers: [DriverMock]
        },
        global: {
          plugins: [router, i18n],
          provide: {
            'appName': 'test'
          }
        },
      })
    await router.isReady()
  })
  it('set serviceId when show modal', async () => {
    await nextTick()
    await button.click()
    expect(wrapper.findComponent(AutoComplete).exists()).toBeTruthy()
    expect(wrapper.find('.btn-secondary').text()).toMatch(wrapper.vm.$t('common.actions.close'))
    expect(wrapper.find('.btn-primary').text()).toMatch(wrapper.vm.$t('common.actions.assign'))
  })
  
  it('should fill plates with river given', async () => {
    await nextTick()
    const input = wrapper.find('input')
    await input.setValue('HEM')
    
    // console.log(wrapper.html())
    expect(wrapper.text()).toContain('HEM390')
  })
})