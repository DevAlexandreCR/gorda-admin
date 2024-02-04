import {mount, VueWrapper} from '@vue/test-utils'
import SideBar from '@/components/SideBar.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import AuthService from '@/services/AuthService'
import {openServer, socket} from '../../testSetup'
import {WhatsApp} from '@/services/gordaApi/constants/WhatsApp'
import waitForExpect from 'wait-for-expect'
import {useWpClientsStore} from "@/services/stores/WpClientStore";

describe('SideBar.vue', () => {
  let wrapper: VueWrapper<any>

  beforeEach(async () => {
    const wpClient = useWpClientsStore()
    wpClient.clients = {
      3103794656: {
        id: '3103794656',
        alias: 'Principal',
        wpNotifications: false,
        chatBot: false
      }
    }
    wpClient.defaultClient = '3103794656'
    wrapper = mount(SideBar,
      {
        attachTo: '#root',
        global: {
          plugins: [router, i18n]
        },
      })
    await router.isReady()
  })

  beforeEach((done) => {
    openServer(done)
  }, 10000)

  afterEach((done) => {
    socket.close(done)
  }, 10000)

  it('an user can show buttons to users and dashboard', async () => {
    expect(wrapper.find('#sidenav-main').exists()).toBeTruthy()
    expect(wrapper.html()).toContain(i18n.global.t('routes.users'))
  })
  
  it('must change state to connected', async () => {
    socket.emit(WhatsApp.EVENT_CHANGE_STATE, WhatsApp.STATUS_CONNECTED)
    await wrapper.vm.$nextTick()
    
    await waitForExpect(() => {
      expect(wrapper.vm.connectionState).toBeTruthy()
    })
  })
  
  it('an user can sign out', async () => {
    const logout = jest.spyOn(AuthService, 'logOut')
    const btn = wrapper.find('#signOut')
    await btn.trigger('click')
    expect(logout).toBeCalled()
  })
})