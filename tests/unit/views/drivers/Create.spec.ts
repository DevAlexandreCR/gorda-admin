import {VueWrapper, mount} from '@vue/test-utils'
import Create from "@/views/drivers/Create.vue"
import {Field, Form, ErrorMessage} from 'vee-validate'
import i18n from '@/plugins/i18n'
import dayjs from 'dayjs'
import ToastService from "@/services/ToastService"
import {flushPromises} from '@vue/test-utils'
import waitForExpect from 'wait-for-expect'
import Driver from "@/models/Driver";
import DriverRepository from "@/repositories/DriverRepository";
import {nextTick} from 'vue'


describe('Create.vue', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    DriverRepository.create = jest.fn().mockResolvedValue('id-driver')
    wrapper = mount(Create, {
      attachTo: '#root',
      global: {
        plugins: [i18n]
      },
    })
  })
  
  afterEach(async () => {
    await flushPromises()
    jest.resetAllMocks()
  })
  it('A user can see inputs to create drivers', () => {
    const field = wrapper.findAllComponents(Field)
    const form = wrapper.findComponent(Form)
    const error = wrapper.findAllComponents(ErrorMessage)
    const input = wrapper.findAll('.form-control')
    expect(field.length).toBe(14)
    expect(form.exists()).toBeTruthy()
    expect(error.length).toBe(1)
    expect(input.length).toBe(13)
  })

  it('A user sees the Span when submit', async () => {
    await nextTick()
    const button = wrapper.find('button[type="submit"]')
    await button.trigger('click')
    await nextTick()
    const span = wrapper.findAll('.is-invalid')    
    await nextTick()
    expect(span.length).toBe(11)
  })
  
  it('A user can enable or disable a driver', async () => {
    const field = wrapper.find('#enableDriver')
    await field.trigger('click')
    
    expect(wrapper.vm.driver.enabled_at).toBe(dayjs().unix())
  })
  
  it('A user can create a driver', async () => {
    const success = jest.spyOn(ToastService, 'toast')
    wrapper.vm.driver.name = 'new Driver'
    wrapper.vm.driver.email = 'email@gmail.com'
    wrapper.vm.driver.phone ='30130103030'
    wrapper.vm.driver.doc_type = 'CC'
    wrapper.vm.driver.document = '100000000'
    wrapper.vm.driver.enabled_at = dayjs().unix()
    wrapper.vm.driver.vehicle.brand = 'Mazda'
    wrapper.vm.driver.vehicle.model = 'Cx30'
    wrapper.vm.driver.vehicle.plate = 'HEM390'
    const file = new File([new Blob(['file contents'], {type: 'image/jpeg'})], 'image')
    wrapper.vm.imageDriver.push(file)
    wrapper.vm.imageVehicle.push(file)
    await wrapper.vm.createDriver(new Driver(), { resetForm: () => null })
    
    await waitForExpect(() => {
      expect(success).toHaveBeenCalledTimes(1)
    })
  })
  it('it must return a error when createDriver fails', async () => {
    const error = jest.spyOn(ToastService, 'toast')
    DriverRepository.create = jest.fn().mockRejectedValue(new Error('error when creating driver'))
    
    await wrapper.vm.createDriver(new Driver(), {})
    
    await waitForExpect(() => {
      expect(error).toHaveBeenCalledTimes(1)
    })
  })
  
})
    