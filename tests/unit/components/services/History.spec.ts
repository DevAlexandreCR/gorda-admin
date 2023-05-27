import { mount, VueWrapper } from '@vue/test-utils'
import History from '@/components/services/History.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import { Field, Form } from 'vee-validate'
import ServiceRepository from '@/repositories/ServiceRepository'
import { useServicesStore } from '@/services/stores/ServiceStore'
import DocumentDataMock from '../../../mocks/firebase/DocumentDataMock'
import AutoComplete from '@/components/AutoComplete.vue'
import { StrHelper } from '@/helpers/StrHelper'
import ServicesTableVue from '@/components/services/ServicesTable.vue'
import { nextTick } from 'vue'
import ClientMock from '../../../mocks/entities/ClientMock'
import DriverMock from '../../../mocks/entities/DriverMock'

describe('History.vue', () => {
  let wrapper: VueWrapper<any>
  StrHelper.formatNumber = jest.fn((str: string) => str)
  const options = {
    attachTo: '#root',
    global: {
      plugins: [router, i18n],
      provide: {
        appName: 'test',
      },
      components: {
        AutoComplete,
      },
    },
  }

  beforeEach(async () => {
    jest.useFakeTimers()
    ServiceRepository.getAll = jest.fn().mockResolvedValue([DocumentDataMock])
    const servicesStore = useServicesStore()
    await servicesStore.getHistoryServices()
    wrapper = mount(History, options)
    await router.isReady()
  })

	it('A user can see inputs to History services', async () => {
    expect(wrapper.findAllComponents(Field).length).toBe(4)
    expect(wrapper.findComponent(Form).exists()).toBeTruthy()
    expect(wrapper.findAll('.form-control-label').length).toBe(5)
    expect(wrapper.findAllComponents(AutoComplete).length).toBe(2)
    expect(wrapper.findComponent(ServicesTableVue).exists()).toBeTruthy()
	})

  it('displays correct data in ServicesTable', () => {
    const servicesTable = wrapper.findComponent(ServicesTableVue)
    const expectedData = DocumentDataMock.data().ServiceMock
    const receivedData = servicesTable.props().services[0].ServiceMock
    expect(receivedData).toEqual(expectedData)
  })

  it('updates filter values when driver is selected', async () => {
    const input = wrapper.find('input[name="driver"]')
    await input.setValue('HEM390')
    await input.trigger('keyup', {
      keyCode: 72,
    })
    await nextTick()
    await wrapper.find('li')?.trigger('click')
    expect((input.element as HTMLInputElement).value).toEqual(DriverMock.vehicle.plate)
  })

  it('updates filter values when client is selected', async () => {
    const input = wrapper.find('input[name="client"]')
    await input.setValue('3103100000')
    await input.trigger('keyup', {
      keyCode: 72,
    })
    await nextTick()
		await wrapper.find('li')?.trigger('click')
		await nextTick()
    expect((input.element as HTMLInputElement).value).toEqual(ClientMock.phone)
  })

  it('clears filter values and triggers getHistoryServices when clearFilters is called', async () => {
    const clearFilters = jest.spyOn(wrapper.vm, 'clearFilters')
    const servicesStore = useServicesStore()
    const getHistoryServices = jest.spyOn(servicesStore, 'getHistoryServices').mockResolvedValue()
    await wrapper.vm.clearFilters()
    expect(clearFilters).toHaveBeenCalled()
    expect(getHistoryServices).toBeTruthy()
  })

  it('calculates the percentage correctly', () => {
    expect(wrapper.vm.isWhatPercent(3)).toBe(300)
    expect(wrapper.vm.isWhatPercent(0)).toBe(0)
    expect(wrapper.vm.isWhatPercent(5)).toBe(500)
  })
})