const mockVehicleFindById = jest.fn()

let onAddedListener: ((driver: any) => Promise<void> | void) | undefined
let onChangedListener: ((driver: any) => Promise<void> | void) | undefined
let onRemovedListener: ((driver: any) => void) | undefined

import { createPinia, setActivePinia } from 'pinia'
import Driver from '@/models/Driver'
import DriverRepository from '@/repositories/DriverRepository'
import VehicleRepository from '@/repositories/VehicleRepository'
import { useDriversStore } from '@/services/stores/DriversStore'
import { DriverConnectedInterface } from '@/types/DriverConnectedInterface'

function buildDriver(overrides: Partial<Driver> = {}): Driver {
  const driver = new Driver()
  Object.assign(driver, {
    id: 'driver-1',
    name: 'Driver One',
    vehicle: { plate: 'LEGACY123' },
    ...overrides,
  })
  return driver
}

function buildPresence(overrides: Partial<DriverConnectedInterface> = {}): DriverConnectedInterface {
  return {
    id: 'driver-1',
    vehicle_id: 'veh-1',
    location: {
      lat: 1,
      lng: 2,
    },
    ...overrides,
  }
}

describe('DriversStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockVehicleFindById.mockReset()
    onAddedListener = undefined
    onChangedListener = undefined
    onRemovedListener = undefined
    jest.spyOn(DriverRepository, 'onlineDriverListener').mockImplementation((onAdded, onChanged, onRemoved) => {
      onAddedListener = onAdded
      onChangedListener = onChanged
      onRemovedListener = onRemoved
    })
    jest.spyOn(DriverRepository, 'removeOnlineDriverListener').mockImplementation(() => undefined)
    jest.spyOn(VehicleRepository, 'findById').mockImplementation(mockVehicleFindById)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('uses vehicle_plate from RTDB as marker name', async () => {
    const store = useDriversStore()
    store.addDriver(buildDriver())
    store.getOnlineDrivers()

    await onAddedListener?.(buildPresence({ vehicle_plate: 'ABC123' }))

    expect(store.connectedDrivers).toHaveLength(1)
    expect(store.connectedDrivers[0]).toEqual(
      expect.objectContaining({
        key: 'driver-1',
        name: 'ABC123',
      })
    )
    expect(mockVehicleFindById).not.toHaveBeenCalled()
  })

  it('resolves a legacy vehicle_id through VehicleRepository.findById', async () => {
    const store = useDriversStore()
    store.addDriver(buildDriver({ vehicle: { plate: 'OLDPLATE' } as any }))
    store.getOnlineDrivers()
    mockVehicleFindById.mockResolvedValue({
      id: 'veh-1',
      plate: 'ABC123',
    })

    await onAddedListener?.(buildPresence({ vehicle_plate: undefined }))

    expect(mockVehicleFindById).toHaveBeenCalledWith('veh-1')
    expect(store.connectedDrivers).toHaveLength(1)
    expect(store.connectedDrivers[0].name).toBe('ABC123')
  })

  it('does not use selected vehicle plate when it does not match the connected vehicle_id', async () => {
    const store = useDriversStore()
    store.addDriver(
      buildDriver({
        selected_vehicle_id: 'veh-selected',
        selected_vehicle: {
          id: 'veh-selected',
          plate: 'SELECTED999',
        } as any,
        vehicle: { plate: 'LEGACY123' } as any,
      })
    )
    store.getOnlineDrivers()
    mockVehicleFindById.mockRejectedValue(new Error('not found'))

    await onAddedListener?.(buildPresence({ vehicle_id: 'veh-other', vehicle_plate: undefined }))

    expect(store.connectedDrivers).toHaveLength(1)
    expect(store.connectedDrivers[0].name).toBe('LEGACY123')
  })

  it('updates the existing connected driver entry on change instead of duplicating it', async () => {
    const store = useDriversStore()
    store.addDriver(buildDriver())
    store.setOccupiedDriver('driver-1')
    store.getOnlineDrivers()

    await onAddedListener?.(
      buildPresence({
        vehicle_plate: 'ABC123',
        location: { lat: 1, lng: 2 },
      })
    )
    await onChangedListener?.(
      buildPresence({
        vehicle_plate: 'XYZ987',
        location: { lat: 5, lng: 6 },
      })
    )

    expect(onRemovedListener).toBeDefined()
    expect(store.connectedDrivers).toHaveLength(1)
    expect(store.connectedDrivers[0]).toEqual(
      expect.objectContaining({
        key: 'driver-1',
        name: 'XYZ987',
        lat: 5,
        lng: 6,
        color: 'danger',
      })
    )
  })
})
