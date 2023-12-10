import {FirebaseApp, initializeApp} from 'firebase/app'
import firebaseConfig from '../../firebase.config'
import {connectAuthEmulator, getAuth} from 'firebase/auth'
import {connectDatabaseEmulator, getDatabase} from 'firebase/database'
import {connectStorageEmulator, getStorage} from 'firebase/storage'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

export default class Firebase {

  private static app: FirebaseApp

  public static getInstance(): FirebaseApp {
    if (!Firebase.app) {
      Firebase.app = initializeApp(firebaseConfig)
      const auth = getAuth(Firebase.app)
      const db = getDatabase(Firebase.app)
      const st = getStorage(Firebase.app)
      const fs = getFirestore(Firebase.app)
      if (process.env.NODE_ENV !== 'production') {
				// localStorage.clear()
        connectDatabaseEmulator(db, 'localhost', 9000)
        connectAuthEmulator(auth, 'http://127.0.0.1:9099')
        connectStorageEmulator(st, 'localhost', 9199)
        connectFirestoreEmulator(fs, 'localhost', 8080)
      }
    }

    return Firebase.app
  }
}