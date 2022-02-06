import {mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import AuthService from '@/services/AuthService'
import User from '@/models/User'
import UserInterface from '../../mocks/entities/UserInterface'
import Profile from '@/views/Profile.vue'

describe('Profile.vue', () => {
  AuthService.currentUser = new User(UserInterface)
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = mount(Profile,
      {
        global: {
          plugins: [router, i18n]
        },
      })
    await router.isReady()
  })

  it('profile component show user information', async () => {
    expect(wrapper.vm.user).toStrictEqual(AuthService.currentUser)
    expect(wrapper.html()).toContain(AuthService.currentUser.name)
    expect(wrapper.html()).toContain(AuthService.currentUser.email)
    expect(wrapper.html()).toContain(AuthService.currentUser.phone)
    expect(wrapper.html()).toContain('users.fields.admin')
    expect(wrapper.html()).not.toContain('users.fields.operator')
  })
})