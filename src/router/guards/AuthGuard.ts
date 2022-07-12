import {NavigationGuardNext, RouteLocationNormalized} from 'vue-router'
import AuthService from '@/services/AuthService'

export default function authGuard (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
  if (to.meta.requireRole && !AuthService.currentUser) next({ name: 'login' })
  else if (to.meta.requireRole && AuthService.currentUser.roles?.admin) next()
  else if (to.meta.requireRole && !AuthService.currentUser.roles?.operator) next({name: 'forbidden'})
  else next()
}