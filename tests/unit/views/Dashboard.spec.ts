import {mount, VueWrapper} from '@vue/test-utils'
import Dashboard from '@/views/Dashboard.vue'
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import AuthService from '@/services/AuthService'
import User from '@/models/User'
import UserInterface from '../../mocks/entities/UserInterface'

describe('Dashboard.vue', () => {
  AuthService.currentUser = new User(UserInterface)
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = mount(Dashboard,
      {
        components: {
          SideBar,
          NavBar
        },
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
    const nav = wrapper.findComponent(NavBar)
    const bar = wrapper.findComponent(SideBar)

    expect(nav.exists()).toBeTruthy()
    expect(bar.exists()).toBeTruthy()
    expect(wrapper.html()).toContain(wrapper.vm.$t('routes.dashboard'))
    expect(wrapper.html()).toContain(wrapper.vm.$t('routes.users'))

  })
})