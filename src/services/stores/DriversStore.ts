import {defineStore} from 'pinia'
import Driver from '@/models/Driver'
import DriverRepository from '@/repositories/DriverRepository'
import {DriverConnectedInterface} from '@/types/DriverConnectedInterface'
import {PlaceInterface} from '@/types/PlaceInterface'
import CacheStore from '@/services/stores/CacheStore'
import Vehicle from '@/models/Vehicle'

export const useDriversStore = defineStore('driverStore', {
  state: () => {

    return {
      drivers: Array<Driver>(),
      connectedDrivers: Array<PlaceInterface>()
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
    filter(search: string): Driver[] {
      return this.drivers.filter(driver => {
        return driver.vehicle.plate.toLowerCase().includes(search.toLowerCase()) ||
          driver.email.toLowerCase().includes(search.toLowerCase()) ||
          driver.phone.toLowerCase().includes(search.toLowerCase()) ||
					driver.document.toLowerCase().includes(search.toLowerCase())
      })
    },
    getOnlineDrivers(): void {
      const onDriverConnected = (partialDriver: DriverConnectedInterface): void => {
        const driver = this.findById(partialDriver.id ?? '') ?? new Driver()
        this.connectedDrivers.push({
          key: driver.id,
          name: driver.vehicle.plate,
          lat: partialDriver.location.lat,
          lng: partialDriver.location.lng
        })
      }

      const onDriverChanged = (partialDriver: DriverConnectedInterface): void => {
        const driver = this.findById(partialDriver.id ?? '') ?? new Driver()
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

    addDriver(driver: Driver): void {
      const driverTmp = new Driver()
      Object.assign(driverTmp, driver)
      const vehicleTmp = new Vehicle()
      Object.assign(vehicleTmp, driver.vehicle)
      driverTmp.vehicle = vehicleTmp
      this.drivers.push(driverTmp)
    },
		
		_order(): void {
			this.drivers.sort((a,b) => {
				if(a.name < b.name) { return -1; }
				if(a.name > b.name) { return 1; }
				return 0;
			})
		}
  }
})