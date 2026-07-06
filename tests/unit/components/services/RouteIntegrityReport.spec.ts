import { mount, VueWrapper, flushPromises } from '@vue/test-utils'
import RouteIntegrityReport from '@/components/services/RouteIntegrityReport.vue'
import i18n from '@/plugins/i18n'
import ServiceRepository from '@/repositories/ServiceRepository'
import { useDriversStore } from '@/services/stores/DriversStore'
import { useServicesStore } from '@/services/stores/ServiceStore'
import Driver from '@/models/Driver'
import DriverMock from '../../../mocks/entities/DriverMock'
import ServiceMock from '../../../mocks/entities/ServiceMock'
import Service from '@/models/Service'
import { ServiceList } from '@/models/ServiceList'
import { RouteIntegrityMetric } from '@/types/RouteIntegrityMetric'

describe('RouteIntegrityReport.vue', () => {
  let wrapper: VueWrapper<any>

  const options = {
    attachTo: '#root',
    global: {
      plugins: [i18n],
      provide: {
        appName: 'test',
      },
    },
  }

  beforeEach(() => {
    const driversStore = useDriversStore()
    driversStore.drivers.splice(0)
    driversStore.drivers.push(Object.assign(new Driver(), DriverMock))

    ServiceRepository.getRouteIntegrityReport = jest.fn().mockResolvedValue([])
    ServiceRepository.getHistoryPage = jest.fn().mockResolvedValue({
      services: [],
      totalCount: 0,
      terminatedCount: 0,
      canceledCount: 0,
    })
  })

  it('loads the report through ServiceRepository.getRouteIntegrityReport for the selected date range and renders driver name, totals, and flagged count', async () => {
    const row: RouteIntegrityMetric = {
      driver_id: DriverMock.id,
      total_trips: 10,
      flagged_trips: 7,
      flagged_ratio: 0.7,
    }
    ServiceRepository.getRouteIntegrityReport = jest.fn().mockResolvedValue([row])

    wrapper = mount(RouteIntegrityReport, options)
    await flushPromises()

    expect(ServiceRepository.getRouteIntegrityReport).toHaveBeenCalledTimes(1)
    const callArg = (ServiceRepository.getRouteIntegrityReport as jest.Mock).mock.calls[0][0]
    expect(typeof callArg.from).toBe('number')
    expect(typeof callArg.to).toBe('number')
    expect(callArg.from).toBeLessThanOrEqual(callArg.to)

    expect(wrapper.text()).toContain(DriverMock.name)
    expect(wrapper.find('.gorda-route-integrity__row').exists()).toBe(true)
    const cells = wrapper.findAll('.gorda-route-integrity__row td')
    expect(cells[0].text()).toBe(DriverMock.name)
    expect(cells[1].text()).toBe('10')
    expect(cells[2].text()).toBe('7')
  })

  it('renders a flagged_ratio float in [0,1] as a percentage without a 100x mismatch', async () => {
    const row: RouteIntegrityMetric = {
      driver_id: DriverMock.id,
      total_trips: 10,
      flagged_trips: 7,
      flagged_ratio: 0.7,
    }
    ServiceRepository.getRouteIntegrityReport = jest.fn().mockResolvedValue([row])

    wrapper = mount(RouteIntegrityReport, options)
    await flushPromises()

    expect(wrapper.vm.formatRatio(0.7)).toBe('70%')
    expect(wrapper.find('.gorda-route-integrity__ratio-badge').text()).toBe('70%')
    expect(wrapper.text()).not.toContain('7000%')
    expect(wrapper.text()).not.toContain('0.7%')
  })

  it('REGRESSION (design.md Decision 3): drilling into a driver row does not mutate ServiceStore history state', async () => {
    const servicesStore = useServicesStore()
    const existingService = Object.assign(new ServiceList(), new ServiceMock())
    servicesStore.history.splice(0)
    servicesStore.history.push(existingService)
    servicesStore.pagination.currentPage = 3
    servicesStore.pagination.perPage = 20
    servicesStore.pagination.totalCount = 42
    servicesStore.pagination.cursor = { id: 'history-cursor', created: 12345 }
    servicesStore.filter.driverId = 'another-driver-id'
    servicesStore.filter.clientId = 'another-client-id'
    servicesStore.filter.from = '2026-01-01'
    servicesStore.filter.to = '2026-01-31'
    servicesStore.currentCursor.id = 'unrelated-cursor'
    servicesStore.currentCursor.created = 999

    const historySnapshot = JSON.parse(JSON.stringify(servicesStore.history))
    const paginationSnapshot = JSON.parse(JSON.stringify(servicesStore.pagination))
    const filterSnapshot = JSON.parse(JSON.stringify(servicesStore.filter))
    const cursorSnapshot = JSON.parse(JSON.stringify(servicesStore.currentCursor))

    const getHistoryServicesSpy = jest.spyOn(servicesStore, 'getHistoryServices')

    const row: RouteIntegrityMetric = {
      driver_id: DriverMock.id,
      total_trips: 5,
      flagged_trips: 5,
      flagged_ratio: 1,
    }
    ServiceRepository.getRouteIntegrityReport = jest.fn().mockResolvedValue([row])
    const drillDownService = Object.assign(new Service(), new ServiceMock())
    ServiceRepository.getHistoryPage = jest.fn().mockResolvedValue({
      services: [drillDownService],
      totalCount: 1,
      terminatedCount: 1,
      canceledCount: 0,
    })

    wrapper = mount(RouteIntegrityReport, options)
    await flushPromises()

    const driverRow = wrapper.find('.gorda-route-integrity__row')
    expect(driverRow.exists()).toBe(true)
    await driverRow.trigger('click')
    await flushPromises()

    expect(ServiceRepository.getHistoryPage).toHaveBeenCalledTimes(1)
    const drillDownCallArg = (ServiceRepository.getHistoryPage as jest.Mock).mock.calls[0][0]
    expect(drillDownCallArg.routeIntegrity).toBe('flagged')
    expect(drillDownCallArg.driverId).toBe(DriverMock.id)

    expect(getHistoryServicesSpy).not.toHaveBeenCalled()
    expect(JSON.parse(JSON.stringify(servicesStore.history))).toEqual(historySnapshot)
    expect(JSON.parse(JSON.stringify(servicesStore.pagination))).toEqual(paginationSnapshot)
    expect(JSON.parse(JSON.stringify(servicesStore.filter))).toEqual(filterSnapshot)
    expect(JSON.parse(JSON.stringify(servicesStore.currentCursor))).toEqual(cursorSnapshot)
  })
})
