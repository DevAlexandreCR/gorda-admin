import {NavigationGuardNext, RouteLocationNormalized} from 'vue-router'
import AuthService from '@/services/AuthService'

export default function adminGuard (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
  if (to.meta.requireRole && AuthService.currentUser.roles?.admin) next()
  else next({name: 'forbidden'})
}