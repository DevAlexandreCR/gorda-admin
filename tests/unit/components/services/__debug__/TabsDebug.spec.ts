import {shallowMount} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import Tabs from '@/components/services/Tabs.vue'
import {nextTick} from 'vue'

describe('Tabs debug', () => {
  it('dumps html', async () => {
    const wrapper = shallowMount(Tabs, {
      attachTo: document.body,
      global: {
        plugins: [router, i18n],
        provide: {appName: 'test'}
      }
    })
    await router.isReady()
    await nextTick()
    console.log('=== BEFORE CLICK ===')
    console.log(wrapper.html())
    const tab = wrapper.find('#progress-tab')
    console.log('tab exists?', tab.exists())
    await tab.trigger('click')
    await wrapper.vm.$nextTick()
    console.log('=== AFTER CLICK ===')
    console.log(wrapper.html())
    console.log('input found?', wrapper.find('input[name="search"]').exists())
  })
})
