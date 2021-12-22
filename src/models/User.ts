import {User as UserInterface} from '@/entities/User'
import {Roles} from '@/entities/Roles'

export default class User {
  id?: string
  name?: string
  email?: string
  phone?: string
  photoUrl?: string
  roles?: Roles

  constructor(user: UserInterface) {
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.phone = user.phone
    this.photoUrl = user.photoUrl
    this.roles = user.roles
  }

  isAdmin(): boolean {
    return this.roles?.admin ?? false
  }
}