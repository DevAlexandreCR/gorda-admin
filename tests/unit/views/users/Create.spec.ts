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

describe('Create.vue', () => {
  AuthService.currentUser = new User()
    let wrapper: VueWrapper<any>
    beforeEach(async () => {
    UserRepository.create = jest.fn().mockResolvedValue('id-user')
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
        expect(field.length).toBe(4)
        expect(form.exists()).toBeTruthy()
        expect(input.length).toBe(4)
      })

    it('A user sees the Span when submit', async () => {
        await nextTick()
        const button = wrapper.find('button[type="submit"]')
        await button.trigger('click')
        await nextTick()
        const span = wrapper.findAll('.is-invalid')    
        await nextTick()
        expect(span.length).toBe(3)
      })

      it('A user can create a Users', async () => {
        await nextTick()
    })

    it('user can enable or disable user', async () => {
      const enable =  wrapper.find('input[name="enable"]')
      await enable.trigger('click')
    })
    it('user can assign role to user', async () => {
      await nextTick()

    })
})

