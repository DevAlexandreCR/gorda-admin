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
import ToastService from "@/services/ToastService"

UserRepository.getUser = jest.fn().mockResolvedValue(UserInterface)
UserRepository.update = jest.fn().mockResolvedValue(UserInterface)
UserRepository.updatePassword = jest.fn().mockResolvedValue(UserInterface)
UserRepository.emailAuth = jest.fn().mockResolvedValue(null)
UserRepository.passwordAuth = jest.fn().mockResolvedValue(null)
UserRepository.enableAuth = jest.fn().mockResolvedValue(null)
StorageService.getStorageReference = jest.fn().mockImplementation()
StorageService.uploadFile = jest.fn().mockResolvedValue('http://localhost')

describe('Edit.vue', () => {
  AuthService.currentUser = new User()
  Object.assign(AuthService.currentUser, UserInterface)
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = mount(Edit,
      {
        attachTo: document.body,
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
    const labels = wrapper.findAll('.form-control-label, .custom-control-label, .form-check-label')
    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBe(8)
    expect(labels.length).toBe(7)
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
        title: i18n.global.t('common.messages.error'),
        text: 'New Error',
      })
    })
  })

  it('should show toast error when updatePassword fail', async () => {
    const error =  jest.spyOn(ToastService, 'toast')
    UserRepository.updatePassword = jest.fn().mockRejectedValue(new Error('new Error'))
    await wrapper.vm.updatePassword()

    await waitForExpect(() => {
      expect(error).toHaveBeenCalledWith('error', i18n.global.t('common.messages.error'), 'new Error')
    })
  })

  it('user can enable or disable user', async () => {
    const enable =  wrapper.find('input[name="enable"]')
    await enable.trigger('click')
    expect(wrapper.vm.user.enabled_at).toBe(0)
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
    await wrapper.vm.uploadImg()
    await flushPromises()
    expect(wrapper.vm.user.photoUrl).toBe('http://localhost')
  })

  it('img should render the modal and input ', async () => {
    await wrapper.vm.$nextTick()
    const modal = wrapper.find('#imgModal')
    expect(modal.exists()).toBe(true)
    const label = modal.find('label.form-label')
    expect(label.exists()).toBe(true)
  })

  it('should render the modal and  password field and iconButton password visibility', async () => {
    await wrapper.vm.$nextTick()
    const modal = wrapper.find('#editPassword')
    const input = modal.find('input[type="password"]')
    const iconButton = modal.find('.input-group-text')
    expect(modal.exists()).toBe(true)
    expect(input.exists()).toBe(true)
    expect(iconButton.exists()).toBe(true)
    expect(input.attributes('type')).toBe('password')
    await iconButton.trigger('click')
    expect(input.attributes('type')).toBe('text')
    await iconButton.trigger('click')
    expect(input.attributes('type')).toBe('password')
  })

  it('should close the modal when clicking the close button', async () => {
    await wrapper.vm.$nextTick()
    const openModalLink = wrapper.find('#openEditPasswordModalButton')
    expect(openModalLink.exists()).toBe(true)
    await openModalLink.trigger('click')
    await new Promise(resolve => setTimeout(resolve, 100))

    const modal2 = wrapper.find('#editPassword')
    expect(modal2.exists()).toBe(true)
    expect(modal2.classes('show')).toBe(true)

    const closeButton = wrapper.find('#closeEditPasswordModalButton')
    expect(closeButton.exists()).toBe(true)
    await closeButton.trigger('click')

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(modal2.classes('show')).toBe(false)
  })
})