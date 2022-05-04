import {mount, VueWrapper} from '@vue/test-utils'
import Dashboard from '@/views/Dashboard.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import AuthService from '@/services/AuthService'
import UserInterface from '../../mocks/entities/UserMock'

describe('Dashboard.vue', () => {
  Object.assign(AuthService.currentUser, UserInterface)
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = mount(Dashboard,
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
  it('an user can show dashboard', async () => {
    expect(wrapper.html()).toContain(wrapper.vm.$t('routes.dashboard'))
    expect(wrapper.html()).toContain(wrapper.vm.$t('routes.users'))
  })
})