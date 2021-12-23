import {Roles} from '@/entities/Roles'

class UserInterface {
  id: string = 'id'
  name: string = 'Admin'
  email: string = 'admin@admin.com'
  phone: string = '310374656'
  photoUrl: string = 'https://fakeUrl.com'
  roles: Roles =  {
    admin: true,
    operator: false
  }
}

export default new UserInterface()