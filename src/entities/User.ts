import {Roles} from '@/entities/Roles'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  photoUrl?: string
  roles?: Roles
}