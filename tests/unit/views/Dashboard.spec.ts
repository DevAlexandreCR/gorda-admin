import {mount, VueWrapper} from '@vue/test-utils'
import Dashboard from '@/views/Dashboard.vue'
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'

describe('Dashboard.vue', () => {
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
    expect(wrapper.html()).toContain('users')
  })
})