import Driver from '@/models/Driver'
import DriverRepository from '@/repositories/DriverRepository'

class CacheStore {

  public ALL_DRIVERS = "all_drivers"
  private cachedDrivers: string|null = null
  getDrivers(drivers: Driver[]): Promise<void> {
    this.cachedDrivers = localStorage.getItem(this.ALL_DRIVERS)
    return new Promise((resolve, reject) => {
			DriverRepository.getAll().then(driversDB => {
				this.setDriverObject(driversDB, drivers)
				localStorage.setItem(this.ALL_DRIVERS, JSON.stringify(drivers))
				resolve()
			}).catch((reason) => {
				reject(reason)
			})
    })
  }

  private setDriverObject(jsonDrivers: Array<any>, drivers: Driver[]): void {
    jsonDrivers.forEach(driver => {
      const driverTmp = new Driver()
      Object.assign(driverTmp, driver)
      drivers.push(driverTmp)
    })
  }

  clear(key: string): void {
    localStorage.removeItem(key)
  }
}

export default new CacheStore()