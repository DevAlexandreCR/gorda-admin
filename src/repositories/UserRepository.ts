import {get, child, DataSnapshot, set, ref} from 'firebase/database'
import DBService from '@/services/DBService'
import {UserInterface} from '@/entities/UserInterface'

class UserRepository{

  async getUser(id: string): Promise<UserInterface> {
    const snapshot: DataSnapshot = await get(child(DBService.dbUsers(), id))
    return <UserInterface>snapshot.val()
  }

  async getAll(): Promise<Array<UserInterface>> {
    const snapshot: DataSnapshot = await get(DBService.dbUsers())
    return <Array<UserInterface>>snapshot.val()
  }

  update(user: UserInterface): Promise<void> {
    return set(ref(DBService.db, 'users/' + user.id), user);
  }
}

export default new UserRepository()