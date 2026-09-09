import { defineStore } from 'pinia'
import Driver from '@/models/Driver'
import DriverRepository from '@/repositories/DriverRepository'
import VehicleRepository from '@/repositories/VehicleRepository'
import { DriverConnectedInterface } from '@/types/DriverConnectedInterface'
import { PlaceInterface } from '@/types/PlaceInterface'
import CacheStore from '@/services/stores/CacheStore'

// Non-reactive, module-level presence queue: RTDB callbacks enqueue here instead of
// mutating `connectedDrivers` directly, so a burst of events is applied in one flush.
type PendingEntry = { type: 'upsert' | 'remove'; place?: PlaceInterface }
const pending = new Map<string, PendingEntry>()
let scheduledHandle: number | ReturnType<typeof setTimeout> | null = null
let scheduledIsRaf = false

function cancelScheduledFlush(): void {
  if (scheduledHandle === null) {
    return
  }
  if (scheduledIsRaf && typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
    window.cancelAnimationFrame(scheduledHandle as number)
  } else {
    clearTimeout(scheduledHandle as ReturnType<typeof setTimeout>)
  }
  scheduledHandle = null
}

export const useDriversStore = defineStore('driverStore', {
  state: () => {

    return {
      drivers: Array<Driver>(),
      connectedDrivers: Array<PlaceInterface>(),
      occupiedDrivers: Array<string>(),
      vehiclePlateCache: {} as Record<string, string>,
    }
  },
  actions: {
    async getDrivers() {
      await CacheStore.getDrivers(this.drivers)
      this._order()
    },
    findById(id: string): Driver | undefined {
      return this.drivers.find(el => el.id == id)
    },
    getOnlineDrivers(): void {
      const onDriverConnected = async (partialDriver: DriverConnectedInterface): Promise<void> => {
        await this.upsertConnectedDriver(partialDriver)
      }

      const onDriverChanged = async (partialDriver: DriverConnectedInterface): Promise<void> => {
        await this.upsertConnectedDriver(partialDriver)
      }

      const onDriverDisconnected = (driver: DriverConnectedInterface): void => {
        this.enqueueRemove(driver.id)
      }
      DriverRepository.onlineDriverListener(onDriverConnected, onDriverChanged, onDriverDisconnected)
    },
    offOnlineDrivers(): void {
      DriverRepository.removeOnlineDriverListener()
      cancelScheduledFlush()
      pending.clear()
      this.connectedDrivers = []
    },

    enqueueUpsert(key: string, place: PlaceInterface): void {
      pending.set(key, { type: 'upsert', place })
      this.scheduleFlush()
    },

    enqueueRemove(key: string): void {
      pending.set(key, { type: 'remove' })
      this.scheduleFlush()
    },

    peekConnectedDriver(key: string): PlaceInterface | undefined {
      const queued = pending.get(key)
      if (queued?.type === 'upsert' && queued.place) {
        return queued.place
      }
      return this.connectedDrivers.find(driver => driver.key === key)
    },

    scheduleFlush(): void {
      if (scheduledHandle !== null) {
        return
      }
      const run = (): void => {
        scheduledHandle = null
        this.flush()
      }
      if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        scheduledIsRaf = true
        scheduledHandle = window.requestAnimationFrame(run)
      } else {
        scheduledIsRaf = false
        scheduledHandle = setTimeout(run, 0)
      }
    },

    flush(): void {
      if (pending.size === 0) {
        return
      }
      const next = this.connectedDrivers.slice()
      pending.forEach((entry, key) => {
        const index = next.findIndex(driver => driver.key === key)
        if (entry.type === 'remove') {
          if (index >= 0) {
            next.splice(index, 1)
          }
          return
        }
        if (!entry.place) {
          return
        }
        if (index >= 0) {
          next[index] = entry.place
        } else {
          next.push(entry.place)
        }
      })
      pending.clear()
      this.connectedDrivers = next
    },

    addDriver(driver: Driver): void {
      const index = this.drivers.findIndex(d => d.id === driver.id)
      const driverTmp = new Driver()
      Object.assign(driverTmp, driver)
      driverTmp.selected_vehicle = driver.selected_vehicle ? { ...driver.selected_vehicle } : null
      if (index !== -1) {
        this.drivers.splice(index, 1, driverTmp)
      } else {
        this.drivers.push(driverTmp)
      }
    },

    setOccupiedDriver(driverId: string): void {
      if (this.occupiedDrivers.includes(driverId)) {
        return
      }
      this.occupiedDrivers.push(driverId)
      this.patchOccupiedColor(driverId, 'danger')
    },

    removeOccupiedDriver(driverId: string): void {
      const index = this.occupiedDrivers.indexOf(driverId)
      if (index === -1) {
        return
      }
      this.occupiedDrivers.splice(index, 1)
      this.patchOccupiedColor(driverId, undefined)
    },

    patchOccupiedColor(driverId: string, color: string | undefined): void {
      const latest = this.peekConnectedDriver(driverId)
      if (!latest) {
        return
      }
      this.enqueueUpsert(driverId, { ...latest, color })
    },

    _order(): void {
      this.drivers.sort((a, b) => {
        if (a.name < b.name) { return -1 }
        if (a.name > b.name) { return 1 }
        return 0
      })
    },

    async upsertConnectedDriver(partialDriver: DriverConnectedInterface): Promise<void> {
      const place = this.buildConnectedDriverPlace(partialDriver)
      this.enqueueUpsert(place.key, place)

      if (this.hasKnownPlate(partialDriver)) {
        return
      }

      const resolvedVehiclePlate = await this.resolveVehiclePlate(partialDriver)
      if (!resolvedVehiclePlate) {
        return
      }

      const latest = this.peekConnectedDriver(place.key)
      if (!latest) {
        return
      }

      this.enqueueUpsert(place.key, {
        ...latest,
        name: resolvedVehiclePlate,
      })
    },

    hasKnownPlate(partialDriver: DriverConnectedInterface): boolean {
      if (partialDriver.vehicle_plate) {
        return true
      }
      return Boolean(partialDriver.vehicle_id && this.vehiclePlateCache[partialDriver.vehicle_id])
    },

    buildConnectedDriverPlace(partialDriver: DriverConnectedInterface): PlaceInterface {
      const driver = this.findById(partialDriver.id ?? '') ?? new Driver()
      const driverId = partialDriver.id ?? driver.id

      if (partialDriver.vehicle_id && partialDriver.vehicle_plate) {
        this.vehiclePlateCache[partialDriver.vehicle_id] = partialDriver.vehicle_plate
      }

      const place: PlaceInterface = {
        id: driverId,
        key: driverId,
        name: this.getConnectedDriverName(partialDriver, driver),
        lat: partialDriver.location.lat,
        lng: partialDriver.location.lng,
        color: this.getConnectedDriverColor(driverId),
      }

      if (typeof partialDriver.last_seen_at === 'number' && Number.isFinite(partialDriver.last_seen_at)) {
        place.lastSeenAt = partialDriver.last_seen_at
      }

      return place
    },

    getConnectedDriverName(partialDriver: DriverConnectedInterface, driver: Driver): string {
      if (partialDriver.vehicle_plate) {
        return partialDriver.vehicle_plate
      }

      if (partialDriver.vehicle_id && this.vehiclePlateCache[partialDriver.vehicle_id]) {
        return this.vehiclePlateCache[partialDriver.vehicle_id]
      }

      if (
        partialDriver.vehicle_id &&
        driver.selected_vehicle_id === partialDriver.vehicle_id &&
        driver.selected_vehicle?.plate
      ) {
        return driver.selected_vehicle.plate
      }

      if (driver.vehicle?.plate) {
        return driver.vehicle.plate
      }

      return driver.name || partialDriver.id || driver.id
    },

    getConnectedDriverColor(driverId: string): string | undefined {
      return this.occupiedDrivers.includes(driverId) ? 'danger' : undefined
    },

    async resolveVehiclePlate(partialDriver: DriverConnectedInterface): Promise<string | null> {
      if (partialDriver.vehicle_plate) {
        return partialDriver.vehicle_plate
      }

      if (!partialDriver.vehicle_id) {
        return null
      }

      const cachedPlate = this.vehiclePlateCache[partialDriver.vehicle_id]
      if (cachedPlate) {
        return cachedPlate
      }

      try {
        const vehicle = await VehicleRepository.findById(partialDriver.vehicle_id)
        if (!vehicle?.plate) {
          return null
        }

        this.vehiclePlateCache[partialDriver.vehicle_id] = vehicle.plate
        return vehicle.plate
      } catch {
        return null
      }
    }
  }
})
