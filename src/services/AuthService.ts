import {Auth, getAuth, onAuthStateChanged, signInWithEmailAndPassword, User as UserFB, UserCredential, createUserWithEmailAndPassword, signOut} from 'firebase/auth'
import Firebase from '@/services/Firebase'
import User from '@/models/User'
import UserRepository from '@/repositories/UserRepository'
import router from '@/router'
import WhatsAppClient from '@/services/gordaApi/WhatsAppClient'
import {useLoadingState} from '@/services/stores/LoadingState'

export default class AuthService {
  public static currentUser: User
  public static auth: Auth = getAuth(Firebase.getInstance())

  /* istanbul ignore next */
  public static login(email: string, pass: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(AuthService.auth, email, pass)
  }

  /* istanbul ignore next */
  public static onAuthStateChanged(path: string): void {
    const {setLoading} = useLoadingState()
    setLoading(true)
    onAuthStateChanged(AuthService.auth, async (userFB: UserFB | null) => {
      setLoading(false)
      if (userFB) {
        const user = await UserRepository.getUser(userFB.uid)?? {}
        if(user) {
          this.currentUser = new User()
          Object.assign(this.currentUser, user)
        }
        await router.push(path.includes('login') ? {name: 'main'} : path)
      } else {
        await router.push({name: 'login'})
      }
    })
  }

  /* istanbul ignore next */
  public static getCurrentUser(): User {
    return AuthService.currentUser
  }

  /* istanbul ignore next */
  public static createUser(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(AuthService.auth, email, password)
  }

  /* istanbul ignore next */
  public static logOut(): Promise<void> {
    return signOut(AuthService.auth).then(() => {
      const wpClient = WhatsAppClient.getInstance()
      wpClient.disconnectSocket()
    })
  }
}