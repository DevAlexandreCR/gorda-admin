import {Auth, getAuth, onAuthStateChanged, signInWithEmailAndPassword, User, UserCredential} from 'firebase/auth'
import {Firebase} from '@/services/Firebase'
import router from '@/router'

class AuthService {
  constructor() {
    this.onAuthStateChanged()
  }

  private auth: Auth = getAuth(Firebase.getInstance())

  login(email: string, pass: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, pass)
  }

  onAuthStateChanged(): void {
    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        await router.push({name: 'home'})
      } else {
        await router.push({name: 'login'})
      }
    })
  }
}

export default new AuthService()