import {flushPromises, mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import {Field, Form} from 'vee-validate'
import waitForExpect from 'wait-for-expect'
import CreateService from '@/components/services/CreateService.vue'
import Swal from 'sweetalert2'
import {nextTick} from 'vue'
import ServiceRepository from '@/repositories/ServiceRepository'
import ClientRepository from '@/repositories/ClientRepository'
import ClientMock from '../../../mocks/entities/ClientMock'
import AutoComplete from '@/components/AutoComplete.vue'
import {getPlaces} from "../../../mocks/entities/PlaceMock"
import {usePlacesStore} from '@/services/stores/PlacesStore'
import {useClientsStore} from '@/services/stores/ClientsStore'

describe('CreateService.vue', () => {
  let wrapper: VueWrapper<any>
  
  beforeEach(async () => {
    const placesStore = usePlacesStore()
    const clientsStore = useClientsStore()
    wrapper = mount(CreateService,
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
    clientsStore.clients = [ClientMock]
    placesStore.places = getPlaces()
  })
  it('an user can show inputs to add service', async () => {
    await nextTick()
    const field = wrapper.findAllComponents(Field)
    const form = wrapper.findComponent(Form)
    const input = wrapper.findAll('.form-control')
    const autoComplete = wrapper.findAllComponents(AutoComplete)
    expect(field.length).toBe(5)
    expect(form.exists()).toBeTruthy()
    expect(input.length).toBe(4)
    expect(autoComplete.length).toBe(2)
  })

  it('an user can add another row to add service', async () => {
    await nextTick()
    const buttonAdd = wrapper.find('.btn-info')
    await buttonAdd.trigger('click')
    expect(wrapper.find('.btn-danger').exists()).toBeTruthy()
    expect(wrapper.findAllComponents(Field).length).toBe(10)
  })

  it('an user can not add more than 5 rows', async () => {
    await nextTick()
    const buttonAdd = wrapper.find('.btn-info')
    await buttonAdd.trigger('click')
    await buttonAdd.trigger('click')
    await buttonAdd.trigger('click')
    await buttonAdd.trigger('click')
    await buttonAdd.trigger('click')
    await buttonAdd.trigger('click')
    await buttonAdd.trigger('click')
    expect(wrapper.findAll('.btn-danger').length).toBe(4)
    expect(wrapper.findAllComponents(Field).length).toBe(25)
  })

  it('an user can remove a row to add service', async () => {
    await nextTick()
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
  
  it('an user can select location from neighborhoods', async () => {
    const onSelected = jest.spyOn(wrapper.vm, 'locSelected')
    await nextTick()
    const input = wrapper.find('input[name="start_address"]')
    await input.setValue('mar')
    await input.trigger('keyup', {
      keyCode: 72
    })
    const li = wrapper.findAll('li').at(0)
    await li?.trigger('click')
    
    expect(onSelected).toBeCalledTimes(1)
  })
  
  it('an user can create a new service', async () => {
    ServiceRepository.create = jest.fn().mockResolvedValue('success')
    const swal = jest.spyOn(Swal,'fire')
    await nextTick()
    const phone = '3100000000'
    const name = 'Name User'
    const comment = 'New comment to service'
    await wrapper.find('input[name="phone"]').setValue(phone)
    await wrapper.find('input[name="name"]').setValue(name)
    const input = wrapper.find('input[name="start_address"]')
    await input.setValue('mari')
    await input.trigger('keyup', {
      keyCode: 72
    })
    const li = wrapper.findAll('li').at(0)
    await li?.trigger('click')
    await wrapper.find('input[name="comment"]').setValue(comment)
    const buttonSave = wrapper.find('button[type="submit"]')
    await buttonSave.trigger('click')
    await waitForExpect(() => {
      expect(swal).toBeCalledWith({
        icon: 'success',
        position: 'top-right',
        title: i18n.global.t('common.messages.created'),
        showConfirmButton: false,
        text: undefined,
        timer: 3000,
        toast:true
      })
    })
    jest.resetAllMocks()
  })
  
  it('an user can not create a new service without select a place', async () => {
    const swal = jest.spyOn(Swal,'fire')
    await nextTick()
    const phone = '3100000000'
    const name = 'Name User'
    await wrapper.find('input[name="phone"]').setValue(phone)
    await wrapper.find('input[name="name"]').setValue(name)
    const input = wrapper.find('input[name="start_address"]')
    await input.setValue('mar')
    const inputComment = document.querySelector('input[name="comment"]') as HTMLInputElement
    await inputComment.focus()
    await wrapper.find('input[name="comment"]').trigger('keydown.enter')
    const buttonSave = wrapper.find('button[type="submit"]')
    await buttonSave.trigger('click')
    await flushPromises()
    await waitForExpect(() => {
      expect(swal).toBeCalledWith({
        icon: 'error',
        position: 'top-right',
        title: i18n.global.t('common.messages.error'),
        showConfirmButton: false,
        text: i18n.global.t('services.messages.no_start_loc'),
        timer: 3000,
        toast: true
      })
    })
    jest.resetAllMocks()
  })
  
  it('create client when not exists', async () => {
    ServiceRepository.create = jest.fn().mockResolvedValue('success')
    ClientRepository.create = jest.fn().mockResolvedValue(ClientMock)
    const swal = jest.spyOn(Swal,'fire')
    await nextTick()
    const phone = '3100000000'
    const name = 'Name User'
    const comment = 'New comment to service'
    await wrapper.find('input[name="phone"]').setValue(phone)
    await wrapper.find('input[name="name"]').setValue(name)
    const input = wrapper.find('input[name="start_address"]')
    await input.setValue('mar')
    await input.trigger('keyup', {
      keyCode: 72
    })
    const li = wrapper.findAll('li').at(0)
    await li?.trigger('click')
    await wrapper.find('input[name="comment"]').setValue(comment)
    const buttonSave = wrapper.find('button[type="submit"]')
    await buttonSave.trigger('click')
    
    await waitForExpect(() => {
      expect(swal).toBeCalledWith({
        icon: 'success',
        position: 'top-right',
        title: i18n.global.t('services.messages.new_client'),
        showConfirmButton: false,
        text: undefined,
        timer: 3000,
        toast:true
      })
    })
    jest.resetAllMocks()
  })

  it('should assign driver when click in button', async () => {

    const input = wrapper.find('input[name="phone"]')
    await input.setValue('31031')
    await input.trigger('keyup', {
      keyCode: 72
    })
    await nextTick()
    await wrapper.find('li').trigger('click')
    await nextTick()
    expect(wrapper.html()).toContain(ClientMock.phone)
    expect(wrapper.vm.services[0].client_id).toBe(ClientMock.id)
    expect(wrapper.vm.services[0].name).toBe(ClientMock.name)
    expect(wrapper.vm.services[0].phone).toBe(ClientMock.phone)
  })

  it('show alert when error', async () => {
    ServiceRepository.create = jest.fn().mockRejectedValue(new Error('New Error'))
    ClientRepository.create = jest.fn().mockRejectedValue(new Error('New Error'))
    const swal = jest.spyOn(Swal,'fire')
    await nextTick()

    await wrapper.find('input[name="phone"]').setValue('3100000000')
    await wrapper.find('input[name="name"]').setValue('Name User')
    const input = wrapper.find('input[name="start_address"]')
    await input.setValue('mar')
    await input.trigger('keyup', {
      keyCode: 72
    })
    const li = wrapper.findAll('li').at(0)
    await li?.trigger('click')
    await wrapper.find('input[name="comment"]').setValue('New comment to service')
    const buttonSave = wrapper.find('button[type="submit"]')
    await buttonSave.trigger('click')

    await waitForExpect(() => {
      expect(swal).toBeCalledWith({
        icon: 'error',
        title: i18n.global.t('common.messages.error'),
        showConfirmButton: false,
        text: 'New Error',
        position: 'top-right',
        timer: 3000,
        toast: true
      })
    })
  })
})