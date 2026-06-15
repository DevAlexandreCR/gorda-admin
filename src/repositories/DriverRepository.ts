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
import { DriverListQuery } from '@/types/DriverListQuery'
import { RechargeInterface } from '@/types/RechargeInterface'
import AuthService from '@/services/AuthService'

class DriverRepository {
  async getDriver(id: string): Promise<DriverInterface> {
    const response = await serverApi.get<ApiResponse<{ driver: DriverInterface }>>(`/drivers/${id}`)
    return response.data.data.driver ?? new Driver()
  }

  async getAll(): Promise<Array<DriverInterface>> {
    const response = await serverApi.get<ApiResponse<{ drivers: DriverInterface[] }>>('/drivers')
    return response.data.data.drivers ?? []
  }

  async list(query: DriverListQuery): Promise<{ drivers: DriverInterface[]; total: number }> {
    const response = await serverApi.get<ApiResponse<{ drivers: DriverInterface[]; total: number }>>('/drivers', { params: query })
    return {
      drivers: response.data.data.drivers ?? [],
      total: response.data.data.total ?? 0,
    }
  }

  update(driver: DriverInterface): Promise<void> {
    CacheStore.clear(CacheStore.ALL_DRIVERS)
    const { vehicle: _vehicle, selected_vehicle: _sv, roster: _roster, ...driverPayload } = driver as DriverInterface & { vehicle?: unknown }
    return serverApi.put(`/drivers/${driver.id}`, driverPayload).then(() => undefined)
  }

  async createRecharge(driver: Driver, amount: number, note?: string | null): Promise<{ recharge: RechargeInterface; driver: any }> {
    const currentUser = AuthService.currentUser
    if (!currentUser?.id) {
      throw new Error('Cannot recharge: actor identity could not be resolved')
    }
    const response = await serverApi.post<ApiResponse<{ recharge: RechargeInterface; driver: any }>>(
      `/drivers/${driver.id}/recharges`,
      {
        amount,
        created_by: { uid: currentUser.id, name: currentUser.name },
        note: note ?? null,
      }
    )
    return response.data.data
  }

  async listRecharges(driverId: string, page = 1): Promise<{ recharges: RechargeInterface[]; total: number }> {
    const response = await serverApi.get<ApiResponse<{ recharges: RechargeInterface[]; total: number }>>(
      `/drivers/${driverId}/recharges`,
      { params: { page, perPage: 20 } }
    )
    return {
      recharges: response.data.data.recharges ?? [],
      total: response.data.data.total ?? 0,
    }
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

  async bulkEnable(driverIds: string[]): Promise<{ processed: number; failed: Array<{ id: string; reason: string }> }> {
    const response = await serverApi.post<ApiResponse<{ processed: number; failed: Array<{ id: string; reason: string }> }>>('/drivers/bulk/enable', { driverIds })
    return response.data.data
  }

  async bulkDisable(driverIds: string[]): Promise<{ processed: number; failed: Array<{ id: string; reason: string }> }> {
    const response = await serverApi.post<ApiResponse<{ processed: number; failed: Array<{ id: string; reason: string }> }>>('/drivers/bulk/disable', { driverIds })
    return response.data.data
  }

  async bulkSendMessage(payload: { driverIds: string[]; title: string; body: string; data?: Record<string, string> }): Promise<{ processed: number; failed: Array<{ id: string; reason: string }> }> {
    const response = await serverApi.post<ApiResponse<{ processed: number; failed: Array<{ id: string; reason: string }> }>>('/drivers/bulk/send-message', payload)
    return response.data.data
  }

  async create(driver: DriverInterface, password: string, vehiclePayload?: Record<string, unknown>): Promise<string> {
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
          const { vehicle: _vehicle, selected_vehicle: _sv, roster: _roster, ...driverPayload } = driver as DriverInterface & { vehicle?: Record<string, unknown> }
          const body: Record<string, unknown> = { driver: driverPayload }
          if (vehiclePayload) {
            body.vehicle = vehiclePayload
          }
          await serverApi.post('/drivers', body)
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
