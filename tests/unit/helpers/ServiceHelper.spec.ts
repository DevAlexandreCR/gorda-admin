import ServiceHelper from '@/helpers/ServiceHelper'
import ServiceMock from '../../../tests/mocks/entities/ServiceMock'
import { ServiceList } from '@/models/ServiceList'

describe('ServiceHelper.vehiclePlate', () => {
  it('returns service.vehicle.plate when the service-bound snapshot is present', () => {
    const service = new ServiceMock() as unknown as ServiceList
    service.vehicle = { plate: 'RJV856', brand: 'Chevrolet', model: 'Spark', color: { name: 'red', hex: '#ff0000' } }
    service.driver = { ...service.driver, selected_vehicle: { plate: 'XYZ789' } } as ServiceList['driver']

    expect(ServiceHelper.vehiclePlate(service)).toBe('RJV856')
  })

  it('falls back to driver.selected_vehicle.plate when service.vehicle is absent', () => {
    const service = new ServiceMock() as unknown as ServiceList
    service.vehicle = null
    service.driver = { ...service.driver, selected_vehicle: { plate: 'PLQ767' } } as ServiceList['driver']

    expect(ServiceHelper.vehiclePlate(service)).toBe('PLQ767')
  })

  it('returns an empty string when both service.vehicle and driver.selected_vehicle are absent', () => {
    const service = new ServiceMock() as unknown as ServiceList
    service.vehicle = null
    service.driver = { ...service.driver, selected_vehicle: null } as ServiceList['driver']

    expect(ServiceHelper.vehiclePlate(service)).toBe('')
  })

  it('returns an empty string when the driver itself is absent', () => {
    const service = new ServiceMock() as unknown as ServiceList
    service.vehicle = null
    service.driver = null

    expect(ServiceHelper.vehiclePlate(service)).toBe('')
  })

  it('never reads the legacy driver.vehicle field', () => {
    const service = new ServiceMock() as unknown as ServiceList
    service.vehicle = null
    // Legacy driver.vehicle.plate is 'HEM390' per DriverMock; selected_vehicle is absent too.
    service.driver = { ...service.driver, selected_vehicle: null } as ServiceList['driver']

    expect(ServiceHelper.vehiclePlate(service)).not.toBe('HEM390')
    expect(ServiceHelper.vehiclePlate(service)).toBe('')
  })
})
