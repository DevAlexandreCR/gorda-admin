import { get, child, DataSnapshot, set, ref } from 'firebase/database'
import DBService from '@/services/DBService'
import { UserInterface } from '@/types/UserInterface'
import User from '@/models/User'
import { UserRequestType } from '@/types/UserRequestType'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { UserResponse } from '@/types/UserResponse'

class UserRepository {
  private readonly base_url = process.env.VUE_APP_GORDA_API_URL

  /* istanbul ignore next */
  async getUser(id: string): Promise<User> {
    const snapshot: DataSnapshot = await get(child(DBService.dbUsers(), id))
    return <User>snapshot.val()
  }

  /* istanbul ignore next */
  async getAll(): Promise<Array<User>> {
    const snapshot: DataSnapshot = await get(DBService.dbUsers())
    return <Array<User>>snapshot.val()
  }

  /* istanbul ignore next */
  update(user: UserInterface): Promise<void> {
    return set(ref(DBService.db, 'users/' + user.id), user);
  }

  /* istanbul ignore next */
  async create(user: UserInterface, password: string): Promise<string> {
    const userData: UserRequestType = {
      email: user.email,
      emailVerified: true,
      displayName: user.name,
      phoneNumber: user.phone,
      password: password,
      disabled: user.enabled_at == 0,
    }
    user.password = password
    return new Promise((resolve, reject) => {      
      this.createAuth(userData).then(async (res) => {
        const id = res.data.data.uid
        user.id = id
        await set(ref(DBService.db, 'users/' + id), user)
        return resolve(id)
      }).catch((e: AxiosError<UserResponse>) => {
        reject(new Error(e.response?.data.data as string ?? e.message))
      })
    })
  }

  /* istanbul ignore next */
  enable(userId: string, enabledAt: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.enableAuth(userId, enabledAt == 0).then(() => {
        set(ref(DBService.db, 'users/' + userId + '/enabled_at'), enabledAt).then(() => {
          resolve()
        })
      }).catch((e) => {
        reject(new Error(e.message))
      })
    })
  }

  /* istanbul ignore next */
  updatePassword(userId: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.passwordAuth(userId, password).then(() => {
        set(ref(DBService.db, 'users/' + userId + '/password/'), password).then(() => {
          resolve()
        })
      }).catch((e) => {
        reject(new Error(e.message));
      })
    })
  }

  /* istanbul ignore next */
  async createAuth(userData: UserRequestType): Promise<AxiosResponse> {
    return axios.post(this.base_url + '/auth/create-user/', userData)
  }

  /* istanbul ignore next */
  async enableAuth(uid: string, enabled: boolean): Promise<AxiosResponse> {
    return axios.post(this.base_url + '/auth/enable-user/', { uid: uid, disabled: enabled })
  }

  /* istanbul ignore next */
  async emailAuth(uid: string, email: string): Promise<AxiosResponse> {
    return axios.post(this.base_url + '/auth/update-email/', { uid: uid, email: email })
  }

  /* istanbul ignore next */
  async passwordAuth(uid: string, password: string): Promise<AxiosResponse> {
    return axios.post(this.base_url + '/auth/update-password/', { uid: uid, password: password })
  }

  /* istanbul ignore next */
  async getUserById(id: string): Promise<User> {
    const snapshot: DataSnapshot = await get(child(DBService.dbUsers(), id))
    return <User>snapshot.val()
  } 
}

export default new UserRepository()