import {defineStore} from 'pinia'
import Driver from '@/models/Driver'
import DriverRepository from '@/repositories/DriverRepository'
import {DriverConnectedInterface} from '@/types/DriverConnectedInterface'
import {PlaceInterface} from '@/types/PlaceInterface'
import CacheStore from '@/services/stores/CacheStore'

export const useDriversStore = defineStore('driverStore', {
  state: () => {

    return {
      drivers: Array<Driver>(),
      connectedDrivers: Array<PlaceInterface>()
    }
  },
  actions: {
    async getDrivers() {
      this.drivers = CacheStore.getDrivers()
    },
    findById(id: string): Driver | undefined {
      return this.drivers.find(el => el.id == id)
    },
    filterByPlate(plate: string): Driver[] {
      return this.drivers.filter(el => el.vehicle.plate.toLowerCase().includes(plate.toLowerCase()))
    },
    getOnlineDrivers(): void {
      const onDriverConnected = (partialDriver: DriverConnectedInterface): void =>  {
        const driver = this.findById(partialDriver.id??'') ?? new Driver()
        this.connectedDrivers.push({
          key: driver.id,
          name: driver.vehicle.plate,
          lat: partialDriver.location.lat,
          lng: partialDriver.location.lng
        })
      }

      const onDriverChanged = (partialDriver: DriverConnectedInterface): void =>  {
        const driver = this.findById(partialDriver.id??'') ?? new Driver()
        const index = this.connectedDrivers.findIndex(dri => dri.key === partialDriver.id)
        this.connectedDrivers[index] = {
          key: driver.id,
          name: driver.vehicle.plate,
          lat: partialDriver.location.lat,
          lng: partialDriver.location.lng
        }
      }

      const onDriverDisconnected = (driver: DriverConnectedInterface): void => {
        const index = this.connectedDrivers.findIndex(dri => dri.key === driver.id)
        this.connectedDrivers.splice(index, 1)
      }
      DriverRepository.onlineDriverListener(onDriverConnected, onDriverChanged, onDriverDisconnected)
    },
    offOnlineDrivers(): void {
      DriverRepository.removeOnlineDriverListener()
      this.connectedDrivers = []
    },

    setDriverObject(drivers: Array<any>): void {
      drivers.forEach(driver => {
        const driverTmp = new Driver()
        Object.assign(driverTmp, driver)
        this.drivers.push(driverTmp)
      })
    },

    addDriver(driver: Driver): void {
      this.drivers.push(driver)
    },

    updateDriver(driver: Driver): void {
      const index = this.drivers.findIndex(dri => dri.id === driver.id)
      this.drivers[index] = driver
    }
  }
})