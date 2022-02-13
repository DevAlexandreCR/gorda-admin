import {getDatabase, Database, ref, DatabaseReference} from 'firebase/database'
import Firebase from '@/services/Firebase'

class DBService {
  public db: Database = getDatabase(Firebase.getInstance())

  /* istanbul ignore next */
  public dbUsers(): DatabaseReference {
    return ref(this.db, 'users/')
  }
}

export default new DBService()