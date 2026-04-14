import {mount, VueWrapper} from '@vue/test-utils'
import Login from '@/views/Login.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import {ErrorMessage, Field, Form} from 'vee-validate'
import AuthService, { AuthFlowError } from '@/services/AuthService'

describe('Login.vue', () => {
  let wrapper: VueWrapper<any>

  function createDeferred(): {
    promise: Promise<void>
    resolve: () => void
  } {
    let resolve!: () => void

    return {
      promise: new Promise<void>((res) => {
        resolve = res
      }),
      resolve,
    }
  }

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

  it('shows invalid credentials feedback when Firebase rejects the login', async () => {
    AuthService.login = jest.fn().mockRejectedValue(new AuthFlowError('invalid-credentials'))

    wrapper.vm.email = 'admin@admin.com'
    wrapper.vm.pass = '123456'
    await wrapper.vm.login()

    expect(wrapper.text()).toContain(i18n.global.t('users.loginErrors.invalidCredentials.title'))
    expect(wrapper.text()).toContain(i18n.global.t('users.loginErrors.invalidCredentials.message'))
    expect(wrapper.vm.errorKind).toBe('invalid-credentials')
  })

  it('shows missing profile feedback when the admin profile is not found', async () => {
    AuthService.login = jest.fn().mockRejectedValue(new AuthFlowError('missing-profile'))

    wrapper.vm.email = 'admin@admin.com'
    wrapper.vm.pass = '123456'
    await wrapper.vm.login()

    expect(wrapper.text()).toContain(i18n.global.t('users.loginErrors.missingProfile.title'))
    expect(wrapper.text()).toContain(i18n.global.t('users.loginErrors.missingProfile.message'))
    expect(wrapper.vm.errorKind).toBe('missing-profile')
  })

  it('disables the submit button while the login request is in progress', async () => {
    const deferred = createDeferred()
    AuthService.login = jest.fn().mockReturnValue(deferred.promise)

    wrapper.vm.email = 'admin@admin.com'
    wrapper.vm.pass = '123456'
    const loginPromise = wrapper.vm.login()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
    expect(wrapper.vm.submitting).toBeTruthy()

    deferred.resolve()
    await loginPromise
    await wrapper.vm.$nextTick()

    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
    expect(wrapper.vm.submitting).toBeFalsy()
  })

  it('clears the previous login error when the user edits the form', async () => {
    AuthService.login = jest.fn().mockRejectedValue(new AuthFlowError('missing-profile'))

    wrapper.vm.email = 'admin@admin.com'
    wrapper.vm.pass = '123456'
    await wrapper.vm.login()

    expect(wrapper.text()).toContain(i18n.global.t('users.loginErrors.missingProfile.message'))

    await wrapper.find('input[name="email"]').setValue('other@admin.com')

    expect(wrapper.vm.errorMessage).toBe('')
    expect(wrapper.vm.errorTitle).toBe('')
    expect(wrapper.vm.errorKind).toBeNull()
  })
})
