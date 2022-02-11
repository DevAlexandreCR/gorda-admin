import {get, child, DataSnapshot, set, ref} from 'firebase/database'
import DBService from '@/services/DBService'
import {UserInterface} from '@/entities/UserInterface'

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
}

export default new UserRepository()