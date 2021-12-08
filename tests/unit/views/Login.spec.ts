import {mount, VueWrapper} from '@vue/test-utils'
import Login from '@/views/Login.vue'
import router from '@/router'
import firebase from '@/plugins/firebase'
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
          plugins: [router, firebase],
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
    expect(wrapper.text()).toContain('Usuario o contraseña incorrectos!')
    expect(wrapper.vm.error).toBeTruthy()
  })
})