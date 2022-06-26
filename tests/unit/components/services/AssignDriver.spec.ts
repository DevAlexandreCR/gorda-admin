import {flushPromises, mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import AssignDriver from '@/components/services/AssingDriver.vue'
import DriverMock from '../../../mocks/entities/DriverMock'
import {nextTick} from 'vue'
import AutoComplete from '@/components/AutoComplete.vue'
import Driver from '@/models/Driver'
import Swal from 'sweetalert2'
import ServiceRepository from '@/repositories/ServiceRepository'

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
    expect(wrapper.find('.btn-secondary').text()).toMatch(wrapper.vm.$t('common.actions.close'))
    expect(wrapper.find('.btn-primary').text()).toMatch(wrapper.vm.$t('common.actions.assign'))
  })
  
  it('should fill plates with river given', async () => {
    await nextTick()
    await button.click()
    const input = wrapper.find('input')
    await input.setValue('HEM')
    await input.trigger('keyup', {
      keyCode: 72
    })
    await nextTick()
    expect(wrapper.text()).toContain('HEM390')
  })
  
  it('should assign driver when click in button', async () => {
    const swal = jest.spyOn(Swal,'fire')
    await nextTick()
    await button.click()
    const input = wrapper.find('input')
    await input.setValue('HEM')
    await input.trigger('keyup', {
      keyCode: 72
    })
    await nextTick()
    await wrapper.find('li').trigger('click')
    await wrapper.find('.btn-primary').trigger('click')
    expect(swal).toBeCalledWith({
      icon: 'success',
      position: 'top-right',
      title: wrapper.vm.$t('common.messages.updated'),
      showConfirmButton: false,
      text: undefined,
      timer: 1500,
      toast:true
    })
  })
  
  it('should show error toast when click on assign without driver selected', async () => {
    const swal = jest.spyOn(Swal,'fire')
    await nextTick()
    await wrapper.find('.btn-primary').trigger('click')
    
    expect(swal).toBeCalledWith({
      icon: 'error',
      position: 'top-right',
      title: wrapper.vm.$t('common.messages.error'),
      showConfirmButton: false,
      text: wrapper.vm.$t('validations.driver'),
      timer: 1500,
      toast:true
    })
  })
  
  it('should show error toast when something was wrong while try to update', async () => {
    const swal = jest.spyOn(Swal,'fire')
    ServiceRepository.update = jest.fn().mockRejectedValue(new Error('something was wrong'))
    
    await nextTick()
    await button.click()
    const input = wrapper.find('input')
    await input.setValue('HEM')
    await input.trigger('keyup', {
      keyCode: 72
    })
    await nextTick()
    await wrapper.find('li').trigger('click')
    await wrapper.find('.btn-primary').trigger('click')
    await flushPromises()
    
    expect(swal).toBeCalledWith({
      icon: 'error',
      position: 'top-right',
      title: wrapper.vm.$t('common.messages.error'),
      showConfirmButton: false,
      text: 'something was wrong',
      timer: 1500,
      toast:true
    })
  })
})