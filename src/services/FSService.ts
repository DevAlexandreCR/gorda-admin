import { getFirestore, Firestore, collection, doc, CollectionReference, DocumentReference, DocumentData } from 'firebase/firestore';
import Firebase from '@/services/Firebase';

class FirestoreService {
  public fs: Firestore = getFirestore(Firebase.getInstance());

    /* istanbul ignore next */
  public usersCollection(): CollectionReference<DocumentData> {
    return collection(this.fs, 'users');
  }

    /* istanbul ignore next */
  public servicesCollection(): CollectionReference<DocumentData> {
    return collection(this.fs, 'services');
  }

    /* istanbul ignore next */
  public driversCollection(): CollectionReference<DocumentData> {
    return collection(this.fs, 'drivers');
  }

    /* istanbul ignore next */
  public onlineDriversCollection(): CollectionReference<DocumentData> {
    return collection(this.fs, 'online_drivers');
  }

    /* istanbul ignore next */
  public clientsCollection(): CollectionReference<DocumentData> {
    return collection(this.fs, 'clients');
  }

    /* istanbul ignore next */
  public placesCollection(): CollectionReference<DocumentData> {
    return collection(this.fs, 'places');
  }

    /* istanbul ignore next */
  public settingsDocument(): DocumentReference<DocumentData> {
    return doc(this.fs, 'clients', 'clients');
  }

  /* istanbul ignore next */
  public mensajesCollection(): CollectionReference<DocumentData> {
    return collection(this.fs, 'mensajes');
  }
}

export default new FirestoreService();