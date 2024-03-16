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
import {getPlaces} from '../../../mocks/entities/PlaceMock'
import {usePlacesStore} from '@/services/stores/PlacesStore'
import {useClientsStore} from '@/services/stores/ClientsStore'
import {StrHelper} from '@/helpers/StrHelper'
import {useWpClientsStore} from "@/services/stores/WpClientStore";

describe('CreateService.vue', () => {
	let wrapper: VueWrapper<any>
	StrHelper.formatNumber = jest.fn((str: string) => str)
	
	beforeEach(async () => {
		const placesStore = usePlacesStore()
		const clientsStore = useClientsStore()
		const wpClient = useWpClientsStore()
		wrapper = mount(CreateService,
			{
				attachTo: document.body,
				global: {
					plugins: [router, i18n],
					provide: {
						'appName': 'test',
					},
				},
			})
		await router.isReady()
		clientsStore.clients = [ClientMock]
		placesStore.places = getPlaces()
		wpClient.clients = {
			3103794656: {
				id: '3103794656',
				alias: 'Principal',
				wpNotifications: false,
				chatBot: false,
				assistant: false,
			}
		}
	})
	it('an user can show inputs to add service', async () => {
		await nextTick()
		const field = wrapper.findAllComponents(Field)
		const form = wrapper.findComponent(Form)
		const input = wrapper.findAll('.form-control')
		const autoComplete = wrapper.findAllComponents(AutoComplete)
		expect(field.length).toBe(6)
		expect(form.exists()).toBeTruthy()
		expect(input.length).toBe(4)
		expect(autoComplete.length).toBe(2)
	})
	
	it('an user can select location from neighborhoods', async () => {
		const onSelected = jest.spyOn(wrapper.vm, 'locSelected')
		await nextTick()
		const input = wrapper.find('input[name="start_address"]')
		await input.setValue('mar')
		await input.trigger('keyup', {
			keyCode: 72,
		})
		const li = wrapper.findAll('li').at(0)
		await li?.trigger('click')
		
		expect(onSelected).toBeCalledTimes(1)
	})

	it('calls checkPhoneNoExists when phone number changes', async () => {
		await nextTick()
		const checkPhoneNoExists = jest.spyOn(wrapper.vm, 'checkPhoneNoExists')
		const phoneInput = wrapper.find('input[name="phone"]')
		await phoneInput.setValue('3101234567')
		await phoneInput.trigger('input')
		expect(checkPhoneNoExists).toBeCalledTimes(1)
	})
	
	it('an user can create a new service', async () => {
		ServiceRepository.create = jest.fn().mockResolvedValue('success')
		ClientRepository.create = jest.fn().mockResolvedValue(ClientMock)
		const swal = jest.spyOn(Swal, 'fire')
		await nextTick()
		const phone = '3100000000'
		const name = 'Name User'
		const comment = 'New comment to service'
		await wrapper.find('input[name="phone"]').setValue(phone)
		await wrapper.find('input[name="name"]').setValue(name)
		await wrapper.find('select[name="wp_client_id"]').setValue('3103794656')
		const input = wrapper.find('input[name="start_address"]')
		await input.setValue('mari')
		await input.trigger('keyup', {
			keyCode: 72,
		})
		const li = wrapper.findAll('li').at(0)
		await li?.trigger('click')
		await wrapper.find('input[name="comment"]').setValue(comment)
		const buttonSave = wrapper.find('button[type="submit"]')
		await buttonSave.trigger('click')
		await flushPromises()
		await waitForExpect(() => {
			expect(swal).toBeCalledWith({
				icon: 'success',
				position: 'top-right',
				title: i18n.global.t('common.messages.created'),
				showConfirmButton: false,
				text: undefined,
				timer: 3000,
				toast: true,
			})
		})
	})
	
	it('an user can not create a new service without select a place', async () => {
		ServiceRepository.create = jest.fn().mockResolvedValue('success')
		const swal = jest.spyOn(Swal, 'fire')
		await nextTick()
		const phone = '3100000000'
		const name = 'Name User'
		const comment = 'New comment to service'
		await wrapper.find('input[name="phone"]').setValue(phone)
		await wrapper.find('input[name="name"]').setValue(name)
		await wrapper.find('select[name="wp_client_id"]').setValue('3103794656')
		const input = wrapper.find('input[name="start_address"]')
		await input.setValue('mari')
		await wrapper.find('input[name="comment"]').setValue(comment)
		const buttonSave = wrapper.find('button[type="submit"]')
		await buttonSave.trigger('click')
		await waitForExpect(() => {
			expect(swal).toBeCalledWith({
				icon: 'error',
				position: 'top-right',
				title: i18n.global.t('common.messages.error'),
				showConfirmButton: false,
				text: i18n.global.t('services.messages.no_start_loc'),
				timer: 3000,
				toast: true,
			})
		})
	})
	
	it('an user can not create a new service without select a valid number', async () => {
		jest.clearAllMocks()
		ServiceRepository.create = jest.fn().mockResolvedValue('success')
		ClientRepository.create = jest.fn().mockResolvedValue(ClientMock)
		const swal = jest.spyOn(Swal, 'fire')
		await nextTick()
		const phone = '31000000'
		const name = 'Name User'
		const comment = 'New comment to service'
		await wrapper.find('input[name="phone"]').setValue(phone)
		await wrapper.find('input[name="name"]').setValue(name)
		await wrapper.find('input[name="start_address"]').setValue('mari')
		await wrapper.find('input[name="comment"]').setValue(comment)
		const buttonSave = wrapper.find('button[type="submit"]')
		await buttonSave.trigger('click')
		await waitForExpect(() => {
			expect(swal).not.toBeCalled()
			expect(wrapper.html()).toContain('phone must be at least 10 characters')
		})
	})
	
	it('create client when not exists', async () => {
		ServiceRepository.create = jest.fn().mockResolvedValue('success')
		ClientRepository.create = jest.fn().mockResolvedValue(ClientMock)
		const swal = jest.spyOn(Swal, 'fire')
		await nextTick()
		const phone = '3100000001'
		const name = 'Name User'
		await wrapper.find('input[name="phone"]').setValue(phone)
		await wrapper.find('select[name="wp_client_id"]').setValue('3103794656')
		await wrapper.find('input[name="name"]').setValue(name)
		const input = wrapper.find('input[name="start_address"]')
		await input.setValue('mari')
		await input.trigger('keyup', {
			keyCode: 72,
		})
		const li = wrapper.findAll('li').at(0)
		await li?.trigger('click')
		const buttonSave = wrapper.find('button[type="submit"]')
		await buttonSave.trigger('click')
		await flushPromises()
		
		await waitForExpect(() => {
			expect(swal).toBeCalledWith({
				icon: 'success',
				position: 'top-right',
				title: i18n.global.t('services.messages.new_client'),
				showConfirmButton: false,
				text: undefined,
				timer: 3000,
				toast: true,
			})
		})
	})
	
	it('should assign driver when click in button', async () => {
		
		const input = wrapper.find('input[name="phone"]')
		await input.setValue('31031')
		await input.trigger('keyup', {
			keyCode: 72,
		})
		await nextTick()
		await wrapper.find('li')?.trigger('click')
		await nextTick()
		expect(wrapper.html()).toContain(ClientMock.phone)
		expect(wrapper.vm.service.client_id).toBe(ClientMock.id)
		expect(wrapper.vm.service.name).toBe(ClientMock.name)
		expect(wrapper.vm.service.phone).toBe(ClientMock.phone)
	})
	
	it('show alert when error', async () => {
		ServiceRepository.create = jest.fn().mockRejectedValue(new Error('New Error'))
		ClientRepository.create = jest.fn().mockRejectedValue(new Error('New Error'))
		const swal = jest.spyOn(Swal, 'fire')
		await nextTick()

		await wrapper.find('select[name="wp_client_id"]').setValue('3103794656')
		await wrapper.find('input[name="phone"]').setValue('3100000000')
		await wrapper.find('input[name="name"]').setValue('Name User')
		const input = wrapper.find('input[name="start_address"]')
		await input.setValue('mari')
		await input.trigger('keyup', {
			keyCode: 72,
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
				toast: true,
			})
		})
	})
})