import {UserInterface} from '@/types/UserInterface'
import {Roles} from '@/types/Roles'

export default class User implements UserInterface {
  id?: string
  name?: string
  email?: string
  phone?: string
  photoUrl?: string
  enabled_at: number|null
  created_at: number
  roles: Roles

  isAdmin(): boolean {
    return this.roles.admin ?? false
  }

  isEnabled(): boolean {
    return !!this.enabled_at
  }
}