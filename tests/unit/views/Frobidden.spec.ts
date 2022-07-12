import AuthService from '@/services/AuthService'
import {shallowMount, VueWrapper} from '@vue/test-utils'
import Forbidden from '@/views/Forbidden.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import {nextTick} from 'vue'

describe('Forbidden.vue', () => {
  let wrapper: VueWrapper<any>
  const logout = jest.spyOn(AuthService, 'logOut')
  beforeEach(async () => {
    wrapper = shallowMount(Forbidden,
      {
        attachTo: '#root',
        global: {
          plugins: [router, i18n],
          provide: {
            'appName': 'test'
          }
        },
      })
    await router.isReady()
  })
  
  it('Show image and text when Component is mounted', async () => {
    expect(wrapper.html()).toContain(i18n.global.t('users.upss'))
    expect(wrapper.html()).toContain(i18n.global.t('users.go_back'))
  })
  
  it('it can trigger logout on click button', async () => {
    await router.isReady()
    const button = wrapper.find('.btn-danger')
    await button.trigger('click')
    await nextTick()
    expect(logout).toBeCalled()
  })
})