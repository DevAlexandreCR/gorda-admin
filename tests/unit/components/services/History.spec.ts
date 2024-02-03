import {mount, VueWrapper} from '@vue/test-utils'
import History from '@/components/services/History.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import {Field, Form} from 'vee-validate'
import ServiceRepository from '@/repositories/ServiceRepository'
import {useServicesStore} from '@/services/stores/ServiceStore'
import DocumentDataMock from '../../../mocks/firebase/DocumentDataMock'
import AutoComplete from '@/components/AutoComplete.vue'
import {StrHelper} from '@/helpers/StrHelper'
import ServicesTable from '@/components/services/ServicesTable.vue'
import DriverMock from '../../../mocks/entities/DriverMock'
import {nextTick} from 'vue'
import ServiceMock from '../../../mocks/entities/ServiceMock'

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
    ServiceRepository.getPaginated = jest.fn().mockResolvedValue([ServiceMock])
    ServiceRepository.getCount = jest.fn().mockResolvedValue([1])
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
    expect(wrapper.findComponent(ServicesTable).exists()).toBeTruthy()
	})

  it('displays correct data in ServicesTable', () => {
    const servicesTable = wrapper.findComponent(ServicesTable)
    const expectedData = DocumentDataMock.data()
    expect(servicesTable.html()).toContain(i18n.global.t('services.statuses.' + expectedData.status))
		expect(servicesTable.html()).toContain(expectedData.phone)
		expect(servicesTable.html()).toContain(expectedData.comment)
		expect(servicesTable.html()).toContain(expectedData.name)
		expect(servicesTable.html()).toContain(expectedData.start_loc.name)
	})

  it('it must be assert that services si called when clear filters', async () => {
		const getAll = jest.spyOn(ServiceRepository, 'getPaginated')
    const input = wrapper.find('input[name="driver"]')
    await input.setValue('HEM390')
    await nextTick()
    expect((input.element as HTMLInputElement).value).toEqual(DriverMock.vehicle.plate)
		
		const button = wrapper.find('button[name="clear"]')
		await button.trigger('click')
	
		await nextTick()
		expect(getAll).toBeCalledTimes(2)
	})

  it('calculates the percentage correctly', () => {
    expect(wrapper.vm.isWhatPercent(3)).toBe(300)
    expect(wrapper.vm.isWhatPercent(0)).toBe(0)
    expect(wrapper.vm.isWhatPercent(5)).toBe(500)
  })
})