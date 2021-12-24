import {User as UserInterface} from '@/entities/User'
import {Roles} from '@/entities/Roles'

export default class User {
  id?: string
  name?: string
  email?: string
  phone?: string
  photoUrl?: string
  enabled_at?: string
  created_at?: string
  roles?: Roles

  constructor(user: UserInterface) {
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.phone = user.phone
    this.photoUrl = user.photoUrl
    this.roles = user.roles
    this.enabled_at = user.enabled_at
    this.created_at = user.created_at
  }

  isAdmin(): boolean {
    return this.roles?.admin ?? false
  }

  isEnabled(): boolean {
    return !!this.enabled_at
  }
}