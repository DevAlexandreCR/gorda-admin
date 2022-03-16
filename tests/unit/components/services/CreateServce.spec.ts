import {mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import {ErrorMessage, Field, Form} from 'vee-validate'
import waitForExpect from 'wait-for-expect'
import CreateService from '@/components/services/CreateService.vue'
import Swal from 'sweetalert2'
import ServiceRepository from '@/repositories/ServiceRepository'
import AutoComplete from "@/components/AutoComplete.vue";

describe('CreateService.vue', () => {
  let wrapper: VueWrapper<any>
  const div = document.createElement('div')
  div.id = 'root'
  document.body.appendChild(div)
  beforeEach(async () => {
    wrapper = mount(CreateService,
      {
        attachTo: '#root',
        components: {
          Form,
          Field,
          ErrorMessage,
          AutoComplete
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
  it('an user can show inputs to add service', async () => {
    await wrapper.vm.$nextTick()
    const field = wrapper.findAllComponents(Field)
    const form = wrapper.findComponent(Form)
    const error = wrapper.findAllComponents(ErrorMessage)
    expect(field.length).toBe(4)
    expect(form.exists()).toBeTruthy()
    expect(error.length).toBe(4)
  })

  it('an user can add another row to add service', async () => {
    await wrapper.vm.$nextTick()
    const buttonAdd = wrapper.find('.btn-info')
    await buttonAdd.trigger('click')
    expect(wrapper.find('.btn-danger').exists()).toBeTruthy()
    expect(wrapper.findAllComponents(Field).length).toBe(8)
  })

  it('an user can not add more than 5 rows', async () => {
    await wrapper.vm.$nextTick()
    const buttonAdd = wrapper.find('.btn-info')
    await buttonAdd.trigger('click')
    await buttonAdd.trigger('click')
    await buttonAdd.trigger('click')
    await buttonAdd.trigger('click')
    await buttonAdd.trigger('click')
    await buttonAdd.trigger('click')
    await buttonAdd.trigger('click')
    expect(wrapper.findAll('.btn-danger').length).toBe(4)
    expect(wrapper.findAllComponents(Field).length).toBe(20)
  })

  it('an user can remove a row to add service', async () => {
    await wrapper.vm.$nextTick()
    const buttonAdd = wrapper.find('.btn-info')
    await buttonAdd.trigger('click')
    await buttonAdd.trigger('click')
    await buttonAdd.trigger('click')
    await wrapper.find('#row-3 input[name="comment"]').setValue('new Comment row 3')
    await wrapper.find('#row-2 input[name="comment"]').setValue('new Comment row 2')
    const buttonRemove = wrapper.find('#button-2')
    await buttonRemove.trigger('click')

    expect(wrapper.vm.services[2].comment).toBe('new Comment row 3')
    expect(wrapper.find('#row-3 input[name="comment"]').exists()).toBeFalsy()
    expect(wrapper.vm.services[3]).toBe(undefined)
  })

  it('an user can create a new service', async () => {
    ServiceRepository.create = jest.fn().mockResolvedValue('success')
    const swal = jest.spyOn(Swal,'fire')
    await wrapper.vm.$nextTick()
    const phone = '3100000000'
    const name = 'Name User'
    const address = 'CR 1 1-1'
    const comment = 'New comment to service'
    await wrapper.find('input[name="phone"]').setValue(phone)
    await wrapper.find('input[name="name"]').setValue(name)
    await wrapper.find('input[name="start_address"]').setValue(address)
    await wrapper.find('input[name="comment"]').setValue(comment)
    const buttonSave = wrapper.find('button[type="submit"]')
    await buttonSave.trigger('click')

    await waitForExpect(() => {
      expect(swal).toBeCalledWith({
        icon: 'success',
        position: 'top-right',
        title: wrapper.vm.$t('common.messages.created'),
        showConfirmButton: false,
        text: undefined,
        timer: 1500,
        toast:true
      })
    })
    jest.resetAllMocks()
  })

  it('show alert when error', async () => {
    ServiceRepository.create = jest.fn().mockRejectedValue(new Error('New Error'))
    const swal = jest.spyOn(Swal,'fire')
    await wrapper.vm.$nextTick()

    await wrapper.find('input[name="phone"]').setValue('3100000000')
    await wrapper.find('input[name="name"]').setValue('Name User')
    await wrapper.find('input[name="start_address"]').setValue('CR 1 1-1')
    await wrapper.find('input[name="comment"]').setValue('New comment to service')
    const buttonSave = wrapper.find('button[type="submit"]')
    await buttonSave.trigger('click')

    await waitForExpect(() => {
      expect(swal).toBeCalledWith({
        icon: 'error',
        title: wrapper.vm.$t('common.messages.error'),
        showConfirmButton: false,
        text: 'New Error',
        position: 'top-right',
        timer: 1500,
        toast: true
      })
    })
  })
})