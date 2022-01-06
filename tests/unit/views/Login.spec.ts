import {mount, VueWrapper} from '@vue/test-utils'
import Login from '@/views/Login.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import {ErrorMessage, Field, Form} from 'vee-validate'

describe('Login.vue', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = mount(Login,
      {
        components: {
          Form,
          Field,
          ErrorMessage
        },
        global: {
          plugins: [router, i18n],
          provide: {
            'appName': 'test'
          }
        },
      }
    )
    await router.isReady()
  })
  it('show alert when try login without credentials', async () => {
    await wrapper.vm.login({email: '', pass: ''})
    expect(wrapper.text()).toContain($t('users.alert'))
    expect(wrapper.vm.error).toBeTruthy()
  })
})