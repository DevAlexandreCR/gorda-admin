import {Roles} from '@/entities/Roles'

export interface UserInterface {
  id?: string
  name?: string
  email?: string
  phone?: string
  photoUrl?: string
  enabled_at?: string
  created_at?: string
  roles?: Roles
}