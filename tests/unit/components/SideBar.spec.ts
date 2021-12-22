import {mount, VueWrapper} from '@vue/test-utils'
import SideBar from '@/components/SideBar.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import AuthService from '@/services/AuthService'
import User from '@/models/User'

describe('SideBar.vue', () => {
  let wrapper: VueWrapper<any>
  AuthService.currentUser = new User({
    id: 'id',
    name: 'Admin',
    email: 'admin@admin.com',
    roles: {
      admin: true,
      operator: false
    }
  })
  beforeEach(async () => {
    wrapper = mount(SideBar,
      {
        global: {
          plugins: [router, i18n]
        },
      })
    await router.isReady()
  })

  it('an user can show buttons to users and dashboard', async () => {
    expect(wrapper.find('#sidenav-main').exists()).toBeTruthy()
    expect(wrapper.html()).toContain('Users')
  })
})