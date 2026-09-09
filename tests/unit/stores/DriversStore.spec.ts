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
    // The presence queue (`pending` + the scheduled flush handle) is module-level, not
    // store state, so it survives across store instances: reset it via the public
    // action to avoid leaking a pending flush (or a scheduling guard) into the next test.
    useDriversStore().offOnlineDrivers()
    jest.restoreAllMocks()
  })

  it('uses vehicle_plate from RTDB as marker name', async () => {
    const store = useDriversStore()
    store.addDriver(buildDriver())
    store.getOnlineDrivers()

    await onAddedListener?.(buildPresence({ vehicle_plate: 'ABC123' }))
    store.flush()

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
    store.flush()

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
    store.flush()

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
    store.flush()

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

  describe('two-phase plate resolution through the queue', () => {
    it('cache miss paints fallback immediately then patches name once', async () => {
      const store = useDriversStore()
      store.addDriver(buildDriver({ vehicle: undefined as any }))
      store.getOnlineDrivers()

      let resolvePlate: (value: { id: string; plate: string }) => void = () => undefined
      mockVehicleFindById.mockImplementationOnce(
        () => new Promise(resolve => { resolvePlate = resolve })
      )

      const presencePromise = onAddedListener?.(
        buildPresence({ vehicle_id: 'veh-1', vehicle_plate: undefined })
      )
      store.flush()

      expect(store.connectedDrivers).toHaveLength(1)
      expect(store.connectedDrivers[0].name).toBe('Driver One')

      resolvePlate({ id: 'veh-1', plate: 'ABC123' })
      await presencePromise
      store.flush()

      expect(mockVehicleFindById).toHaveBeenCalledTimes(1)
      expect(store.connectedDrivers).toHaveLength(1)
      expect(store.connectedDrivers[0].name).toBe('ABC123')
    })

    it('cache hit enqueues once', async () => {
      const store = useDriversStore()
      store.addDriver(buildDriver())
      store.vehiclePlateCache['veh-1'] = 'CACHED123'
      store.getOnlineDrivers()
      const enqueueSpy = jest.spyOn(store, 'enqueueUpsert')

      await onAddedListener?.(buildPresence({ vehicle_id: 'veh-1', vehicle_plate: undefined }))
      store.flush()

      expect(enqueueSpy).toHaveBeenCalledTimes(1)
      expect(mockVehicleFindById).not.toHaveBeenCalled()
      expect(store.connectedDrivers).toHaveLength(1)
      expect(store.connectedDrivers[0].name).toBe('CACHED123')
    })

    it('name patch keeps a location that arrived in between', async () => {
      const store = useDriversStore()
      store.addDriver(buildDriver({ vehicle: undefined as any }))
      store.getOnlineDrivers()

      let resolvePlate: (value: { id: string; plate: string }) => void = () => undefined
      mockVehicleFindById.mockImplementationOnce(
        () => new Promise(resolve => { resolvePlate = resolve })
      )

      const presencePromise = onAddedListener?.(
        buildPresence({ vehicle_id: 'veh-1', vehicle_plate: undefined, location: { lat: 1, lng: 2 } })
      )

      // A location update for the same driver lands in the queue while the plate lookup
      // is still in flight — it must not be reverted by the deferred name patch.
      store.enqueueUpsert('driver-1', {
        id: 'driver-1',
        key: 'driver-1',
        name: 'Driver One',
        lat: 9,
        lng: 9,
      })

      resolvePlate({ id: 'veh-1', plate: 'ABC123' })
      await presencePromise
      store.flush()

      expect(store.connectedDrivers).toHaveLength(1)
      expect(store.connectedDrivers[0]).toEqual(
        expect.objectContaining({ lat: 9, lng: 9, name: 'ABC123' })
      )
    })
  })

  describe('presence event batching queue', () => {
    it('coalesces an add followed by a remove for the same driver in one batch into no entry', async () => {
      const store = useDriversStore()
      store.getOnlineDrivers()

      await onAddedListener?.(buildPresence({ vehicle_plate: 'ABC123' }))
      onRemovedListener?.(buildPresence({ vehicle_plate: 'ABC123' }))
      store.flush()

      expect(store.connectedDrivers).toHaveLength(0)
    })

    it('coalesces a remove followed by an add for the same driver in one batch into an entry present', async () => {
      const store = useDriversStore()
      store.getOnlineDrivers()

      onRemovedListener?.(buildPresence({ vehicle_plate: 'ABC123' }))
      await onAddedListener?.(buildPresence({ vehicle_plate: 'ABC123' }))
      store.flush()

      expect(store.connectedDrivers).toHaveLength(1)
      expect(store.connectedDrivers[0]).toEqual(
        expect.objectContaining({ key: 'driver-1', name: 'ABC123' })
      )
    })

    it('flushes 40 coalesced driver changes in a single array assignment via the setTimeout fallback', async () => {
      const store = useDriversStore()
      const originalRaf = window.requestAnimationFrame
      jest.useFakeTimers()
      // Jest's modern fake timers install their own fake requestAnimationFrame; delete it
      // (after enabling fake timers, so it is not reinstalled) to force the setTimeout fallback branch.
      delete (window as any).requestAnimationFrame

      try {
        const flushSpy = jest.spyOn(store, 'flush')
        store.getOnlineDrivers()

        for (let i = 0; i < 40; i++) {
          await onAddedListener?.(buildPresence({ id: `driver-${i}`, vehicle_plate: `PLATE${i}` }))
        }

        expect(store.connectedDrivers).toHaveLength(0)

        jest.advanceTimersByTime(0)

        expect(flushSpy).toHaveBeenCalledTimes(1)
        expect(store.connectedDrivers).toHaveLength(40)
        expect(store.connectedDrivers.map(d => d.name).sort()).toEqual(
          Array.from({ length: 40 }, (_, i) => `PLATE${i}`).sort()
        )
      } finally {
        jest.useRealTimers()
        window.requestAnimationFrame = originalRaf
      }
    })

    it('schedules the rAF flush exactly once per burst and coalesces multiple events', async () => {
      const store = useDriversStore()
      store.getOnlineDrivers()

      const originalRaf = window.requestAnimationFrame
      const rafQueue: FrameRequestCallback[] = []
      let rafCallCount = 0
      window.requestAnimationFrame = ((cb: FrameRequestCallback): number => {
        rafCallCount++
        rafQueue.push(cb)
        return rafQueue.length
      }) as typeof window.requestAnimationFrame

      try {
        await onAddedListener?.(buildPresence({ vehicle_plate: 'ABC123' }))
        await onChangedListener?.(buildPresence({ vehicle_plate: 'XYZ987', location: { lat: 5, lng: 6 } }))
        await onAddedListener?.(buildPresence({ id: 'driver-2', vehicle_plate: 'DEF456', location: { lat: 9, lng: 9 } }))

        expect(rafCallCount).toBe(1)
        expect(store.connectedDrivers).toHaveLength(0)

        rafQueue.forEach(cb => cb(0))

        expect(store.connectedDrivers).toHaveLength(2)
        expect(store.connectedDrivers.find(d => d.key === 'driver-1')).toEqual(
          expect.objectContaining({ name: 'XYZ987', lat: 5, lng: 6 })
        )
        expect(store.connectedDrivers.find(d => d.key === 'driver-2')).toEqual(
          expect.objectContaining({ name: 'DEF456' })
        )
      } finally {
        window.requestAnimationFrame = originalRaf
      }
    })

    it('offOnlineDrivers cancels the scheduled flush and clears the queue', async () => {
      const store = useDriversStore()
      store.getOnlineDrivers()

      await onAddedListener?.(buildPresence({ vehicle_plate: 'ABC123' }))
      store.offOnlineDrivers()
      store.flush()

      expect(store.connectedDrivers).toHaveLength(0)
    })
  })

  describe('occupancy colour patch', () => {
    it('assign then release leaves no hole', () => {
      const store = useDriversStore()

      store.setOccupiedDriver('driver-1')
      store.setOccupiedDriver('driver-2')
      store.removeOccupiedDriver('driver-1')

      expect(store.occupiedDrivers).toEqual(['driver-2'])
    })

    it('duplicate assign then single release frees the driver', () => {
      const store = useDriversStore()

      store.setOccupiedDriver('driver-1')
      store.setOccupiedDriver('driver-1')
      expect(store.occupiedDrivers).toEqual(['driver-1'])

      store.removeOccupiedDriver('driver-1')

      expect(store.occupiedDrivers).toEqual([])
    })

    it('setOccupiedDriver recolours a connected driver without a heartbeat', async () => {
      const store = useDriversStore()
      store.addDriver(buildDriver())
      store.getOnlineDrivers()

      await onAddedListener?.(buildPresence({ vehicle_plate: 'ABC123' }))
      store.flush()
      expect(store.connectedDrivers[0]).toEqual(
        expect.objectContaining({ key: 'driver-1', color: undefined })
      )

      store.setOccupiedDriver('driver-1')
      store.flush()

      expect(store.connectedDrivers).toHaveLength(1)
      expect(store.connectedDrivers[0]).toEqual(
        expect.objectContaining({ key: 'driver-1', name: 'ABC123', lat: 1, lng: 2, color: 'danger' })
      )

      store.removeOccupiedDriver('driver-1')
      store.flush()

      expect(store.connectedDrivers[0]).toEqual(
        expect.objectContaining({ key: 'driver-1', color: undefined })
      )
    })

    it('occupancy change for an unconnected driver leaves the collection untouched', () => {
      const store = useDriversStore()
      store.getOnlineDrivers()

      store.setOccupiedDriver('ghost-driver')
      store.flush()
      expect(store.connectedDrivers).toHaveLength(0)

      store.removeOccupiedDriver('ghost-driver')
      store.flush()
      expect(store.connectedDrivers).toHaveLength(0)
      expect(store.occupiedDrivers).toEqual([])
    })
  })
})
