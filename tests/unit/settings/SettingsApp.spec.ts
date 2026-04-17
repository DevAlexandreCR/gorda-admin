import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import SettingsAppVue from '@/views/settings/SettingsApp.vue'
import { nextTick } from 'vue'
import { useSettingsStore } from '@/services/stores/SettingsStore'

const rideFeesMock = {
  price_kilometer: 800,
  price_minute: 190,
  fees_base: 2200,
  fees_additional: 500,
  fees_minimum: 6500,
  fees_night: 1.1,
  fees_DxF: 1.1,
  fees_night_DxF: 1.15,
  fees_min_day: 6500,
  fees_min_nigth: 7000,
  fees_min_festive_day: 7500,
  fees_min_festive_nigth: 8000,
  timeout_to_complete: 240,
  timeout_to_connection: 120,
  fee_multiplier: 1,
  dynamic_multipliers: []
}

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

  it('refreshes ride fees each time the ride fees tab is entered', async () => {
    const settingsStore = useSettingsStore()
    settingsStore.$patch({ rideFees: { ...rideFeesMock } })
    await nextTick()
    const getRideFeesSpy = jest.spyOn(settingsStore, 'getRideFees').mockResolvedValue()

    await wrapper.find('#ride-fees-tab').trigger('click')
    await flushPromises()
    await wrapper.find('#settings-tab').trigger('click')
    await wrapper.find('#ride-fees-tab').trigger('click')
    await flushPromises()

    expect(getRideFeesSpy).toHaveBeenCalledTimes(2)
  })

  it('keeps the current ride fees when refresh fails', async () => {
    const settingsStore = useSettingsStore()
    settingsStore.$patch({
      rideFees: {
        ...rideFeesMock,
        fee_multiplier: 1.7,
      },
    })
    await nextTick()

    jest.spyOn(settingsStore, 'getRideFees').mockRejectedValue(new Error('Network error'))

    await wrapper.find('#ride-fees-tab').trigger('click')
    await flushPromises()

    const inputValues = wrapper.findAll('input').map((input) => (input.element as HTMLInputElement).value)
    expect(inputValues).toContain('6500')
    expect(inputValues).toContain('1.7')
  })
})
