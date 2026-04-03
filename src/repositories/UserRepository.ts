import { UserInterface } from '@/types/UserInterface'
import User from '@/models/User'
import { UserRequestType } from '@/types/UserRequestType'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { UserResponse } from '@/types/UserResponse'
import serverApi, { ApiResponse } from '@/services/gordaApi/server/ServerApi'

class UserRepository {
  private readonly base_url = process.env.VUE_APP_GORDA_API_URL

  async getUser(id: string): Promise<User> {
    const response = await serverApi.get<ApiResponse<{ user: UserInterface }>>(`/users/${id}`)
    const user = new User()
    Object.assign(user, response.data.data.user)
    return user
  }

  async getAll(): Promise<Array<User>> {
    const response = await serverApi.get<ApiResponse<{ users: UserInterface[] }>>('/users')
    return response.data.data.users.map((userData) => {
      const user = new User()
      Object.assign(user, userData)
      return user
    })
  }

  update(user: UserInterface): Promise<void> {
    return serverApi.put(`/users/${user.id}`, user).then(() => undefined)
  }

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
      this.createAuth(userData)
        .then(async (res) => {
          const id = res.data.data.uid
          user.id = id
          await serverApi.post('/users', user)
          return resolve(id)
        })
        .catch((e: AxiosError<UserResponse>) => {
          reject(new Error((e.response?.data.data as string) ?? e.message))
        })
    })
  }

  enable(userId: string, enabledAt: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.enableAuth(userId, enabledAt == 0)
        .then(() => {
          serverApi.patch(`/users/${userId}/enabled`, { enabled_at: enabledAt }).then(() => resolve())
        })
        .catch((e) => {
          reject(new Error(e.message))
        })
    })
  }

  updatePassword(userId: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.passwordAuth(userId, password)
        .then(() => {
          serverApi.patch(`/users/${userId}/password`, { password }).then(() => resolve())
        })
        .catch((e) => {
          reject(new Error(e.message))
        })
    })
  }

  async createAuth(userData: UserRequestType): Promise<AxiosResponse> {
    return axios.post(this.base_url + '/auth/create-user/', userData)
  }

  async enableAuth(uid: string, enabled: boolean): Promise<AxiosResponse> {
    return axios.post(this.base_url + '/auth/enable-user/', { uid: uid, disabled: enabled })
  }

  async emailAuth(uid: string, email: string): Promise<AxiosResponse> {
    return axios.post(this.base_url + '/auth/update-email/', { uid: uid, email: email })
  }

  async passwordAuth(uid: string, password: string): Promise<AxiosResponse> {
    return axios.post(this.base_url + '/auth/update-password/', { uid: uid, password: password })
  }

  async getUserById(id: string): Promise<User> {
    return this.getUser(id)
  }
}

export default new UserRepository()
