import {flushPromises, mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import {nextTick} from "vue";
import SettingsRepository from "@/repositories/SettingsRepository";
import Index from "@/views/whatsapp/Index.vue";
import {useWpClientsStore} from "@/services/stores/WpClientStore";
import {WpClient} from "@/types/WpClient";
import waitForExpect from "wait-for-expect";
import Swal from "sweetalert2";

describe('Index.vue', () => {
  let wrapper: VueWrapper<any>
  const client: WpClient = {
    id: '3103794656',
    alias: 'Principal',
    wpNotifications: false,
    chatBot: false,
    assistant: false
  }

  beforeEach(async () => {
    const wpClient = useWpClientsStore()
    wpClient.clients = {
      3103794656: client
    }
    wrapper = mount(Index,
      {
        attachTo: '#root',
        global: {
          plugins: [router, i18n]
        }
      })
    await router.isReady()
  })

  test('it must show button create when mounted', async () => {
    await nextTick()
    expect(wrapper.find('.btn-primary').exists()).toBeTruthy()
    expect(wrapper.html()).toContain('Principal')
    expect(wrapper.html()).toContain('3103794656')
    expect(wrapper.vm.connected).toBeFalsy()
  })

  test('it must change to camelcase the alias when writing', async () => {
    await nextTick()
    await wrapper.find('.btn-primary').trigger('click')
    const input =  wrapper.find('input[name="alias"]')
    await input.setValue('name')
    await nextTick()
    expect(wrapper.vm.newClient.alias).toMatch('Name')
  })

  test('it must create a new Client', async () => {
    SettingsRepository.createClient = jest.fn().mockResolvedValue(null)
    SettingsRepository.deleteClient = jest.fn().mockResolvedValue(null)
    await nextTick()
    await wrapper.find('.btn-primary').trigger('click')
    const inputAlias =  wrapper.find('input[name="alias"]')
    await inputAlias.setValue('name')
    const inputPhone =  wrapper.find('input[name="id"]')
    await inputPhone.setValue('3100000000')
    await wrapper.find('.btn-info').trigger('click')
    await wrapper.find('form').trigger('submit')
    await nextTick()
    await flushPromises()
    await waitForExpect(() => {
      expect(SettingsRepository.createClient).toBeCalled()
      expect(wrapper.html()).toContain('Name')
      expect(wrapper.html()).toContain('3100000000')
    })
  }, 10000)

  test('it must fail when create a new Client', async () => {
    const swal = jest.spyOn(Swal,'fire')
    SettingsRepository.deleteClient = jest.fn().mockResolvedValue(null)
    SettingsRepository.createClient = jest.fn().mockRejectedValue(new Error('new error'))
    await nextTick()
    await wrapper.find('.btn-primary').trigger('click')
    const inputAlias =  wrapper.find('input[name="alias"]')
    await inputAlias.setValue('name')
    const inputPhone =  wrapper.find('input[name="id"]')
    await inputPhone.setValue('3100000000')
    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    await flushPromises()
    await waitForExpect(() => {
      expect(swal).toBeCalled()
      expect(SettingsRepository.createClient).rejects.toThrow('new error')
      expect(wrapper.html()).not.toContain('Name')
      expect(wrapper.html()).not.toContain('3100000000')
    })
  })
})