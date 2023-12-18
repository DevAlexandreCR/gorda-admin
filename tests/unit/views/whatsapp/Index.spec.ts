import {mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import {nextTick} from "vue";
import SettingsRepository from "@/repositories/SettingsRepository";
import Index from "@/views/whatsapp/Index.vue";
import {useWpClientsStore} from "@/services/stores/WpClientStore";
import {WpClient} from "@/types/WpClient";
import Connection from "@/views/whatsapp/Connection.vue";
import waitForExpect from "wait-for-expect";

describe('Index.vue', () => {
  let wrapper: VueWrapper<any>
  const client: WpClient = {
    id: '3103794656',
    alias: 'Principal',
    wpNotifications: false,
    chatBot: false
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
    await nextTick()
    await wrapper.find('.btn-primary').trigger('click')
    const inputAlias =  wrapper.find('input[name="alias"]')
    await inputAlias.setValue('name')
    const inputPhone =  wrapper.find('input[name="id"]')
    await inputPhone.setValue('3100000000')
    await wrapper.find('.btn-info').trigger('click')
    await nextTick()
    await waitForExpect(() => {
      expect(wrapper.findAllComponents(Connection).length).toBe(2)
      expect(wrapper.html()).toContain('Name')
      expect(wrapper.html()).toContain('3100000000')
    })
  })
})