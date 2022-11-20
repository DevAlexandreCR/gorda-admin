import {
  child,
  DataSnapshot,
  get,
  onChildChanged,
  onChildAdded,
  onChildRemoved,
  orderByKey,
  query,
  ref,
  set,
  off
} from 'firebase/database'
import DBService from '@/services/DBService'
import {DriverInterface} from '@/types/DriverInterface'
import Driver from '@/models/Driver'
import {UserRequestType} from '@/types/UserRequestType'
import {UserResponse} from '@/types/UserResponse'
import UserRepository from '@/repositories/UserRepository'
import {AxiosError} from 'axios'
import {DriverConnectedInterface} from '@/types/DriverConnectedInterface'

class DriverRepository {

  /* istanbul ignore next */
  async getDriver(id: string): Promise<DriverInterface> {
    const snapshot: DataSnapshot = await get(child(DBService.dbDrivers(), id))
    return <DriverInterface>snapshot.val() ?? new Driver
  }

  /* istanbul ignore next */
  async getAll(): Promise<Array<DriverInterface>> {
    const snapshot: DataSnapshot = await get(DBService.dbDrivers())
    return Object.values(snapshot.val() ?? [])
  }

  /* istanbul ignore next */
  update(driver: DriverInterface): Promise<void> {
    return set(ref(DBService.db, 'drivers/' + driver.id), driver)
  }

  /* istanbul ignore next */
  enable(driverId: string, enabledAt: number): Promise<void> {
    return new Promise((resolve, reject) => {
      UserRepository.enableAuth(driverId, enabledAt == 0).then(() => {
        set(ref(DBService.db, 'drivers/' + driverId + '/enabled_at'), enabledAt).then(() => {
          resolve()
        })
      }).catch((e) => {
        reject(new Error(e.message))
      })
    })
  }

  /* istanbul ignore next */
  updateEmail(driverId: string, email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      UserRepository.emailAuth(driverId, email).then(() => {
        set(ref(DBService.db, 'drivers/' + driverId + '/email/'), email).then(() => {
          resolve()
        })
      }).catch((e) => {
        reject(new Error(e.message))
      })
    })
  }

  /* istanbul ignore next */
  onlineDriverListener(onAdded: (driver: DriverConnectedInterface) => void,
                       onChanged: (driver: DriverConnectedInterface) => void,
                       onRemoved: (driver: DriverConnectedInterface) => void): void {
    onChildAdded(query(DBService.dbOnlineDrivers(), orderByKey()), (data) => {
      const driver = data.val() as DriverConnectedInterface
      onAdded(driver)
    })
    onChildChanged(query(DBService.dbOnlineDrivers(), orderByKey()), (data) => {
      const driver = data.val() as DriverConnectedInterface
      onChanged(driver)
    })
    onChildRemoved(query(DBService.dbOnlineDrivers(), orderByKey()), (data) => {
      const driver = data.val() as DriverConnectedInterface
      onRemoved(driver)
    })
  }

  removeOnlineDriverListener(): void {
    off(query(DBService.dbOnlineDrivers(), orderByKey()))
  }

  /* istanbul ignore next */
  async create(driver: DriverInterface, password: string): Promise<string> {
    const userData: UserRequestType = {
      email: driver.email,
      emailVerified: true,
      displayName: driver.name,
      phoneNumber: '+57' + driver.phone,
      password: password,
      disabled: driver.enabled_at == 0,
    }
    return new Promise((resolve, reject) => {
      UserRepository.createAuth(userData).then(async (res) => {
        const id = res.data.data.uid
        driver.id = id
        await set(ref(DBService.db, 'drivers/' + id), driver)
        return resolve(id)
      }).catch((e: AxiosError<UserResponse>) => {
        reject(new Error(e.message))
      })
    })
  }
}

export default new DriverRepository()