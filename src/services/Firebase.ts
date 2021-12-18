import {FirebaseApp, initializeApp} from 'firebase/app'
import firebaseConfig from '../../firebase.config'
import {connectAuthEmulator, getAuth} from 'firebase/auth'
import {connectDatabaseEmulator, getDatabase} from 'firebase/database'

export class Firebase {

  private static app: FirebaseApp;

  public static getInstance(): FirebaseApp {
    if (!Firebase.app) {
      Firebase.app = initializeApp(firebaseConfig)
      const auth = getAuth(Firebase.app)
      const db = getDatabase(Firebase.app)
      if (location.hostname === "localhost") {
        connectDatabaseEmulator(db, "localhost", 9000);
        connectAuthEmulator(auth, "http://127.0.0.1:9099");
      }
    }

    return Firebase.app;
  }
}