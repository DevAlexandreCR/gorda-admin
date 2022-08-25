import {defineStore} from 'pinia'
import Driver from '@/models/Driver'
import DriverRepository from '@/repositories/DriverRepository'
import {DriverConnectedInterface} from '@/types/DriverConnectedInterface'

export const useDriversStore = defineStore('driverStore', {
  state: () => {

    return {
      drivers: Array<Driver>(),
      connectedDrivers: Array<Driver>()
    }
  },
  actions: {
    async getDrivers() {
      DriverRepository.getAll().then(driversDB => {
        driversDB.forEach(driver => {
          const driverTmp = new Driver()
          Object.assign(driverTmp, driver)
          this.drivers.push(driverTmp)
        })
      })
    },
    findById(id: string): Driver | undefined {
      return this.drivers.find(el => el.id == id)
    },
    filterByPlate(plate: string): Driver[] {
      return this.drivers.filter(el => el.vehicle.plate.toLowerCase().includes(plate.toLowerCase()))
    },
    getOnlineDrivers(onAdded: (driver: DriverConnectedInterface) => void,
                     onChanged: (driver: DriverConnectedInterface) => void,
                     onRemoved: (driver: DriverConnectedInterface) => void): void {
      DriverRepository.onlineDriverListener(onAdded, onChanged, onRemoved)
    }
  }
})