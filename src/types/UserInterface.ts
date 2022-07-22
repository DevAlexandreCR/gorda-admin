import {Roles} from '@/types/Roles'

export interface UserInterface {
  id?: string
  name: string
  email: string
  phone: string
  photoUrl?: string
  enabled_at: number|null
  created_at: number
  roles?: Roles

  isAdmin(): boolean
  isEnabled(): boolean
}