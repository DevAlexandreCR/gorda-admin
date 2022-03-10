import {Roles} from '@/entities/Roles'
import dayjs from "dayjs";

class UserMock {
  id = 'id'
  name = 'Admin 1'
  email = 'admin@admin.com'
  phone = '310374656'
  photoUrl = 'https://fakeUrl.com'
  created_at =  dayjs().unix()
  enabled_at = dayjs().unix()
  roles: Roles =  {
    admin: true,
    operator: false
  }
}

export default new UserMock()