import {shallowMount} from '@vue/test-utils'
import App from '@/App.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import AuthService from '@/services/AuthService'

describe('App.vue', () => {
  const listener = jest.spyOn(AuthService, 'onAuthStateChanged')
  beforeEach(async () => {
    shallowMount(App,
      {
        global: {
          plugins: [router, i18n],
          provide: {
            'appName': 'test'
          }
        },
      })
    await router.isReady()
  })

  it('auth listener is called when App is mounted', async () => {
    expect(listener).toBeCalled()
  })
})