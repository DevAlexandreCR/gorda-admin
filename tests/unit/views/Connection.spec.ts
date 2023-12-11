import {shallowMount, VueWrapper} from '@vue/test-utils'
import Connection from '@/views/whatsapp/Connection.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import {openServer, socket} from '../../testSetup'
import waitForExpect from 'wait-for-expect'
import {WhatsApp} from '@/services/gordaApi/constants/WhatsApp'
import {useWpClientsStore} from "@/services/stores/WpClientStore";

describe('Connection.vue', () => {
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
    wrapper = shallowMount(Connection,
      {
        attachTo: '#root',
        global: {
          plugins: [router, i18n]
        }
      })
    await router.isReady()
  })

  beforeAll((done) => {
    openServer(done)
  }, 10000)

  afterAll((done) => {
    socket.close(done)
  }, 10000)

  test('connected var is initialized when mounted', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.find('h4').text()).toMatch('Disconnected')
    expect(wrapper.vm.connected).toBeFalsy()
  })
  
  test('it must throw event when click buttons', async () => {
    wrapper.vm.connected = false
    await wrapper.vm.$nextTick()
    await wrapper.find('.btn-primary').trigger('click')
    expect(wrapper.vm.qr).toBeNull()
    expect(wrapper.vm.connecting).toBeTruthy()
  })
  
  test('set qr when io emit event qr', async () => {
    socket.emit(WhatsApp.EVENT_QR_CODE, 'fake-qr')
    await wrapper.vm.$nextTick()
    await waitForExpect(() => {
      expect(wrapper.vm.connecting).toBeFalsy()
      expect(wrapper.vm.qr).toBe('fake-qr')
    })
  })
})