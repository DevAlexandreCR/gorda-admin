import {defineStore} from 'pinia'
import Driver from '@/models/Driver'
import DriverRepository from '@/repositories/DriverRepository'

export const useDriversStore = defineStore('driverStore', {
  state: () => {

    return {
      drivers: Array<Driver>()
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
    findById(id: string): Driver {
      const driver = this.drivers.find(el => el.id == id)
      return driver ?? new Driver()
    }
  }
})