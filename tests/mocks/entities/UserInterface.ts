import {Roles} from '@/entities/Roles'

class UserInterface {
  id = 'id'
  name = 'Admin'
  email = 'admin@admin.com'
  phone = '310374656'
  photoUrl = 'https://fakeUrl.com'
  roles: Roles =  {
    admin: true,
    operator: false
  }
}

export default new UserInterface()