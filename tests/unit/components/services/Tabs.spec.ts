import {shallowMount, VueWrapper, mount, flushPromises} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import Tabs from "@/components/services/Tabs.vue"
import CreateService from "@/components/services/CreateService.vue"
import ServicesTable from "@/components/services/ServicesTable.vue"
import {DataSnapshot} from "../../../mocks/firebase/FirebaseMock"
import ServiceMock from "../../../mocks/entities/ServiceMock";
import Service from "@/models/Service";
import waitForExpect from 'wait-for-expect'
import ServiceRepository from "@/repositories/ServiceRepository";
import Swal from 'sweetalert2'

describe('Tabs.vue', () => {
  let wrapper: VueWrapper<any>
  const div = document.createElement('div')
  div.id = 'root'
  document.body.appendChild(div)
  beforeEach(async () => {
    wrapper = shallowMount(Tabs,
      {
        attachTo: '#root',
        components: {
          CreateService,
          ServicesTable
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
    await wrapper.vm.$nextTick()
    const snapshot = new DataSnapshot(ServiceMock)
    snapshot.service.status = Service.STATUS_IN_PROGRESS
    wrapper.vm.inProgressServices.push(snapshot)
    snapshot.service.status = Service.STATUS_PENDING
    wrapper.vm.onServiceAdded(snapshot)
    wrapper.vm.onServiceAdded(snapshot)
    expect(wrapper.vm.pendingServices.length).toBe(1)
  })
  
  it('set services on change serviceListener', async () => {
    await wrapper.vm.$nextTick()
    const snapshot = new DataSnapshot(ServiceMock)
    wrapper.vm.pendingServices.push(snapshot)
    snapshot.service.status = Service.STATUS_IN_PROGRESS
  
    await wrapper.vm.onServiceChanged(snapshot)
    
    expect(wrapper.vm.inProgressServices.length).toBe(1)
  })
  
  it('ser historyService on change event', async () => {
    await wrapper.vm.$nextTick()
    const snapshot = new DataSnapshot(ServiceMock)
    snapshot.service.status = Service.STATUS_IN_PROGRESS
    wrapper.vm.inProgressServices.push(snapshot.service)
    wrapper.vm.historyServices.push(snapshot.service)
  
    snapshot.service.status = Service.STATUS_TERMINATED
    await wrapper.vm.onServiceChanged(snapshot)
  
    expect(wrapper.vm.historyServices.length).toBe(1)
  })
  
  it('should exec functions when children emmit events', async () => {
    ServiceRepository.updateStatus = jest.fn().mockResolvedValue({})
    const swat = jest.spyOn(Swal, 'fire')
    wrapper = mount(Tabs,
      {
        attachTo: '#root',
        components: {
          CreateService,
          ServicesTable
        },
        global: {
          plugins: [router, i18n],
          provide: {
            'appName': 'test'
          }
        },
      })
    await wrapper.vm.$nextTick()
  
    const tables = wrapper.findAllComponents(ServicesTable)
    tables.at(1)?.vm.$emit(Service.EVENT_CANCEL)
    await wrapper.vm.$nextTick()
    tables.at(1)?.vm.$emit(Service.EVENT_RELEASE)
    await wrapper.vm.$nextTick()
    tables.at(1)?.vm.$emit(Service.EVENT_TERMINATE)
    await wrapper.vm.$nextTick()
    expect(swat).toBeCalledTimes(3)
    wrapper.unmount()
    jest.clearAllMocks()
  })
  
  it('should exec functions when children emmit events and promise fails', async () => {
    ServiceRepository.updateStatus = jest.fn().mockRejectedValue(new Error('Error fake'))
    const swat = jest.spyOn(Swal, 'fire')
    wrapper = mount(Tabs,
      {
        attachTo: '#root',
        components: {
          CreateService,
          ServicesTable
        },
        global: {
          plugins: [router, i18n],
          provide: {
            'appName': 'test'
          }
        },
      })
    await wrapper.vm.$nextTick()
    
    const tables = wrapper.findAllComponents(ServicesTable)
    tables.at(1)?.vm.$emit(Service.EVENT_CANCEL)
    await wrapper.vm.$nextTick()
    tables.at(1)?.vm.$emit(Service.EVENT_RELEASE)
    await wrapper.vm.$nextTick()
    tables.at(1)?.vm.$emit(Service.EVENT_TERMINATE)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(swat).toBeCalledTimes(3)
  })
})