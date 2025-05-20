import {defineStore} from 'pinia'
import Driver from '@/models/Driver'
import DriverRepository from '@/repositories/DriverRepository'
import {DriverConnectedInterface} from '@/types/DriverConnectedInterface'
import {PlaceInterface} from '@/types/PlaceInterface'
import CacheStore from '@/services/stores/CacheStore'
import Vehicle from '@/models/Vehicle'
import { DriverPaymentMode } from '@/constants/DriverPaymentMode'

export const useDriversStore = defineStore('driverStore', {
  state: () => {

    return {
      drivers: Array<Driver>(),
      connectedDrivers: Array<PlaceInterface>(),
			occupiedDrivers: Array<string>(),
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
    filter(search: string, enabled = -1, paymentMode: DriverPaymentMode | false = false): Driver[] {
			let drivers = this.drivers.filter(driver => {
				switch (enabled) {
					case 1:
						return driver.enabled_at > 0
					case 0:
						return driver.enabled_at == 0
					default:
						return driver
				}
			})
      drivers = drivers.filter(driver => {
				switch (paymentMode) {
					case DriverPaymentMode.MONTHLY:
						return driver.paymentMode == DriverPaymentMode.MONTHLY
					case DriverPaymentMode.PERCENTAGE:
						return driver.paymentMode == DriverPaymentMode.PERCENTAGE
					default:
						return driver
				}
			})
      return drivers.filter(driver => {
        return driver.vehicle.plate.toLowerCase().includes(search.toLowerCase()) ||
          driver.email.toLowerCase().includes(search.toLowerCase()) ||
          driver.phone.toLowerCase().includes(search.toLowerCase()) ||
					driver.document.toLowerCase().includes(search.toLowerCase())
      })
    },
    getOnlineDrivers(): void {
      const onDriverConnected = (partialDriver: DriverConnectedInterface): void => {
        const driver = this.findById(partialDriver.id ?? '') ?? new Driver()
				const index = this.occupiedDrivers.findIndex(driverId => driverId === partialDriver.id)
				const color = index >= 0 ? 'danger' : undefined
        this.connectedDrivers.push({
          key: driver.id,
          name: driver.vehicle.plate,
          lat: partialDriver.location.lat,
          lng: partialDriver.location.lng,
					color: color
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
      const index = this.drivers.findIndex(d => d.id === driver.id)
      const driverTmp = new Driver()
      Object.assign(driverTmp, driver)
      const vehicleTmp = new Vehicle()
      Object.assign(vehicleTmp, driver.vehicle)
      driverTmp.vehicle = vehicleTmp
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
			this.drivers.sort((a,b) => {
				if(a.name < b.name) { return -1; }
				if(a.name > b.name) { return 1; }
				return 0;
			})
		}
  }
})