import {NavigationGuardNext, RouteLocationNormalized} from 'vue-router'
import {getAuth} from 'firebase/auth'
import {Firebase} from '@/services/Firebase'

export default function authGuard (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
  if (to.name !== 'login' && !getAuth(Firebase.getInstance()).currentUser) next({ name: 'login' })
  else if (to.name === 'login' && getAuth(Firebase.getInstance()).currentUser) next({ name: 'main' })
  else next()
}