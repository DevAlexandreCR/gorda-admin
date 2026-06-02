import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import AuthService from '@/services/AuthService'

export default function superAdminGuard(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  if (AuthService.currentUser?.roles?.superadmin) next()
  else next({ name: 'forbidden' })
}
