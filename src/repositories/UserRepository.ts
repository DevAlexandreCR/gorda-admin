import {get, child, DataSnapshot, set, ref} from 'firebase/database'
import DBService from '@/services/DBService'
import {UserInterface} from '@/types/UserInterface'
import AuthService from '@/services/AuthService'
import dayjs from 'dayjs'
import StorageService from '@/services/StorageService'
import User from '@/models/User'
import {UserRequestType} from '@/types/UserRequestType'
import axios, {AxiosResponse} from 'axios'

class UserRepository{
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

  async create(user: UserInterface, password: string): Promise<void> {
    await AuthService.createUser(user.email as string, password).then(async userCredential => {
      user.id = userCredential.user.uid
      user.created_at = dayjs().unix()
      user.photoUrl = await StorageService.getDownloadUrl('images/app/default_user.png')
      user.enabled_at = null
      user.roles = {
        admin: false,
        operator: false
      }
      return this.update(user)
    })
  }
  
  async createAuth(userData: UserRequestType): Promise<AxiosResponse> {
    return axios.post(this.base_url + 'create-user/', userData)
  }
}

export default new UserRepository()