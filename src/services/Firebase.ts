import {FirebaseApp, initializeApp} from 'firebase/app'
import firebaseConfig from '../../firebase.config'
import {connectAuthEmulator, getAuth} from 'firebase/auth'
import {connectDatabaseEmulator, getDatabase} from 'firebase/database'
import {connectStorageEmulator, getStorage} from 'firebase/storage'

export default class Firebase {

  private static app: FirebaseApp

  public static getInstance(): FirebaseApp {
    if (!Firebase.app) {
      Firebase.app = initializeApp(firebaseConfig)
      const auth = getAuth(Firebase.app)
      const db = getDatabase(Firebase.app)
      const st = getStorage(Firebase.app)
      if (process.env.NODE_ENV !== 'production') {
        connectDatabaseEmulator(db, 'localhost', 9000)
        connectAuthEmulator(auth, 'http://127.0.0.1:9099')
        connectStorageEmulator(st, 'localhost', 9199)
      }
    }

    return Firebase.app
  }
}