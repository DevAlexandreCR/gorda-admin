import { mount, VueWrapper } from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import SettingsAppVue from '@/views/settings/SettingsApp.vue'
import { nextTick } from 'vue'

describe('SettingsApp.vue', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = mount(SettingsAppVue, {
      attachTo: '#root',
      global: {
        plugins: [router, i18n],
      },
    })
    await router.isReady()
  })

  it('renders elements correctly', async () => {
    await nextTick()
    const tabs = wrapper.findAll('.nav-link')
    const inputs = wrapper.findAll('input')
    expect(tabs.length).toBe(3)
    expect(inputs.length).toBe(5)
  })

  it('renders the general settings tab as active on initial load', async () => {
    await nextTick()
    expect(wrapper.find('#settings-tab').classes()).toContain('active')
    expect(wrapper.text()).toContain(i18n.global.t('common.settings.general_settings'))
  })
})
