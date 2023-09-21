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
    const labels = wrapper.findAll('.form-control-label')
    const inputs = wrapper.findAll('input')
    const editButtons = wrapper.findAll('.badge')
    const submitButton = wrapper.find('.btn-primary')
    expect(inputs.length).toBe(8)
    expect(labels.length).toBe(8)
    expect(editButtons.length).toBe(8)
    expect(submitButton.exists()).toBe(true)
  })

  it('verify that all input and the submit button are initially disabled', async () => {
    await nextTick()
    const inputs = wrapper.findAll('input')
    inputs.forEach((input) => {
      expect(input.attributes()).toHaveProperty('disabled')
    })
    const editButtons = wrapper.findAll('.badge')
    editButtons.forEach((editButton) => {
      expect(editButton.attributes()).not.toHaveProperty('disabled')
    })
    const submitButton = wrapper.find('.btn-primary')
    expect(submitButton.attributes()).toHaveProperty('disabled')
  })
})