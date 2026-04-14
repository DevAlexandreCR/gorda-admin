import {mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import AuthService from '@/services/AuthService'
import User from '@/models/User'
import UserInterface from '../../mocks/entities/UserMock'
import Profile from '@/views/users/Profile.vue'

const currentUser = new User()
Object.assign(currentUser, UserInterface)

describe('Profile.vue', () => {
  AuthService.currentUser = currentUser
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
    expect(wrapper.vm.user).toStrictEqual(currentUser)
    expect(wrapper.html()).toContain(currentUser.name)
    expect(wrapper.html()).toContain(currentUser.email)
    expect(wrapper.html()).toContain(currentUser.phone)
    expect(wrapper.html()).toContain(i18n.global.t('users.fields.admin'))
    expect(wrapper.html()).not.toContain(i18n.global.t('users.fields.operator'))
  })
})
