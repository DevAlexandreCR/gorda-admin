import { defineStore } from 'pinia'
import Driver from '@/models/Driver'
import DriverRepository from '@/repositories/DriverRepository'
import VehicleRepository from '@/repositories/VehicleRepository'
import { DriverConnectedInterface } from '@/types/DriverConnectedInterface'
import { PlaceInterface } from '@/types/PlaceInterface'
import CacheStore from '@/services/stores/CacheStore'

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
        const index = this.connectedDrivers.findIndex(dri => dri.key === driver.id)
        if (index >= 0) {
          this.connectedDrivers.splice(index, 1)
        }
      }
      DriverRepository.onlineDriverListener(onDriverConnected, onDriverChanged, onDriverDisconnected)
    },
    offOnlineDrivers(): void {
      DriverRepository.removeOnlineDriverListener()
      this.connectedDrivers = []
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
      this.occupiedDrivers.push(driverId)
    },

    removeOccupiedDriver(driverId: string): void {
      const index = this.occupiedDrivers.findIndex(id => id === driverId)
      delete this.occupiedDrivers[index]
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
      this.setConnectedDriver(place)

      const resolvedVehiclePlate = await this.resolveVehiclePlate(partialDriver)
      if (!resolvedVehiclePlate || resolvedVehiclePlate === place.name) {
        return
      }

      const currentIndex = this.connectedDrivers.findIndex(driver => driver.key === place.key)
      if (currentIndex < 0 || this.connectedDrivers[currentIndex].name !== place.name) {
        return
      }

      this.connectedDrivers[currentIndex] = {
        ...this.connectedDrivers[currentIndex],
        name: resolvedVehiclePlate,
      }
    },

    buildConnectedDriverPlace(partialDriver: DriverConnectedInterface): PlaceInterface {
      const driver = this.findById(partialDriver.id ?? '') ?? new Driver()
      const driverId = partialDriver.id ?? driver.id

      if (partialDriver.vehicle_id && partialDriver.vehicle_plate) {
        this.vehiclePlateCache[partialDriver.vehicle_id] = partialDriver.vehicle_plate
      }

      return {
        id: driverId,
        key: driverId,
        name: this.getConnectedDriverName(partialDriver, driver),
        lat: partialDriver.location.lat,
        lng: partialDriver.location.lng,
        color: this.getConnectedDriverColor(driverId),
      }
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

    setConnectedDriver(place: PlaceInterface): void {
      const index = this.connectedDrivers.findIndex(driver => driver.key === place.key)

      if (index >= 0) {
        this.connectedDrivers[index] = place
        return
      }

      this.connectedDrivers.push(place)
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
