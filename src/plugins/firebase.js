import firebaseConfig from '../../firebase.config'
import { initializeApp } from "firebase/app"
import {connectAuthEmulator, getAuth} from 'firebase/auth'
import {connectDatabaseEmulator, getDatabase} from 'firebase/database'

export default {
  install: (app) => {
    const firebaseApp = initializeApp(firebaseConfig)
    const auth = getAuth(firebaseApp)
    const db = getDatabase(firebaseApp)

    if (location.hostname === "localhost") {
      connectDatabaseEmulator(db, "localhost", 9000);
      connectAuthEmulator(auth, "http://127.0.0.1:9099");
    }

    app.provide('auth', auth)
    app.provide('db', db)
  }
}