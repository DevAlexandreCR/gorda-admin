import {get, child, DataSnapshot} from 'firebase/database'
import DBService from '@/services/DBService'
import {User} from '@/entities/User'

class UserRepository{

  async getUser(id: string): Promise<User> {
    const snapshot: DataSnapshot = await get(child(DBService.dbUsers(), id))
    return <User>snapshot.val()
  }

  async getAll(): Promise<Array<User>> {
    const snapshot: DataSnapshot = await get(DBService.dbUsers())
    return <Array<User>>snapshot.val()
  }
}

export default new UserRepository()