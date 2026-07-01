import { useDriversStore } from '@/services/stores/DriversStore'
import { useServicesStore } from '@/services/stores/ServiceStore'
import Driver from '@/models/Driver'
import DriverMock from '../../mocks/entities/DriverMock'
import ServiceMock from '../../mocks/entities/ServiceMock'
import { ServiceList } from '@/models/ServiceList'
import Service from '@/models/Service'

function buildDriver(): Driver {
  const driver = new Driver()
  Object.assign(driver, DriverMock)
  return driver
}

function buildService(status = Service.STATUS_IN_PROGRESS, overrides: Partial<ServiceList> = {}): ServiceList {
  const service = new ServiceList()
  Object.assign(service, new ServiceMock(), { status, driver: null }, overrides)
  return service
}

function buildSnapshot(service: ServiceList): { key: string; val: () => Omit<ServiceList, 'id' | 'driver'> } {
  const { id: _id, driver: _driver, ...payload } = service as ServiceList & { driver?: Driver | null }

  return {
    key: service.id,
    val: () => payload as Omit<ServiceList, 'id' | 'driver'>,
  }
}

describe('ServiceStore', () => {
  beforeEach(() => {
    const driversStore = useDriversStore()
    const servicesStore = useServicesStore()
    driversStore.drivers.splice(0, driversStore.drivers.length)
    servicesStore.pendings.splice(0, servicesStore.pendings.length)
    servicesStore.inProgress.splice(0, servicesStore.inProgress.length)
    servicesStore.history.splice(0, servicesStore.history.length)
  })

  it('rehydrates an in-progress service when the driver arrives later without replacing the service instance', () => {
    const driversStore = useDriversStore()
    const servicesStore = useServicesStore()
    const service = servicesStore.setServiceFromDB(buildSnapshot(buildService()) as any)

    servicesStore.inProgress.push(service)

    expect(servicesStore.inProgress[0].driver).toBeNull()

    const originalReference = servicesStore.inProgress[0]
    driversStore.addDriver(buildDriver())
    servicesStore.rehydrateServiceDrivers()

    expect(servicesStore.inProgress[0]).toBe(originalReference)
    expect(servicesStore.inProgress[0].driver?.id).toBe(DriverMock.id)
  })

  it('attaches the driver immediately when services arrive after drivers are loaded', () => {
    const driversStore = useDriversStore()
    const servicesStore = useServicesStore()

    driversStore.addDriver(buildDriver())

    const service = servicesStore.setServiceFromDB(buildSnapshot(buildService()) as any)

    expect(service.driver?.id).toBe(DriverMock.id)
    expect(service.driver?.vehicle.plate).toBe(DriverMock.vehicle.plate)
  })

  it('rehydrates history services after the driver store is refreshed', () => {
    const driversStore = useDriversStore()
    const servicesStore = useServicesStore()
    const servicePayload = buildService(Service.STATUS_TERMINATED)
    const historyService = servicesStore.setServiceFromFS(Object.assign(new Service(), servicePayload))

    servicesStore.history.push(historyService)

    expect(servicesStore.history[0].driver).toBeNull()

    driversStore.addDriver(buildDriver())
    servicesStore.rehydrateServiceDrivers()

    expect(servicesStore.history[0].driver?.id).toBe(DriverMock.id)
  })

  describe('vehicle snapshot propagation', () => {
    const vehicle = { plate: 'ABC123', brand: 'Toyota', model: 'Corolla', color: { name: 'Red', hex: '#FF0000' } }

    it('setServiceFromDB copies the RTDB vehicle snapshot onto the ServiceList when present', () => {
      const servicesStore = useServicesStore()
      const service = servicesStore.setServiceFromDB(buildSnapshot(buildService(Service.STATUS_IN_PROGRESS, { vehicle })) as any)

      expect(service.vehicle).toEqual(vehicle)
    })

    it('setServiceFromDB yields vehicle: null when the snapshot has no vehicle child', () => {
      const servicesStore = useServicesStore()
      const service = servicesStore.setServiceFromDB(buildSnapshot(buildService()) as any)

      expect(service.vehicle).toBeNull()
    })

    it('setServiceFromFS copies the API vehicle onto the ServiceList when present', () => {
      const servicesStore = useServicesStore()
      const servicePayload = buildService(Service.STATUS_TERMINATED, { vehicle })
      const historyService = servicesStore.setServiceFromFS(Object.assign(new Service(), servicePayload))

      expect(historyService.vehicle).toEqual(vehicle)
    })

    it('setServiceFromFS yields vehicle: null when the API payload has no vehicle', () => {
      const servicesStore = useServicesStore()
      const servicePayload = buildService(Service.STATUS_TERMINATED)
      const historyService = servicesStore.setServiceFromFS(Object.assign(new Service(), servicePayload))

      expect(historyService.vehicle).toBeNull()
    })
  })

  describe('filterInProgressServices', () => {
    it('matches a service on the resolved RTDB vehicle snapshot plate', () => {
      const servicesStore = useServicesStore()
      const driver = buildDriver()
      const service = buildService(Service.STATUS_IN_PROGRESS, { driver, vehicle: { plate: 'XYZ999', brand: 'Toyota', model: 'Corolla', color: { name: 'Red', hex: '#FF0000' } } })
      servicesStore.inProgress.push(service)

      const result = servicesStore.filterInProgressServices('xyz999')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(service.id)
    })

    it('matches a service on the driver.selected_vehicle plate when there is no vehicle snapshot', () => {
      const servicesStore = useServicesStore()
      const driver = buildDriver()
      driver.selected_vehicle = { id: 'vehicle-1', plate: 'SEL777', brand: 'Kia', model: 'Rio', color: { name: 'Blue', hex: '#0000FF' } } as any
      const service = buildService(Service.STATUS_IN_PROGRESS, { driver })
      servicesStore.inProgress.push(service)

      const result = servicesStore.filterInProgressServices('sel777')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(service.id)
    })

    it('does not match a service on the legacy driver.vehicle plate', () => {
      const servicesStore = useServicesStore()
      const driver = buildDriver()
      driver.vehicle.plate = 'LEGACY1'
      const service = buildService(Service.STATUS_IN_PROGRESS, { driver })
      servicesStore.inProgress.push(service)

      const result = servicesStore.filterInProgressServices('legacy1')

      expect(result).toHaveLength(0)
    })
  })
})
