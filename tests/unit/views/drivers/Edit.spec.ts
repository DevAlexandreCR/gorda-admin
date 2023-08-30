import {VueWrapper, mount, flushPromises} from '@vue/test-utils'
import Edit from "@/views/drivers/Edit.vue"
import {Field, Form, ErrorMessage} from 'vee-validate'
import i18n from '@/plugins/i18n'
import ImageLoader from '@/components/ImageLoader.vue'
import router from '@/router'
import DriverRepository from "@/repositories/DriverRepository";
import DriverMock from "../../../mocks/entities/DriverMock";
import dayjs from 'dayjs'
import ToastService from "@/services/ToastService";
import waitForExpect from 'wait-for-expect'
import { nextTick } from 'vue'
import Driver from '@/models/Driver'
import {useDriversStore} from '@/services/stores/DriversStore'


describe('Edit.vue', () => {
  let wrapper: VueWrapper<any>
  
  beforeEach(() => {
    DriverRepository.getAll = jest.fn().mockResolvedValue([DriverMock])
    DriverRepository.update = jest.fn().mockResolvedValue(null)
    DriverRepository.enable = jest.fn().mockResolvedValue(null)
    DriverRepository.updateEmail = jest.fn().mockResolvedValue(null)
    wrapper = mount(Edit, {
      attachTo: '#root',
      global: {
          plugins: [router, i18n]
        },
    })
    useDriversStore().getDrivers()
  })
  
  afterEach(async () => {
    await flushPromises()
    jest.resetAllMocks()
  })
  
  it('A user can enable a driver', async () => {
    const field = wrapper.find('input[name="enable"]')
    await field.trigger('click')
    
    expect(wrapper.vm.driver.enabled_at).toBe(dayjs().unix())
  })
  
  it('A user can disable a driver', async () => {
    wrapper.vm.driver.enabled_at = dayjs().unix()
    await wrapper.vm.$nextTick()
    const field = wrapper.find('input[name="enable"]')
    await field.trigger('click')
    
    expect(wrapper.vm.driver.enabled_at).toBe(0)
  })
  
  it('A user see the inputs to edit a driver', async () => {
    await router.push('/dashboard/drivers/DriverID/edit')
    DriverRepository.getDriver = jest.fn().mockResolvedValue(DriverMock)
    DriverRepository.update = jest.fn().mockResolvedValue(null)
    const unix = dayjs().unix()
    DriverMock.vehicle.soat_exp = unix
    DriverMock.vehicle.tec_exp = unix
    DriverRepository.getDriver = jest.fn().mockResolvedValue(DriverMock)
    wrapper = mount(Edit, {
      attachTo: '#root',
      global: {
        plugins: [router, i18n]
      },
    })
    await nextTick()
    const field = wrapper.findAllComponents(Field)
    const form = wrapper.findComponent(Form)
    const error = wrapper.findAllComponents(ErrorMessage)
    const imageLoader = wrapper.findAllComponents(ImageLoader)
    const dates = wrapper.findAll('input[type="date"]')
		const device = wrapper.find('input[name="device.name"]')
		const deviceButton = wrapper.find('#removeDevice')
		expect(deviceButton.exists()).toBeTruthy()
		expect(device.exists()).toBeTruthy()
		expect(field.length).toBe(14)
    expect(field.length).toBe(14)
    expect(form.exists()).toBeTruthy()
    expect(error.length).toBe(5)
    expect(imageLoader.length).toBe(2)
    expect(dates.length).toBe(2)
  })

  it('A user sees the Span when submit', async () => {
    DriverRepository.getDriver = jest.fn().mockResolvedValue(new Driver())
    DriverRepository.update = jest.fn().mockResolvedValue(null)
    wrapper = mount(Edit, {
      attachTo: '#root',
      global: {
          plugins: [router, i18n]
        },
    })
    await nextTick()
    const button = wrapper.find('button[type="submit"]')
    await button.trigger('click')
    await nextTick()
    const span = wrapper.findAll('.is-invalid')    
    await nextTick()
    expect(span.length).toBe(9)
  })
  
  it('should show toast success when update driver successfully', async () => {
    const success =  jest.spyOn(ToastService, 'toast')
    await wrapper.vm.updateDriver()
    
    expect(success).toHaveBeenCalledWith('success', i18n.global.t('common.messages.updated'))
  })
  
  it('should show toast success when enable driver', async () => {
    const success =  jest.spyOn(ToastService, 'toast')
    const input = wrapper.find('input[name="enable"]')
    await input.trigger('click')
    
    expect(success).toHaveBeenCalledWith('success', i18n.global.t('users.messages.enabled'))
  })
	
	it('should set null device and remove input', async () => {
		await router.push('/dashboard/drivers/DriverID/edit')
		DriverRepository.update = jest.fn().mockResolvedValue(null)
		DriverRepository.getDriver = jest.fn().mockResolvedValue(DriverMock)
		DriverRepository.getDriver = jest.fn().mockResolvedValue(DriverMock)
		wrapper = mount(Edit, {
			attachTo: '#root',
			global: {
				plugins: [router, i18n]
			},
		})
		await nextTick()
		const deviceButton = wrapper.find('#removeDevice')
		await deviceButton.trigger('click')
		await nextTick()
		
		const input = wrapper.find('input[name="device.name"]')
		
		expect(input.exists()).toBeFalsy()
		expect(wrapper.vm.driver.device).toBeNull()
	})
  
  it('should show toast error when enable driver', async () => {
    DriverRepository.enable = jest.fn().mockRejectedValue(new Error('new Error'))
    const success =  jest.spyOn(ToastService, 'toast')
    const input = wrapper.find('input[name="enable"]')
    await input.trigger('click')
    
    expect(success).toHaveBeenCalledWith('error', i18n.global.t('common.messages.error'), 'new Error')
  })
  
  it('should show toast error when update driver fail', async () => {
    const error =  jest.spyOn(ToastService, 'toast')
    DriverRepository.update = jest.fn().mockRejectedValue(new Error('new Error'))
    await wrapper.vm.updateDriver()
    
    await waitForExpect(() => {
      expect(error).toHaveBeenCalledWith('error', i18n.global.t('common.messages.error'), 'new Error')
    })
  })
  
  it('it must exec function when child emit event', async () => {
    const imageLoader = wrapper.findAllComponents(ImageLoader)
    await imageLoader.at(1)?.vm.$emit('image-driver-loaded', 'updatedUrl.com')
    await wrapper.vm.$nextTick()
    await imageLoader.at(0)?.vm.$emit('image-vehicle-loaded', 'updatedVehicleUrl.com')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.driver.photoUrl).toMatch('updatedUrl.com')
    expect(wrapper.vm.driver.vehicle.photoUrl).toMatch('updatedVehicleUrl.com')
  })
})