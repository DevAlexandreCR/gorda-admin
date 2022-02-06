import {Roles} from '@/entities/Roles'

class UserInterface {
  id = 'id'
  name = 'Admin 1'
  email = 'admin@admin.com'
  phone = '310374656'
  photoUrl = 'https://fakeUrl.com'
  roles: Roles =  {
    admin: true,
    operator: false
  }
}

export default new UserInterface()