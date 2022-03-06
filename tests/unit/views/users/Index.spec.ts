import {mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import AuthService from '@/services/AuthService'
import User from '@/models/User'
import UserInterface from '../../../mocks/entities/UserInterface'
import Index from '@/views/users/Index.vue'
import UserRepository from '@/repositories/UserRepository'

UserRepository.getAll = jest.fn().mockResolvedValue([UserInterface])

describe('Index.vue', () => {
  AuthService.currentUser = new User()
  Object.assign(AuthService.currentUser, UserInterface)
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = mount(Index,
      {
        global: {
          plugins: [router, i18n],
          provide: {
            'appName': 'test'
          }
        },
      })
    await router.isReady()
  })
  it('an user can show users list', async () => {
    wrapper.vm.$nextTick()
    expect(wrapper.html()).toContain(UserInterface.name)
    expect(wrapper.html()).toContain(UserInterface.email)
    expect(wrapper.html()).toContain(UserInterface.photoUrl)
  })
})