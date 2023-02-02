import Driver from '@/models/Driver'
import DriverRepository from '@/repositories/DriverRepository'

class CacheStore {

  public ALL_DRIVERS = "all_drivers"
  private cachedDrivers: string|null = null
  getDrivers(): Array<Driver> {
    this.cachedDrivers = localStorage.getItem(this.ALL_DRIVERS)
    let drivers: Array<Driver> = []
    if (this.cachedDrivers == null) {
      DriverRepository.getAll().then(driversDB => {
        drivers = this.setDriverObject(driversDB)
        localStorage.setItem(this.ALL_DRIVERS, JSON.stringify(drivers))
        console.log('base datos')
      })
    } else {
      drivers = this.setDriverObject(JSON.parse(this.cachedDrivers))
    }

    return drivers
  }

  private setDriverObject(jsonDrivers: Array<any>): Array<Driver> {
    const drivers = Array<Driver>()
    jsonDrivers.forEach(driver => {
      const driverTmp = new Driver()
      Object.assign(driverTmp, driver)
      drivers.push(driverTmp)
    })

    return drivers
  }

  clear(key: string): void {
    localStorage.removeItem(key)
  }
}

export default new CacheStore()