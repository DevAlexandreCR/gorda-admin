import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import Map from '@/components/maps/Map.vue'
import { GoogleMaps } from '@/services/maps/GoogleMaps'
import { useSettingsStore } from '@/services/stores/SettingsStore'

describe('Map.vue', () => {
  let wrapper: VueWrapper<any>
  let initMapSpy: jest.SpyInstance
  let setDarkModeSpy: jest.SpyInstance
  let addMarkerSpy: jest.SpyInstance
  let updateMarkerSpy: jest.SpyInstance
  let removeMarkerSpy: jest.SpyInstance
  let moveCameraSpy: jest.SpyInstance
  let addListenerSpy: jest.SpyInstance
  let printRouteSpy: jest.SpyInstance

  beforeEach(async () => {
    const settingsStore = useSettingsStore()
    settingsStore.branchSelected = {
      id: 'branch-1',
      calling_code: '57',
      country: 'CO',
      currency_code: 'COP',
      city: {
        id: 'city-1',
        name: 'Popayan',
        location: {
          lat: 2.431681,
          lng: -76.601789,
        },
      } as any,
    }

    initMapSpy = jest.spyOn(GoogleMaps.prototype, 'initMap').mockResolvedValue({} as any)
    setDarkModeSpy = jest.spyOn(GoogleMaps.prototype, 'setDarkMode').mockImplementation(() => undefined)
    addMarkerSpy = jest.spyOn(GoogleMaps.prototype, 'addMarker').mockImplementation(() => undefined)
    updateMarkerSpy = jest.spyOn(GoogleMaps.prototype, 'updateMarker').mockImplementation(() => undefined)
    removeMarkerSpy = jest.spyOn(GoogleMaps.prototype, 'removeMarker').mockImplementation(() => undefined)
    moveCameraSpy = jest.spyOn(GoogleMaps.prototype, 'moveCamera').mockImplementation(() => undefined)
    addListenerSpy = jest.spyOn(GoogleMaps.prototype, 'addListener').mockImplementation(() => undefined)
    printRouteSpy = jest.spyOn(GoogleMaps.prototype, 'printRoute').mockImplementation(() => undefined)

    wrapper = mount(Map, {
      attachTo: '#root',
      props: {
        places: [
          {
            id: 'driver-1',
            key: 'driver-1',
            name: 'fallback',
            lat: 2.431681,
            lng: -76.601789,
          },
        ],
      },
    })
    await flushPromises()
    await nextTick()
  })

  afterEach(async () => {
    jest.restoreAllMocks()
    await flushPromises()
  })

  it('A user can see the map', async () => {
    const div = wrapper.find('div[id="map"]')
    expect(div.exists()).toBeTruthy()
    expect(initMapSpy).toHaveBeenCalledWith('map')
    expect(addMarkerSpy).toHaveBeenCalledWith({
      id: 'driver-1',
      key: 'driver-1',
      name: 'fallback',
      lat: 2.431681,
      lng: -76.601789,
    })
    expect(moveCameraSpy).toHaveBeenCalledWith({
      id: 'driver-1',
      key: 'driver-1',
      name: 'fallback',
      lat: 2.431681,
      lng: -76.601789,
    })
    expect(setDarkModeSpy).toHaveBeenCalled()
    expect(addListenerSpy).not.toHaveBeenCalled()
    expect(printRouteSpy).not.toHaveBeenCalled()
  })

  it('updates an existing marker when the place key is stable but the label changes', async () => {
    updateMarkerSpy.mockClear()
    addMarkerSpy.mockClear()
    removeMarkerSpy.mockClear()

    await wrapper.setProps({
      places: [
        {
          id: 'driver-1',
          key: 'driver-1',
          name: 'ABC123',
          lat: 2.5,
          lng: -76.5,
        },
      ],
    })
    await flushPromises()
    await nextTick()

    expect(updateMarkerSpy).toHaveBeenCalledWith({
      id: 'driver-1',
      key: 'driver-1',
      name: 'ABC123',
      lat: 2.5,
      lng: -76.5,
    })
    expect(addMarkerSpy).not.toHaveBeenCalled()
    expect(removeMarkerSpy).not.toHaveBeenCalled()
  })

  it('removes markers by key when a place disappears', async () => {
    removeMarkerSpy.mockClear()

    await wrapper.setProps({
      places: [],
    })
    await flushPromises()
    await nextTick()

    expect(removeMarkerSpy).toHaveBeenCalledWith({
      id: 'driver-1',
      key: 'driver-1',
      name: 'fallback',
      lat: 2.431681,
      lng: -76.601789,
    })
  })
})
