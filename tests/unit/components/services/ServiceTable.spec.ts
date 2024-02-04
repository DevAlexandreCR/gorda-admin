import {mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import ServicesTable from '@/components/services/ServicesTable.vue'
import Service from '@/models/Service'
import ServiceMock from '../../../mocks/entities/ServiceMock'
import DriverMock from '../../../mocks/entities/DriverMock'
import {nextTick} from 'vue'
import {useDriversStore} from '@/services/stores/DriversStore'
import DriverRepository from '@/repositories/DriverRepository'
import DateHelper from '@/helpers/DateHelper'
import {ServiceList} from '@/models/ServiceList'
import {Tables} from '@/constants/Tables'
import {Pagination} from '@/types/Pagination'
import SettingsRepository from '@/repositories/SettingsRepository'
import {useWpClientsStore} from '@/services/stores/WpClientStore'

describe('ServicesTable.vue', () => {
  let wrapper: VueWrapper<any>

  const pagination: Pagination = {
    currentPage: 1,
    perPage: 2,
    cursor: {
      id: '',
      created: DateHelper.endOfDayUnix()
    },
    totalCount: 10
  }

  const options = {
    attachTo: '#root',
    props: {
      services: Array<ServiceList>(),
      drivers: [DriverMock],
      table: Tables.pendings,
      pagination: pagination
    },
    global: {
      plugins: [router, i18n],
      provide: {
        'appName': 'test'
      }
    }
  }
  let service: ServiceList

  beforeEach(async () => {
    service = new ServiceList()
    Object.assign(service, new ServiceMock)
    options.props.services = [service, service]
    const wpClient = useWpClientsStore()
    wpClient.clients = {
      3103794656: {
        id: '3103794656',
        alias: 'Principal',
        wpNotifications: false,
        chatBot: false
      }
    }

    jest.useFakeTimers()
    DriverRepository.getAll = jest.fn().mockResolvedValue(options.props.drivers)
    SettingsRepository.getWpClients = jest.fn().mockResolvedValue([])
    const driverStore= useDriversStore()
    await driverStore.getDrivers()
    wrapper = mount(ServicesTable, options)
    await router.isReady()
  })
  it('an user can see all services passed by props', async () => {
    await nextTick()
    jest.advanceTimersByTime(2000)
    expect(wrapper.html()).toContain(i18n.global.t('services.statuses.pending'))
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

  it('an user can see date in history', async () => {
    options.props.table = Tables.history
    wrapper = mount(ServicesTable, options)
    await nextTick()
    expect(wrapper.html()).toContain(DateHelper.unixToDate(service.created_at, 'MM-DD HH:mm:ss'))
  })

  it('show release and terminate buttons when service is in in_progress status', async () => {
    service.status = Service.STATUS_IN_PROGRESS
    options.props = {
      services: [service],
      drivers: [DriverMock],
      table: Tables.inProgress,
      pagination: pagination
    }
    wrapper = mount(ServicesTable, options)

    await nextTick()

    expect(wrapper.find('.fa-car-crash').exists()).toBeTruthy()
    expect(wrapper.find('.fa-check').exists()).toBeTruthy()
    expect(wrapper.find('.fa-ban').exists()).toBeTruthy()
    expect(wrapper.find('.fa-car').exists()).toBeFalsy()
  })

  it('emmit events cancel when make click in button cancel', async () => {
    service.status = Service.STATUS_PENDING
    options.props = {
      services: [service],
      drivers: [DriverMock],
      table: Tables.pendings,
      pagination: pagination
    }
    wrapper = mount(ServicesTable, options)

    await nextTick()

    const buttonCancel = wrapper.find('.btn-danger')
    await buttonCancel.trigger('click')

    expect(wrapper.emitted(Service.EVENT_CANCEL)).toBeTruthy()
  })

  it('emmit events when make click in buttons release and terminate', async () => {
    service.status = Service.STATUS_IN_PROGRESS
    options.props = {
      services: [service],
      drivers: [DriverMock],
      table: Tables.inProgress,
      pagination: pagination
    }
    wrapper = mount(ServicesTable, options)

    await nextTick()

    const buttons = wrapper.findAll('.btn-dark')
    await buttons.at(0)?.trigger('click')
    await buttons.at(1)?.trigger('click')

    expect(wrapper.emitted(Service.EVENT_RELEASE)).toBeTruthy()
    expect(wrapper.emitted(Service.EVENT_TERMINATE)).toBeTruthy()
  })
})