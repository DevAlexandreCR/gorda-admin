import {get, child, DataSnapshot, set, ref, push} from 'firebase/database'
import DBService from '@/services/DBService'
import {DriverInterface} from "@/types/DriverInterface";

class DriverRepository {
  
  /* istanbul ignore next */
  async getDriver(id: string): Promise<DriverInterface> {
    const snapshot: DataSnapshot = await get(child(DBService.dbDrivers(), id))
    return <DriverInterface>snapshot.val()
  }
  
  /* istanbul ignore next */
  async getAll(): Promise<Array<DriverInterface>> {
    const snapshot: DataSnapshot = await get(DBService.dbDrivers())
    return <Array<DriverInterface>>snapshot.val()
  }
  
  /* istanbul ignore next */
  update(driver: DriverInterface): Promise<void> {
    return set(ref(DBService.db, 'drivers/' + driver.id), driver)
  }
  
  /* istanbul ignore next */
  async create(driver: DriverInterface): Promise<string> {
    const res = await push(DBService.dbDrivers(), driver)
    return res.key as string
  }
}

export default new DriverRepository()