import {mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import AuthService from '@/services/AuthService'
import User from '@/models/User'
import UserInterface from '../../../mocks/entities/UserMock'
import UserRepository from '@/repositories/UserRepository'
import {ErrorMessage, Field, Form} from 'vee-validate'
import Edit from '@/views/users/Edit.vue'
import {flushPromises} from '@vue/test-utils'
import waitForExpect from 'wait-for-expect'
import Swal from 'sweetalert2'
import StorageService from '@/services/StorageService'
import dayjs from "dayjs";

UserRepository.getUser = jest.fn().mockResolvedValue(UserInterface)
UserRepository.update = jest.fn().mockResolvedValue(UserInterface)
StorageService.getStorageReference = jest.fn().mockImplementation()
StorageService.uploadFile = jest.fn().mockResolvedValue('http://localhost')

describe('Edit.vue', () => {
  AuthService.currentUser = new User()
  Object.assign(AuthService.currentUser, UserInterface)
  let wrapper: VueWrapper<any>
  const div = document.createElement('div')
  div.id = 'root'
  document.body.appendChild(div)
  beforeEach(async () => {
    wrapper = mount(Edit,
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
    await button.trigger('click')

    await flushPromises()
    await waitForExpect(() => {
      expect(wrapper.vm.user.name).toBe(updatedUser.name)
      expect(wrapper.vm.user.email).toBe(updatedUser.email)
      expect(wrapper.vm.user.phone).toBe(updatedUser.phone)

    })
  })

  it('show error when update function fails', async () => {
    const swal = jest.spyOn(Swal,'fire')
    UserRepository.update = jest.fn().mockRejectedValue(new Error('New Error'))
    const button =  wrapper.find('button[type="submit"]')
    await button.trigger('click')

    await flushPromises()
    await waitForExpect(() => {
      expect(swal).toBeCalledWith({
        icon: 'error',
        title: wrapper.vm.$t('common.messages.error'),
        text: 'New Error',
      })
    })
  })

  it('user can enable or disable user', async () => {
    const enable =  wrapper.find('input[name="enable"]')
    await enable.trigger('click')
    expect(wrapper.vm.user.enabled_at).toBeNull()
    await enable.trigger('click')
    expect(wrapper.vm.user.enabled_at).toBe(dayjs().unix())
  })

  it('user can assign role to user', async () => {
    const operator =  wrapper.find('#operator')
    await operator.trigger('click')
    const admin =  wrapper.find('#admin')
    await admin.trigger('click')

    expect(wrapper.vm.user.roles.operator).toBeTruthy()
    expect(wrapper.vm.user.roles.admin).toBeFalsy()
  })

  it('an user can edit urlPhoto', async () => {
    await wrapper.vm.$nextTick()
    const updateUser = jest.spyOn(wrapper.vm,'updateUser')
    await wrapper.vm.uploadImg()
    expect(updateUser).toBeCalled()
    expect(wrapper.vm.user.photoUrl).toBe('http://localhost')
  })
})