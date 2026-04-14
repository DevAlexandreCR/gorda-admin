import {mount, VueWrapper} from '@vue/test-utils'
import History from '@/components/services/History.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import {Field, Form} from 'vee-validate'
import ServiceRepository from '@/repositories/ServiceRepository'
import {useServicesStore} from '@/services/stores/ServiceStore'
import AutoComplete from '@/components/AutoComplete.vue'
import {StrHelper} from '@/helpers/StrHelper'
import ServicesTable from '@/components/services/ServicesTable.vue'
import DriverMock from '../../../mocks/entities/DriverMock'
import {nextTick} from 'vue'
import ServiceMock from '../../../mocks/entities/ServiceMock'
import Service from '@/models/Service'
import { flushPromises } from '@vue/test-utils'

describe('History.vue', () => {
  let wrapper: VueWrapper<any>
  StrHelper.formatNumber = jest.fn((str: string) => str)
  const options = {
    attachTo: '#root',
    global: {
      plugins: [router, i18n],
      provide: {
        appName: 'test',
      }
    },
  }

  beforeEach(async () => {
    jest.useFakeTimers()
    const service = Object.assign(new Service(), new ServiceMock)
    ServiceRepository.getPaginated = jest.fn().mockResolvedValue([service, service])
    ServiceRepository.getCount = jest.fn().mockResolvedValue([1])
		const servicesStore = useServicesStore()
    await servicesStore.getHistoryServices()
    wrapper = mount(History, options)
    await router.isReady()
  })

	it('A user can see inputs to History services', async () => {
    expect(wrapper.findAllComponents(Field).length).toBe(5)
    expect(wrapper.findComponent(Form).exists()).toBeTruthy()
    expect(wrapper.findAll('.form-control-label').length).toBe(5)
    expect(wrapper.findAllComponents(AutoComplete).length).toBe(3)
    expect(wrapper.findComponent(ServicesTable).exists()).toBeTruthy()
	})

  it('displays correct data in ServicesTable', async () => {
    const servicesTable = wrapper.findComponent(ServicesTable)
    expect(servicesTable.exists()).toBeTruthy()
  })

  it('it must be assert that services si called when clear filters', async () => {
		const servicesStore = useServicesStore()
    servicesStore.filter.driverId = DriverMock.id
    servicesStore.filter.clientId = 'client-id'
    await wrapper.vm.clearFilters()
	
		await nextTick()
		expect(servicesStore.filter.driverId).toBeNull()
		expect(servicesStore.filter.clientId).toBeNull()
	})

  it('calculates the percentage correctly', () => {
    expect(wrapper.vm.isWhatPercent(3)).toBe(300)
    expect(wrapper.vm.isWhatPercent(0)).toBe(0)
    expect(wrapper.vm.isWhatPercent(5)).toBe(500)
  })
})
