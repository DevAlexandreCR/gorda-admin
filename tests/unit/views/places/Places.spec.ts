import {mount, VueWrapper} from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import Places from '@/views/places/Places.vue'
import {nextTick} from 'vue'
import { Field, Form } from 'vee-validate'
import ToastService from "@/services/ToastService"
import waitForExpect from 'wait-for-expect'
import {getPlaces} from "../../../mocks/entities/PlaceMock"
import PlaceRepository from '@/repositories/PlaceRepository'
import {flushPromises} from '@vue/test-utils'
import {usePlacesStore} from '@/services/stores/PlacesStore'
import {GoogleMaps} from '@/services/maps/GoogleMaps'
import {google} from 'google-maps'
import Swal from 'sweetalert2'

describe('Places.vue', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    const placesStore = usePlacesStore()
    placesStore.places = getPlaces()
    GoogleMaps.prototype.addMarker = jest.fn()
    GoogleMaps.prototype.moveCamera = jest.fn()
    PlaceRepository.create = jest.fn().mockResolvedValue({})
    jest.mock('@/services/maps/GoogleMaps', () => {
      return {
        initMap: jest.fn()
      }
    })
  
    wrapper = mount(Places,
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

  afterEach(async () => {
    await flushPromises()
    jest.resetAllMocks()
  })
  it('A User can see the inputs', async () => {
    await nextTick()
    const field = wrapper.findAllComponents(Field)
    const form = wrapper.findComponent(Form)
    const input = wrapper.findAll('.form-control')
    const li = wrapper.findAll('li')
    expect(field.length).toBe(4)
    expect(form.exists()).toBeTruthy()
    expect(input.length).toBe(4)
    expect(li.length).toBe(3)
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

  it('A user can create a Places', async () => {
    const success = jest.spyOn(ToastService, 'toast')
    wrapper.vm.place.name = 'New Place'
    wrapper.vm.place.lat = 2.329894292
    wrapper.vm.place.lng = -76.432789423
    const button = wrapper.find('button[type="submit"]')
    await button.trigger('click')
    await waitForExpect(() => {
      expect(success).toHaveBeenCalledTimes(1)
    })
  })

  it('A user can search a place', async () => {
    const input = wrapper.find('input[type="search"]')
    await input.setValue('san')
    await waitForExpect(() => {
      expect(wrapper.vm.foundPlaces.length).toBe(1)
    })
  })

  it('A user can remove a place', async () => {
    PlaceRepository.remove = jest.fn().mockResolvedValue(null)
    const input = wrapper.findAll('.fa-trash')
    expect(input.length).toBe(3)
    await input.at(1)?.trigger('click')
    expect(wrapper.vm.foundPlaces.length).toBe(2)
  })
  
  it('it must toast when remove place fails', async () => {
    jest.restoreAllMocks()
    PlaceRepository.remove = jest.fn().mockRejectedValue(new Error('error when removing Place'))
    const swal = jest.spyOn(Swal,'fire')
    const input = wrapper.findAll('.fa-trash')
    expect(input.length).toBe(3)
    await input.at(1)?.trigger('click')
    expect(wrapper.vm.foundPlaces.length).toBe(3)
    await flushPromises()
    await waitForExpect(() => {
      expect(swal).toBeCalledWith({
        icon: 'error',
        title: wrapper.vm.$t('common.messages.error'),
        text: 'error when removing Place',
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000,
        toast: true
      })
    })
  })
  
  it('it must set place when onMapClick event emitted', async () => {
    wrapper.vm.onMapClick(new google.maps.LatLng(1.0, -2.0))
    await nextTick()
    expect(wrapper.vm.place.lat).toBe(1.0)
    expect(wrapper.vm.place.lng).toBe(-2.0)
  })

  it('it must return a error when createPlace fails', async () => {
    const error = jest.spyOn(ToastService, 'toast')
    PlaceRepository.create = jest.fn().mockRejectedValue(new Error('error when creating Place'))
    wrapper.vm.place.name = 'New Place'
    wrapper.vm.place.lat = 2.329894292
    wrapper.vm.place.lng = -76.432789423
    const button = wrapper.find('button[type="submit"]')
    await button.trigger('click')
    await waitForExpect(() => {
      expect(error).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.foundPlaces.length).toBe(3)
    })
  })
})