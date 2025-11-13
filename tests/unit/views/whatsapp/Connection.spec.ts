import { flushPromises, shallowMount, VueWrapper } from '@vue/test-utils'
import Connection from '@/views/whatsapp/Connection.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import { openServer, socket } from '../../../testSetup'
import waitForExpect from 'wait-for-expect'
import { WhatsApp } from '@/services/gordaApi/constants/WhatsApp'
import { useWpClientsStore } from "@/services/stores/WpClientStore"
import { nextTick } from "vue"
import { WpClient } from "@/types/WpClient"
import SettingsRepository from "@/repositories/SettingsRepository"
import Swal from "sweetalert2"
import { WhatsappServices } from "@/constants/WhatsappServices"

describe('Connection.vue', () => {
  let wrapper: VueWrapper<any>
  const client: WpClient = {
    id: '3103794656',
    alias: 'Principal',
    full: false,
    wpNotifications: false,
    chatBot: false,
    assistant: false,
    service: WhatsappServices.WHATSAPP_WEB_JS
  }

  beforeEach(async () => {
    const wpClient = useWpClientsStore()
    wpClient.clients = {
      3103794656: client
    }
    wrapper = shallowMount(Connection,
      {
        attachTo: '#root',
        props: {
          client: client
        },
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

  test('an user cannot delete a wp-client when error', async () => {
    const swal = jest.spyOn(Swal, 'fire')
    SettingsRepository.deleteClient = jest.fn().mockRejectedValue(new Error('new error'))
    await nextTick()
    wrapper.vm.deleteWpClient()
    await nextTick()
    await flushPromises()
    await waitForExpect(() => {
      expect(swal).toBeCalled()
      expect(SettingsRepository.deleteClient).rejects.toThrow('new error')
    })
  }, 10000)

  test('connected var is initialized when mounted', async () => {
    await nextTick()
    expect(wrapper.find('h4').text()).toMatch('Principal')
    expect(wrapper.find('.btn-danger').exists()).toBeTruthy()
    expect(wrapper.find('.btn-primary').exists()).toBeTruthy()
    expect(wrapper.vm.connected).toBeFalsy()
  })

  test('it must throw event when click buttons', async () => {
    wrapper.vm.connected = false
    await nextTick()
    await wrapper.find('.btn-primary').trigger('click')
    expect(wrapper.vm.qr).toBeNull()
    expect(wrapper.vm.connecting).toBeTruthy()
  })

  test('set qr when io emit event qr', async () => {
    socket.emit(WhatsApp.EVENT_QR_CODE, 'fake-qr')
    await nextTick()
    await waitForExpect(() => {
      expect(wrapper.vm.connecting).toBeFalsy()
      expect(wrapper.vm.qr).toBe('fake-qr')
    })
  })

  test('an user can delete a wp-client', async () => {
    const fn = jest.spyOn(wrapper.vm.wpClient, 'destroy')
    SettingsRepository.deleteClient = jest.fn().mockResolvedValue(null)
    wrapper.vm.deleteWpClient()
    await nextTick()
    expect(fn).toBeCalled()
  }, 10000)
})