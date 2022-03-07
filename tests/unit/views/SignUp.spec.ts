import {mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import AuthService from '@/services/AuthService'
import UserRepository from '@/repositories/UserRepository'
import {ErrorMessage, Field, Form} from 'vee-validate'
import {flushPromises} from '@vue/test-utils'
import waitForExpect from 'wait-for-expect'
import Swal from 'sweetalert2'
import SignUp from '@/views/SignUp.vue'
import StorageService from '@/services/StorageService'
import UserInterface from '../../mocks/entities/UserMock'

UserRepository.getUser = jest.fn().mockResolvedValue(UserInterface)
UserRepository.update = jest.fn().mockResolvedValue(UserInterface)

describe('SignUp.vue', () => {
  let wrapper: VueWrapper<any>
  const div = document.createElement('div')
  div.id = 'root'
  document.body.appendChild(div)
  beforeEach(async () => {
    wrapper = mount(SignUp,
      {
        attachTo: '#root',
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
  it('an user can show input after mounted', async () => {
    await wrapper.vm.$nextTick()
    const field = wrapper.findComponent(Field)
    const form = wrapper.findComponent(Form)
    const error = wrapper.findComponent(ErrorMessage)
    expect(field.exists()).toBeTruthy()
    expect(form.exists()).toBeTruthy()
    expect(error.exists()).toBeTruthy()
  })

  it('an guest user can signup', async () => {
    const swal = spyOn(Swal,'fire')
    AuthService.createUser = jest.fn().mockResolvedValue({
      user: { uuid: '1'}
    })
    StorageService.getDownloadUrl = jest.fn().mockResolvedValue('http://localhost')
    await wrapper.vm.$nextTick()
    const inputName = wrapper.find('#name')
    await inputName.setValue(UserInterface.name)
    const inputEmail = wrapper.find('#email')
    await inputEmail.setValue(UserInterface.email)
    const inputPhone = wrapper.find('#phone')
    await inputPhone.setValue(UserInterface.phone)
    const inputPass = wrapper.find('#pass')
    await inputPass.setValue('1235678')
    const inputConfirm = wrapper.find('#confirm_pass')
    await inputConfirm.setValue('1235678')
    const button =  wrapper.find('button[type="submit"]')
    await button.trigger('click')

    await flushPromises()
    await waitForExpect(() => {
      expect(wrapper.vm.user.phone).toStrictEqual(UserInterface.phone)
      expect(wrapper.vm.user.name).toStrictEqual(UserInterface.name)
      expect(wrapper.vm.user.email).toStrictEqual(UserInterface.email)
      expect(swal).toBeCalledWith({
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
        title: wrapper.vm.$t('common.messages.created')
      })
    });
  })

  it('show error when create function fails', async () => {
    const swal = spyOn(Swal,'fire')
    UserRepository.create = jest.fn().mockRejectedValue(new Error('New Error while create'))
    wrapper.vm.createUser()
    await flushPromises()
    await waitForExpect(() => {
      expect(swal).toBeCalledWith({
        icon: 'error',
        title: wrapper.vm.$t('common.messages.error'),
        text: 'New Error while create',
      })
    });
  })
})