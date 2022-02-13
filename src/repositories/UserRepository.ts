import {get, child, DataSnapshot, set, ref} from 'firebase/database'
import DBService from '@/services/DBService'
import {UserInterface} from '@/entities/UserInterface'
import AuthService from '@/services/AuthService'
import dayjs from 'dayjs'
import StorageService from '@/services/StorageService'

class UserRepository{

  /* istanbul ignore next */
  async getUser(id: string): Promise<UserInterface> {
    const snapshot: DataSnapshot = await get(child(DBService.dbUsers(), id))
    return <UserInterface>snapshot.val()
  }

  /* istanbul ignore next */
  async getAll(): Promise<Array<UserInterface>> {
    const snapshot: DataSnapshot = await get(DBService.dbUsers())
    return <Array<UserInterface>>snapshot.val()
  }

  /* istanbul ignore next */
  update(user: UserInterface): Promise<void> {
    return set(ref(DBService.db, 'users/' + user.id), user);
  }

  async create(user: UserInterface, password: string): Promise<void> {
    await AuthService.createUser(user.email as string, password).then(async userCredential => {
      user.id = userCredential.user.uid
      const now = new Date()
      user.created_at = dayjs(now).format('YYYY-MM-DD HH:mm:ss')
      user.photoUrl = await StorageService.getDownloadUrl('images/app/default_user.png')
      user.enabled_at = ''
      user.roles = {
        admin: false,
        operator: false
      }
      return this.update(user)
    })
  }
}

export default new UserRepository()