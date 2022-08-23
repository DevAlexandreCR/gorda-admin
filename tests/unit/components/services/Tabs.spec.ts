import {flushPromises, mount, shallowMount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import Tabs from '@/components/services/Tabs.vue'
import CreateService from '@/components/services/CreateService.vue'
import ServicesTable from '@/components/services/ServicesTable.vue'
import {DataSnapshot} from '../../../mocks/firebase/FirebaseMock'
import ServiceMock from '../../../mocks/entities/ServiceMock'
import Service from '@/models/Service'
import ServiceRepository from '@/repositories/ServiceRepository'
import Swal from 'sweetalert2'
import {nextTick} from 'vue'

describe('Tabs.vue', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = shallowMount(Tabs,
      {
        attachTo: '#root',
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
    await wrapper.vm.$nextTick()
    const tables = wrapper.findAllComponents(ServicesTable)
    const form = wrapper.findComponent(CreateService)
    const tabs = wrapper.findAll('.nav-item')
    expect(tables.length).toBe(3)
    expect(tabs.length).toBe(4)
    expect(form.exists()).toBeTruthy()
    expect(wrapper.html()).toContain(wrapper.vm.$t('services.statuses.pending'))
    expect(wrapper.html()).toContain(wrapper.vm.$t('services.statuses.in_progress'))
    expect(wrapper.html()).toContain(wrapper.vm.$t('services.history'))
    expect(wrapper.html()).toContain(wrapper.vm.$t('common.placeholders.map'))
  })
  
  it('set services on add serviceListener', async () => {
    await nextTick()
    const snapshot = new DataSnapshot(ServiceMock)
    snapshot.service.status = Service.STATUS_IN_PROGRESS
    wrapper.vm.services.inProgress.push(snapshot)
    snapshot.service.status = Service.STATUS_PENDING
    wrapper.vm.onServiceAdded(snapshot)
    wrapper.vm.onServiceAdded(snapshot)
    await nextTick()
    expect(wrapper.vm.services.pending.length).toBe(2)
  })
  
  it('set services on change serviceListener', async () => {
    await nextTick()
    const snapshot = new DataSnapshot(ServiceMock)
    wrapper.vm.onServiceAdded(snapshot)
    await nextTick()
    snapshot.service.status = Service.STATUS_IN_PROGRESS
    await wrapper.vm.onServiceChanged(snapshot)
    await nextTick()

    expect(wrapper.vm.services.inProgress.length).toBe(1)
  })
  
  it('ser historyService on change event', async () => {
    await wrapper.vm.$nextTick()
    const snapshot = new DataSnapshot(ServiceMock)
    snapshot.service.status = Service.STATUS_IN_PROGRESS
    wrapper.vm.onServiceAdded(snapshot)
    await nextTick()

    snapshot.service.status = Service.STATUS_TERMINATED
    await wrapper.vm.onServiceChanged(snapshot)
    await nextTick()
    expect(wrapper.vm.services.history.length).toBe(1)
  })
  
  it('should exec functions when children emmit events', async () => {
    ServiceRepository.updateStatus = jest.fn().mockResolvedValue({})
    ServiceRepository.update = jest.fn().mockResolvedValue({})
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
    await flushPromises()
    const tables = wrapper.findAllComponents(ServicesTable)
    tables.at(1)?.vm.$emit(Service.EVENT_CANCEL)
    await wrapper.vm.$nextTick()
    tables.at(1)?.vm.$emit(Service.EVENT_RELEASE, ServiceMock)
    await wrapper.vm.$nextTick()
    tables.at(1)?.vm.$emit(Service.EVENT_TERMINATE)
    await wrapper.vm.$nextTick()
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
    await wrapper.vm.$nextTick()
    
    const tables = wrapper.findAllComponents(ServicesTable)
    tables.at(1)?.vm.$emit(Service.EVENT_CANCEL)
    await wrapper.vm.$nextTick()
    tables.at(1)?.vm.$emit(Service.EVENT_RELEASE, ServiceMock)
    await wrapper.vm.$nextTick()
    tables.at(1)?.vm.$emit(Service.EVENT_TERMINATE)
    await flushPromises()
    expect(swat).toBeCalledTimes(3)
    jest.clearAllMocks()
  })
})