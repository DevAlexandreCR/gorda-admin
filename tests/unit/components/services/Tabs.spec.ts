import {mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import Tabs from "@/components/services/Tabs.vue";
import CreateService from "@/components/services/CreateService.vue";
import ServicesTable from "@/components/services/ServicesTable.vue";

describe('Tabs.vue', () => {
  let wrapper: VueWrapper<any>
  const div = document.createElement('div')
  div.id = 'root'
  document.body.appendChild(div)
  beforeEach(async () => {
    wrapper = mount(Tabs,
      {
        attachTo: '#root',
        components: {
          CreateService,
          ServicesTable
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
  it('an user can ', async () => {
    await wrapper.vm.$nextTick()
    const tables = wrapper.findAllComponents(ServicesTable)
    const form = wrapper.findComponent(CreateService)
    expect(tables.length).toBe(3)
    expect(form.exists()).toBeTruthy()
  })
})