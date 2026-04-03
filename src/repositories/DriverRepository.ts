import {
  child,
  onChildChanged,
  onChildAdded,
  onChildRemoved,
  orderByKey,
  query,
  off,
  remove,
} from 'firebase/database'
import DBService from '@/services/DBService'
import { DriverInterface } from '@/types/DriverInterface'
import Driver from '@/models/Driver'
import { UserRequestType } from '@/types/UserRequestType'
import { UserResponse } from '@/types/UserResponse'
import UserRepository from '@/repositories/UserRepository'
import { AxiosError } from 'axios'
import { DriverConnectedInterface } from '@/types/DriverConnectedInterface'
import CacheStore from '@/services/stores/CacheStore'
import serverApi, { ApiResponse } from '@/services/gordaApi/server/ServerApi'

class DriverRepository {
  async getDriver(id: string): Promise<DriverInterface> {
    const response = await serverApi.get<ApiResponse<{ driver: DriverInterface }>>(`/drivers/${id}`)
    return response.data.data.driver ?? new Driver()
  }

  async getAll(): Promise<Array<DriverInterface>> {
    const response = await serverApi.get<ApiResponse<{ drivers: DriverInterface[] }>>('/drivers')
    return response.data.data.drivers ?? []
  }

  update(driver: DriverInterface): Promise<void> {
    CacheStore.clear(CacheStore.ALL_DRIVERS)
    return serverApi.put(`/drivers/${driver.id}`, driver).then(() => undefined)
  }

  async addBalance(driver: Driver, amount: number): Promise<void> {
    driver.balance += amount
    await serverApi.patch(`/drivers/${driver.id}/balance`, { balance: driver.balance })
  }

  enable(driverId: string, enabledAt: number): Promise<void> {
    return new Promise((resolve, reject) => {
      UserRepository.enableAuth(driverId, enabledAt == 0)
        .then(() => {
          serverApi.patch(`/drivers/${driverId}/enabled`, { enabled_at: enabledAt }).then(async () => {
            if (enabledAt == 0) {
              await remove(child(DBService.dbOnlineDrivers(), driverId)).catch((e) => {
                reject(new Error(e.message))
              })
            }
            resolve()
            CacheStore.clear(CacheStore.ALL_DRIVERS)
          })
        })
        .catch((e) => {
          reject(new Error(e.message))
        })
    })
  }

  async removeIndex(driverId: string): Promise<void> {
    return await remove(child(DBService.dbDriversAssigned(), driverId))
  }

  updateEmail(driverId: string, email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      UserRepository.emailAuth(driverId, email)
        .then(() => {
          serverApi.patch(`/drivers/${driverId}/email`, { email }).then(() => {
            resolve()
            CacheStore.clear(CacheStore.ALL_DRIVERS)
          })
        })
        .catch((e) => {
          reject(new Error(e.message))
        })
    })
  }

  updatePassword(driverId: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      UserRepository.passwordAuth(driverId, password)
        .then(() => {
          serverApi.patch(`/drivers/${driverId}/password`, { password }).then(() => {
            resolve()
            CacheStore.clear(CacheStore.ALL_DRIVERS)
          })
        })
        .catch((e) => {
          reject(new Error(e.message))
        })
    })
  }

  onlineDriverListener(
    onAdded: (driver: DriverConnectedInterface) => void,
    onChanged: (driver: DriverConnectedInterface) => void,
    onRemoved: (driver: DriverConnectedInterface) => void
  ): void {
    onChildAdded(query(DBService.dbOnlineDrivers(), orderByKey()), (data) => {
      onAdded(data.val() as DriverConnectedInterface)
    })
    onChildChanged(query(DBService.dbOnlineDrivers(), orderByKey()), (data) => {
      onChanged(data.val() as DriverConnectedInterface)
    })
    onChildRemoved(query(DBService.dbOnlineDrivers(), orderByKey()), (data) => {
      onRemoved(data.val() as DriverConnectedInterface)
    })
  }

  removeOnlineDriverListener(): void {
    off(query(DBService.dbOnlineDrivers(), orderByKey()))
  }

  async create(driver: DriverInterface, password: string): Promise<string> {
    const userData: UserRequestType = {
      email: driver.email,
      emailVerified: true,
      displayName: driver.name,
      phoneNumber: driver.phone,
      password: password,
      disabled: driver.enabled_at == 0,
    }

    return new Promise((resolve, reject) => {
      UserRepository.createAuth(userData)
        .then(async (res) => {
          const id = res.data.data.uid
          driver.id = id
          await serverApi.post('/drivers', driver)
          CacheStore.clear(CacheStore.ALL_DRIVERS)
          return resolve(id)
        })
        .catch((e: AxiosError<UserResponse>) => {
          reject(new Error((e.response?.data.data as string) ?? e.message))
        })
    })
  }
}

export default new DriverRepository()
