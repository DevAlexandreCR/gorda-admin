import {getDatabase, Database, ref, DatabaseReference} from 'firebase/database'
import Firebase from '@/services/Firebase'

class DBService {
  public db: Database = getDatabase(Firebase.getInstance())

  /* istanbul ignore next */
  public dbUsers(): DatabaseReference {
    return ref(this.db, 'users/')
  }

  /* istanbul ignore next */
  public dbServices(): DatabaseReference {
    return ref(this.db, 'services/')
  }
  
  /* istanbul ignore next */
  public dbDrivers(): DatabaseReference {
    return ref(this.db, 'drivers/')
  }

  /* istanbul ignore next */
  public dbDriversAssigned(): DatabaseReference {
    return ref(this.db, 'drivers_assigned/')
  }

  /* istanbul ignore next */
  public dbOnlineDrivers(): DatabaseReference {
    return ref(this.db, 'online_drivers/')
  }

  /* istanbul ignore next */
  public dbClients(): DatabaseReference {
    return ref(this.db, 'clients/')
  }

  /* istanbul ignore next */
  public dbPlaces(): DatabaseReference {
    return ref(this.db, 'places/')
  }
	
	/* istanbul ignore next */
	public dbWpClients(): DatabaseReference {
		return ref(this.db, 'settings/wp_clients')
	}
}

export default new DBService()