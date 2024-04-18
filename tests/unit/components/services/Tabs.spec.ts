import {flushPromises, mount, shallowMount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import Tabs from '@/components/services/Tabs.vue'
import CreateService from '@/components/services/CreateService.vue'
import ServicesTable from '@/components/services/ServicesTable.vue'
import ServiceMock from '../../../mocks/entities/ServiceMock'
import Service from '@/models/Service'
import ServiceRepository from '@/repositories/ServiceRepository'
import Swal from 'sweetalert2'
import {nextTick} from 'vue'
import DriverRepository from '@/repositories/DriverRepository'

describe('Tabs.vue', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = shallowMount(Tabs,
      {
        attachTo: document.body,
        global: {
          plugins: [router, i18n],
          provide: {
            'appName': 'test'
          }
        }
      })
    await router.isReady()
  })

  it('an user can show services taps', async () => {
    await nextTick()
    const tables = wrapper.findAllComponents(ServicesTable)
    const form = wrapper.findComponent(CreateService)
    const tabs = wrapper.findAll('.nav-item')
    expect(tables.length).toBe(2)
    expect(tabs.length).toBe(4)
    expect(form.exists()).toBeTruthy()
    expect(wrapper.html()).toContain(i18n.global.t('services.statuses.pending'))
    expect(wrapper.html()).toContain(i18n.global.t('services.statuses.in_progress'))
    expect(wrapper.html()).toContain(i18n.global.t('services.history'))
    expect(wrapper.html()).toContain(i18n.global.t('common.placeholders.map'))
	})

  it('should exec functions when children emmit events', async () => {
    ServiceRepository.updateStatus = jest.fn().mockResolvedValue({})
    ServiceRepository.update = jest.fn().mockResolvedValue({})
    DriverRepository.onlineDriverListener = jest.fn()
    const swat = jest.spyOn(Swal, 'fire')
    wrapper = mount(Tabs,
      {
        attachTo: '#root',
        global: {
          plugins: [router, i18n],
          provide: {
            'appName': 'test'
          }
        }
      })
    await wrapper.vm.$nextTick()
    const tables = wrapper.findAllComponents(ServicesTable)
    tables.at(1)?.vm.$emit(Service.EVENT_CANCEL)
    await wrapper.vm.$nextTick()
    tables.at(1)?.vm.$emit(Service.EVENT_RELEASE, new ServiceMock)
    await wrapper.vm.$nextTick()
    tables.at(1)?.vm.$emit(Service.EVENT_TERMINATE)
    await wrapper.vm.$nextTick()
    await flushPromises()
    expect(swat).toBeCalledTimes(3)
    wrapper.unmount()
    jest.clearAllMocks()
  })
  
  it('should exec functions when children emmit events and promise fails', async () => {
    ServiceRepository.updateStatus = jest.fn().mockRejectedValue(new Error('Error fake'))
    ServiceRepository.update = jest.fn().mockRejectedValue(new Error('Error fake'))
    const swat = jest.spyOn(Swal, 'fire')
    wrapper = mount(Tabs,
      {
        attachTo: '#root',
        global: {
          plugins: [router, i18n],
          provide: {
            'appName': 'test'
          }
        }
      })
    await nextTick()
    
    const tables = wrapper.findAllComponents(ServicesTable)
    tables.at(1)?.vm.$emit(Service.EVENT_CANCEL)
    await nextTick()
    tables.at(1)?.vm.$emit(Service.EVENT_RELEASE, new ServiceMock)
    await nextTick()
    tables.at(1)?.vm.$emit(Service.EVENT_TERMINATE)
    await flushPromises()
    expect(swat).toBeCalledTimes(3)
    jest.clearAllMocks()
  })
	
	it('an user can show search button in progress tab', async () => {
		await nextTick()
		const tab = wrapper.find('#progress-tab')
		await tab.trigger('click')
		await wrapper.vm.$nextTick()
		
		expect(wrapper.find('input[name="search"]').isVisible()).toBeTruthy()
	})
})