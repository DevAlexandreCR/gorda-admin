import {NavigationGuardNext, RouteLocationNormalized} from 'vue-router'
import AuthService from '@/services/AuthService'

export default function authGuard (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
  if (to.path.includes('dashboard') && !AuthService.auth.currentUser) next({ name: 'login' })
  else next()
}