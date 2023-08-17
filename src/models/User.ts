import {UserInterface} from '@/types/UserInterface'
import {Roles} from '@/types/Roles'
import dayjs from 'dayjs'

export default class User implements UserInterface {
  id?: string
  name: string
  email: string
  password: string
  phone: string
  photoUrl?: string
  enabled_at = 0
  created_at: number = dayjs().unix()
  roles: Roles = {
    operator: false,
    admin: false
  }

  isAdmin(): boolean {
    return this.roles.admin ?? false
  }

  isEnabled(): boolean {
    return !!this.enabled_at
  }
}