import {mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import { Field, Form } from 'vee-validate'
import i18n from '@/plugins/i18n'
import {nextTick} from 'vue'
import Create from '@/views/users/Create.vue'
import ToastService from "@/services/ToastService"
import UserRepository from '@/repositories/UserRepository'
import waitForExpect from 'wait-for-expect'
import User from "@/models/User";
import dayjs from 'dayjs'
import AuthService from '@/services/AuthService'
import StorageService from "@/services/StorageService";

describe('Create.vue', () => {
  AuthService.currentUser = new User()
    let wrapper: VueWrapper<any>
    beforeEach(async () => {
    UserRepository.create = jest.fn().mockResolvedValue('id-user')
    UserRepository.update = jest.fn().mockResolvedValue('id-user')
    StorageService.uploadFile = jest.fn().mockResolvedValue('http://localhost/image')
    StorageService.getStorageReference = jest.fn()
      wrapper = mount(Create,
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

  it('A User can see the inputs', async () => {
      await nextTick()
      const field = wrapper.findAllComponents(Field)
      const form = wrapper.findComponent(Form)
      const input = wrapper.findAll('.form-control')
      expect(field.length).toBe(5)
      expect(form.exists()).toBeTruthy()
      expect(input.length).toBe(5)
    })

  it('A user sees the Span when submit', async () => {
      await nextTick()
      const button = wrapper.find('button[type="submit"]')
      await button.trigger('click')
      await nextTick()
      const span = wrapper.findAll('.is-invalid')    
      await nextTick()
      expect(span.length).toBe(4)
    })
    it('user can assign role to user', async () => {
      const operator =  wrapper.find('#operator')
      await operator.trigger('click')
      const admin =  wrapper.find('#admin')
      await admin.trigger('click')
  
      expect(wrapper.vm.user.roles.operator).toBeTruthy()
      expect(wrapper.vm.user.roles.admin).toBeTruthy()
    })

  it('A user can enable or disable a user', async () => {
    const field = wrapper.find('#enableUser')
    await field.trigger('click')

    expect(wrapper.vm.user.enabled_at).toBe(dayjs().unix())
  })

  it('A user can create a User', async () => {
    const success = jest.spyOn(ToastService, 'toast')
    wrapper.vm.user.name = 'new User'
    wrapper.vm.user.email = 'email@gmail.com'
    wrapper.vm.user.phone ='30130103030'
    wrapper.vm.user.enabled_at = dayjs().unix()
    const file = new File([new Blob(['file contents'], {type: 'image/jpeg'})], 'image')
    wrapper.vm.image.push(file)
    await wrapper.vm.createUser(wrapper.vm.user, { resetForm: () => null })

    await waitForExpect(() => {
      expect(success).toHaveBeenCalledTimes(1)
    })
  })

  it('it must return a error when createUser fails', async () => {
    const error = jest.spyOn(ToastService, 'toast')
    UserRepository.create = jest.fn().mockRejectedValue(new Error('error when creating user'))
    
    await wrapper.vm.createUser(new User(), {})
    
    await waitForExpect(() => {
      expect(error).toHaveBeenCalledTimes(2)
    })
  })
})

