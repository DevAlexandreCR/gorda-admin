import {mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import AuthService from '@/services/AuthService'
import User from '@/models/User'
import UserInterface from '../../../mocks/entities/UserInterface'
import UserRepository from '@/repositories/UserRepository'
import {ErrorMessage, Field, Form} from 'vee-validate'
import Edit from '@/views/users/Edit.vue'

UserRepository.getUser = jest.fn().mockResolvedValue(UserInterface)

describe('Edit.vue', () => {
  AuthService.currentUser = new User(UserInterface)
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = mount(Edit,
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
      })
    await router.isReady()
  })
  it('an user can show user details after mounted', async () => {
    await wrapper.vm.$nextTick()
    const field = wrapper.findComponent(Field)
    const form = wrapper.findComponent(Form)
    const error = wrapper.findComponent(ErrorMessage)
    expect(field.exists()).toBeTruthy()
    expect(form.exists()).toBeTruthy()
    expect(error.exists()).toBeTruthy()
  })

  it('an user can edit edit user details ', async () => {
    const updatedUser = {
      name: 'new Name',
      email: 'new_email@email.com',
      phone: '31000000000'
    }
    await wrapper.vm.$nextTick()
    const inputName = wrapper.find('#name')
    await inputName.setValue(updatedUser.name)
    const inputEmail = wrapper.find('#email')
    await inputEmail.setValue(updatedUser.email)
    const inputPhone = wrapper.find('#phone')
    await inputPhone.setValue(updatedUser.phone)
    const button =  wrapper.find('button[type="submit"]')
    await button.trigger('submit')

    expect(wrapper.vm.user.name).toBe(updatedUser.name)
    expect(wrapper.vm.user.email).toBe(updatedUser.email)
    expect(wrapper.vm.user.phone).toBe(updatedUser.phone)
  })
})