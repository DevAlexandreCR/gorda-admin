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

function buildService(status = Service.STATUS_IN_PROGRESS): ServiceList {
  const service = new ServiceList()
  Object.assign(service, new ServiceMock(), { status, driver: null })
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
})
