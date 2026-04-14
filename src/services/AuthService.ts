import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as UserFB,
  UserCredential
} from 'firebase/auth'
import axios from 'axios'
import Firebase from '@/services/Firebase'
import User from '@/models/User'
import UserRepository from '@/repositories/UserRepository'
import router from '@/router'
import { useLoadingState } from '@/services/stores/LoadingState'

export type LoginErrorKind = 'invalid-credentials' | 'missing-profile' | 'server-error'

export class AuthFlowError extends Error {
  kind: LoginErrorKind

  constructor(kind: LoginErrorKind, message?: string) {
    super(message ?? kind)
    this.name = 'AuthFlowError'
    this.kind = kind
    Object.setPrototypeOf(this, AuthFlowError.prototype)
  }
}

export default class AuthService {
  public static currentUser: User | null = null
  public static auth: Auth = getAuth(Firebase.getInstance())
  private static profileResolution:
    | {
      uid: string
      promise: Promise<User>
    }
    | null = null

  /* istanbul ignore next */
  public static async login(email: string, pass: string): Promise<UserCredential> {
    try {
      const credential = await signInWithEmailAndPassword(AuthService.auth, email, pass)
      await AuthService.resolveAuthenticatedUser(credential.user)
      return credential
    } catch (error) {
      const authError = AuthService.toAuthFlowError(error)

      if (authError.kind !== 'invalid-credentials') {
        await AuthService.clearAuthenticatedSession()
      }

      throw authError
    }
  }

  /* istanbul ignore next */
  public static onAuthStateChanged(path: string): void {
    const { setLoading } = useLoadingState()
    onAuthStateChanged(AuthService.auth, async (userFB: UserFB | null) => {
      setLoading(true)

      try {
        if (userFB) {
          await AuthService.resolveAuthenticatedUser(userFB)
          await router.push(path.includes('login') ? { name: 'main' } : path)
        } else {
          AuthService.currentUser = null

          if (!AuthService.isPublicPath(path)) {
            await router.push({ name: 'login' })
          }
        }
      } catch (_error) {
        await AuthService.clearAuthenticatedSession()
        if (!AuthService.isPublicPath(path)) {
          await router.push({ name: 'login' })
        }
      } finally {
        setLoading(false)
      }
    })
  }

  /* istanbul ignore next */
  public static getCurrentUser(): User {
    return AuthService.currentUser ?? new User()
  }

  /* istanbul ignore next */
  public static createUser(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(AuthService.auth, email, password)
  }

  /* istanbul ignore next */
  public static async logOut(): Promise<void> {
    AuthService.currentUser = null
    await signOut(AuthService.auth)
  }

  public static isAdmin(): boolean {
    return AuthService.currentUser?.isAdmin() ?? false
  }

  private static isPublicPath(path: string): boolean {
    return ['/login', '/sign-up', '/info'].includes(path)
  }

  private static async resolveAuthenticatedUser(userFB: UserFB): Promise<User> {
    if (AuthService.profileResolution?.uid === userFB.uid) {
      return AuthService.profileResolution.promise
    }

    const promise = UserRepository.getUser(userFB.uid)
      .then((user) => {
        AuthService.currentUser = new User()
        Object.assign(AuthService.currentUser, user)
        return AuthService.currentUser
      })
      .catch((error) => {
        AuthService.currentUser = null
        throw AuthService.toAuthFlowError(error)
      })
      .finally(() => {
        if (AuthService.profileResolution?.uid === userFB.uid) {
          AuthService.profileResolution = null
        }
      })

    AuthService.profileResolution = {
      uid: userFB.uid,
      promise,
    }

    return promise
  }

  private static async clearAuthenticatedSession(): Promise<void> {
    AuthService.currentUser = null

    if (AuthService.auth.currentUser) {
      await signOut(AuthService.auth).catch(() => undefined)
    }
  }

  private static toAuthFlowError(error: unknown): AuthFlowError {
    if (error instanceof AuthFlowError) {
      return error
    }

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return new AuthFlowError('missing-profile', error.message)
      }

      return new AuthFlowError('server-error', error.message)
    }

    const errorCode = typeof (error as { code?: unknown })?.code === 'string'
      ? String((error as { code: string }).code)
      : ''

    if ([
      'auth/invalid-email',
      'auth/invalid-credential',
      'auth/invalid-login-credentials',
      'auth/user-not-found',
      'auth/wrong-password',
    ].includes(errorCode)) {
      return new AuthFlowError('invalid-credentials', errorCode)
    }

    return new AuthFlowError('server-error', error instanceof Error ? error.message : undefined)
  }
}
