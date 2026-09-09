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

  it('changing one of three places calls updateMarker exactly once', async () => {
    const threePlaces = [
      { id: 'driver-1', key: 'driver-1', name: 'A', lat: 1, lng: 1 },
      { id: 'driver-2', key: 'driver-2', name: 'B', lat: 2, lng: 2 },
      { id: 'driver-3', key: 'driver-3', name: 'C', lat: 3, lng: 3 },
    ]
    await wrapper.setProps({ places: threePlaces })
    await flushPromises()
    await nextTick()

    updateMarkerSpy.mockClear()
    addMarkerSpy.mockClear()
    removeMarkerSpy.mockClear()

    await wrapper.setProps({
      places: [
        threePlaces[0],
        { ...threePlaces[1], name: 'B-changed' },
        threePlaces[2],
      ],
    })
    await flushPromises()
    await nextTick()

    expect(updateMarkerSpy).toHaveBeenCalledTimes(1)
    expect(updateMarkerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'driver-2', name: 'B-changed' }),
    )
    expect(addMarkerSpy).not.toHaveBeenCalled()
    expect(removeMarkerSpy).not.toHaveBeenCalled()
  })

  it('removing one key calls removeMarker once', async () => {
    const threePlaces = [
      { id: 'driver-1', key: 'driver-1', name: 'A', lat: 1, lng: 1 },
      { id: 'driver-2', key: 'driver-2', name: 'B', lat: 2, lng: 2 },
      { id: 'driver-3', key: 'driver-3', name: 'C', lat: 3, lng: 3 },
    ]
    await wrapper.setProps({ places: threePlaces })
    await flushPromises()
    await nextTick()

    updateMarkerSpy.mockClear()
    addMarkerSpy.mockClear()
    removeMarkerSpy.mockClear()

    await wrapper.setProps({
      places: [threePlaces[0], threePlaces[2]],
    })
    await flushPromises()
    await nextTick()

    expect(removeMarkerSpy).toHaveBeenCalledTimes(1)
    expect(removeMarkerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'driver-2' }),
    )
    expect(addMarkerSpy).not.toHaveBeenCalled()
  })

  it('resize is not called on the visible prop falling or flat edge', async () => {
    const resizeSpy = jest.spyOn(GoogleMaps.prototype, 'resize').mockImplementation(() => undefined)

    await wrapper.setProps({ visible: false })
    await flushPromises()
    await nextTick()

    expect(resizeSpy).not.toHaveBeenCalled()
  })

  it('calls resize on the rising edge of visible after the container has layout', async () => {
    const resizeSpy = jest.spyOn(GoogleMaps.prototype, 'resize').mockImplementation(() => undefined)

    await wrapper.setProps({ visible: false })
    await flushPromises()
    await nextTick()
    resizeSpy.mockClear()

    await wrapper.setProps({ visible: true })
    await flushPromises()
    await nextTick()

    expect(resizeSpy).toHaveBeenCalledTimes(1)
  })
})
