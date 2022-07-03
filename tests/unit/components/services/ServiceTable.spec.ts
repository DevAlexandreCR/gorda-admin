import {mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import ServicesTable from "@/components/services/ServicesTable.vue";
import Service from "@/models/Service";
import ServiceMock from "../../../mocks/entities/ServiceMock";
import DateHelper from "@/helpers/DateHelper";
import DriverMock from '../../../mocks/entities/DriverMock'

describe('ServicesTable.vue', () => {
  let wrapper: VueWrapper<any>
  const service = new Service()
  Object.assign(service, ServiceMock)
  const options = {
    attachTo: '#root',
    props: {
      services: [service, service],
      drivers: [DriverMock],
      isHistory: false
    },
    global: {
      plugins: [router, i18n],
      provide: {
        'appName': 'test'
      }
    },
  }
  beforeEach(async () => {
    wrapper = mount(ServicesTable, options)
    await router.isReady()
  })
  it('an user can see all services passed by props', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toContain(wrapper.vm.$t('services.statuses.pending'))
    expect(wrapper.html()).toContain(service.start_loc.name)
    expect(wrapper.html()).toContain(service.phone)
    expect(wrapper.html()).toContain(service.name)
    expect(wrapper.html()).toContain(DriverMock.vehicle.plate)
    expect(wrapper.findAll('tr').length).toBe(2)
    expect(wrapper.find('.fa-car').exists()).toBeTruthy()
    expect(wrapper.find('.fa-ban').exists()).toBeTruthy()
    expect(wrapper.find('.fa-car-crash').exists()).toBeFalsy()
    expect(wrapper.find('.fa-check').exists()).toBeFalsy()
  })
  
  it('show release and terminate buttons when service is in in_progress status', async () => {
    options.props.isHistory = false
    service.status = Service.STATUS_IN_PROGRESS
    options.props.services = [service]
    wrapper = await mount(ServicesTable, options)
  
    expect(wrapper.find('.fa-car-crash').exists()).toBeTruthy()
    expect(wrapper.find('.fa-check').exists()).toBeTruthy()
    expect(wrapper.find('.fa-ban').exists()).toBeTruthy()
    expect(wrapper.find('.fa-car').exists()).toBeFalsy()
  })
  
  it('emmit events cancel when make click in button cancel', async () => {
    options.props.isHistory = false
    service.status = Service.STATUS_PENDING
    options.props.services = [service]
    wrapper = await mount(ServicesTable, options)
    
    const buttonCancel = wrapper.find('.btn-danger')
    await buttonCancel.trigger('click')
    
    expect(wrapper.emitted(Service.EVENT_CANCEL)).toBeTruthy()
  })
  
  it('emmit events when make click in buttons release and terminate', async () => {
    options.props.isHistory = false
    service.status = Service.STATUS_IN_PROGRESS
    options.props.services = [service]
    wrapper = await mount(ServicesTable, options)
    
    const buttons = wrapper.findAll('.btn-dark')
    await buttons.at(0)?.trigger('click')
    await buttons.at(1)?.trigger('click')
    
    expect(wrapper.emitted(Service.EVENT_RELEASE)).toBeTruthy()
    expect(wrapper.emitted(Service.EVENT_TERMINATE)).toBeTruthy()
  })
})