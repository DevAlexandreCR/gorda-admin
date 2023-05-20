import { getFirestore, Firestore, collection, doc, CollectionReference, DocumentReference } from 'firebase/firestore';
import Firebase from '@/services/Firebase';

class FirestoreService {
  public fs: Firestore = getFirestore(Firebase.getInstance());

    /* istanbul ignore next */
  public usersCollection(): CollectionReference {
    return collection(this.fs, 'users');
  }

    /* istanbul ignore next */
  public servicesCollection(): CollectionReference {
    return collection(this.fs, 'services');
  }

    /* istanbul ignore next */
  public driversCollection(): CollectionReference {
    return collection(this.fs, 'drivers');
  }

    /* istanbul ignore next */
  public onlineDriversCollection(): CollectionReference {
    return collection(this.fs, 'online_drivers');
  }

    /* istanbul ignore next */
  public clientsCollection(): CollectionReference {
    return collection(this.fs, 'clients');
  }

    /* istanbul ignore next */
  public placesCollection(): CollectionReference {
    return collection(this.fs, 'places');
  }

    /* istanbul ignore next */
  public settingsDocument(): DocumentReference {
    return doc(this.fs, 'settings', 'settings');
  }
}

export default new FirestoreService();