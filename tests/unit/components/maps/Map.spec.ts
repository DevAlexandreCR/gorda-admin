import {mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import Map from '@/components/maps/Map.vue'
import {flushPromises} from '@vue/test-utils'

describe('Map.vue', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = mount(Map,
      {
        attachTo: '#root',
        global: {
          plugins: [router, i18n],
          provide: {
            'appName': 'test'
          }
        },
        propsData: {
            places: "name: 'barrio berlin', lat: 2.431681, lng: -76.601789"
        }
      })
    await router.isReady()
  })
  afterEach(async () => {
    await flushPromises()
  })

it('A user can see the map', async () => {
    const div = wrapper.find('div[id="map"]')
    expect(div.exists()).toBeTruthy()
 })

it('checks the prop places', async () => {
    expect(wrapper.props().places).toBe("name: 'barrio berlin', lat: 2.431681, lng: -76.601789")
 })
})
