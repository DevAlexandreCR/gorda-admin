import {getDatabase} from 'firebase/database'
import {Firebase} from '../services/Firebase'

export default {
  install: (app) => {
    const firebaseApp = Firebase.getInstance()
    const db = getDatabase(firebaseApp)

    app.provide('db', db)
  }
}