import {flushPromises, mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import AssignDriver from '@/components/services/AssingDriver.vue'
import DriverMock from '../../../mocks/entities/DriverMock'
import {nextTick} from 'vue'
import AutoComplete from '@/components/AutoComplete.vue'
import Driver from '@/models/Driver'
import ServiceRepository from '@/repositories/ServiceRepository'
import ToastService from '@/services/ToastService'
import ServiceMock from '../../../mocks/entities/ServiceMock'
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
    ServiceRepository.getService = jest.fn().mockResolvedValue(new ServiceMock())
    ServiceRepository.assign = jest.fn().mockResolvedValue(null)
    wrapper = mount(AssignDriver,
      {
        attachTo: '#root',
        props: {
          drivers: [DriverMock as Driver]
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
    expect(wrapper.find('.btn-secondary').text()).toMatch(i18n.global.t('common.actions.close'))
    expect(wrapper.find('.btn-primary').text()).toMatch(i18n.global.t('common.actions.assign'))
  })
  
  it('should fill plates with river given', async () => {
    await nextTick()
    await button.click()
    const input = wrapper.find('input')
    await input.setValue('HEM')
    await waitForExpect(() => {
      expect(wrapper.findAll('.autocomplete-list li').length).toBeGreaterThan(0)
    })
    expect(wrapper.text()).toContain('HEM390')
  })
  
  it('should assign driver when click in button', async () => {
    const toast = jest.spyOn(ToastService, 'toast')
    await nextTick()
    await button.click()
    await flushPromises()
    await wrapper.vm.onDriverSelected({ id: DriverMock.id, value: DriverMock.vehicle.plate })
    await flushPromises()
    expect(toast).toBeCalledWith('success', i18n.global.t('common.messages.updated'))
    expect(ServiceRepository.assign).toBeCalled()
  })
  
  it('should show error toast when click on assign without driver selected', async () => {
    const toast = jest.spyOn(ToastService, 'toast')
    await nextTick()
    await wrapper.find('.btn-primary').trigger('click')
    
    expect(toast).toBeCalledWith('error', i18n.global.t('common.messages.error'), i18n.global.t('validations.driver'))
  })
  
  it('should show error toast when something was wrong while try to update', async () => {
    const toast = jest.spyOn(ToastService, 'toast')
    ServiceRepository.assign = jest.fn().mockRejectedValue(new Error('something was wrong'))
    
    await nextTick()
    await button.click()
    await flushPromises()
    await wrapper.vm.onDriverSelected({ id: DriverMock.id, value: DriverMock.vehicle.plate })
    await flushPromises()
    
    expect(toast).toBeCalledWith('error', i18n.global.t('common.messages.error'), 'something was wrong')
  })
})
