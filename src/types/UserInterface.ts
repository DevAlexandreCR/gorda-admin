import {Roles} from '@/types/Roles'

export interface UserInterface {
  id?: string
  name: string
  email: string
	password: string|null
  phone: string
  photoUrl?: string
  enabled_at: number
  created_at: number
  roles?: Roles

  isAdmin(): boolean
  isEnabled(): boolean
}