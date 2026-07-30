import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import DriverMap from '@/components/DriverMap.vue'
import Map from '@/components/maps/Map.vue'
import { useDriversStore } from '@/services/stores/DriversStore'
import DriverRepository from '@/repositories/DriverRepository'
import i18n from '@/plugins/i18n'
import { PlaceInterface } from '@/types/PlaceInterface'

function place(overrides: Partial<PlaceInterface> = {}): PlaceInterface {
  return {
    id: 'driver-1',
    key: 'driver-1',
    name: 'ABC123',
    lat: 1,
    lng: 2,
    ...overrides,
  }
}

describe('DriverMap.vue', () => {
  let wrapper: VueWrapper<any>

  function mountDriverMap(): VueWrapper<any> {
    return mount(DriverMap, {
      global: {
        plugins: [i18n],
        stubs: {
          // Only Map.vue is stubbed — it already reconciles markers by key from `places`
          // (tested separately in Map.spec.ts); the assertion target here is the array
          // DriverMap's computed hands it, not Google Maps behavior.
          Map: true,
        },
      },
    })
  }

  function mapPlaces(): PlaceInterface[] {
    return wrapper.findComponent(Map).props('places')
  }

  beforeEach(() => {
    // tests/testSetup.ts installs one shared Pinia instance globally (config.global.plugins)
    // and re-activates it before every test — that is the SAME instance DriverMap's own
    // useDriversStore() resolves to once mounted. Calling setActivePinia(createPinia()) here
    // would create a second, disconnected instance that the mounted component never sees, so
    // instead we reuse the shared store and reset its state explicitly.
    useDriversStore().$reset()
    // DriverMap mounts/unmounts the store's RTDB listener via onBeforeMount/onBeforeUnmount.
    // These tests exercise DriverMap's own computed/reconciliation logic by mutating
    // connectedDrivers directly (as DriversStore.spec.ts already covers the listener wiring
    // itself), so the RTDB calls are stubbed out here rather than driven for real.
    jest.spyOn(DriverRepository, 'onlineDriverListener').mockImplementation(() => undefined)
    jest.spyOn(DriverRepository, 'removeOnlineDriverListener').mockImplementation(() => undefined)
  })

  afterEach(() => {
    wrapper?.unmount()
    jest.restoreAllMocks()
  })

  it('reflects an added driver, a location move, and a removal in the computed places array', async () => {
    const store = useDriversStore()
    wrapper = mountDriverMap()
    await nextTick()

    expect(mapPlaces()).toHaveLength(0)

    store.connectedDrivers.push(place({ lat: 1, lng: 2 }))
    await nextTick()
    expect(mapPlaces()).toEqual([place({ lat: 1, lng: 2 })])

    // Move: same key, new coordinates — reflected without add/remove churn.
    const index = store.connectedDrivers.findIndex((driver) => driver.key === 'driver-1')
    store.connectedDrivers[index] = place({ lat: 9, lng: 9 })
    await nextTick()
    expect(mapPlaces()).toEqual([place({ lat: 9, lng: 9 })])

    store.connectedDrivers.splice(0, 1)
    await nextTick()
    expect(mapPlaces()).toHaveLength(0)
  })

  it('loses neither event when an add and a remove land in the same reactive flush', async () => {
    const store = useDriversStore()
    store.connectedDrivers.push(place({ key: 'driver-1', name: 'ABC123' }))
    wrapper = mountDriverMap()
    await nextTick()
    expect(mapPlaces().map((p) => p.key)).toEqual(['driver-1'])

    // Both mutations happen synchronously, before Vue's next render flush — this is the
    // "add+remove coalesce in one watcher tick" scenario the old length-comparison
    // watcher lost. A computed always re-derives the full array, so nothing is dropped.
    store.connectedDrivers.splice(0, 1)
    store.connectedDrivers.push(place({ key: 'driver-2', name: 'XYZ987' }))
    await nextTick()

    const keys = mapPlaces().map((p) => p.key)
    expect(keys).toEqual(['driver-2'])
    expect(keys).not.toContain('driver-1')
  })

  it('narrows on search and yields every connected driver exactly once when cleared', async () => {
    const store = useDriversStore()
    store.connectedDrivers.push(
      place({ key: 'driver-1', name: 'ABC123' }),
      place({ key: 'driver-2', name: 'XYZ987' }),
      place({ key: 'driver-3', name: 'ABZ111' })
    )
    wrapper = mountDriverMap()
    await nextTick()
    expect(mapPlaces()).toHaveLength(3)

    const input = wrapper.find('input[type="search"]')
    await input.setValue('ABC')
    await nextTick()

    const filtered = mapPlaces()
    expect(filtered).toHaveLength(1)
    expect(filtered[0].key).toBe('driver-1')

    await input.setValue('')
    await nextTick()

    const cleared = mapPlaces()
    expect(cleared).toHaveLength(3)
    const uniqueKeys = new Set(cleared.map((p) => p.key))
    expect(uniqueKeys.size).toBe(3)
    expect([...uniqueKeys].sort()).toEqual(['driver-1', 'driver-2', 'driver-3'])
  })
})
