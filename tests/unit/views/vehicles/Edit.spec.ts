import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import i18n from '@/plugins/i18n'
import router from '@/router'
import Edit from '@/views/vehicles/Edit.vue'
import VehicleRepository from '@/repositories/VehicleRepository'
import DateHelper from '@/helpers/DateHelper'
import { Vehicle } from '@/types/Vehicle'

jest.mock('bootstrap', () => ({
  Modal: {
    getOrCreateInstance: jest.fn(() => ({
      hide: jest.fn(),
      show: jest.fn(),
    })),
  },
}))

const buildVehicle = (overrides: Partial<Vehicle> = {}): Vehicle => ({
  id: 'vehicle-1',
  plate: 'ABC123',
  brand: 'Mazda',
  model: '3',
  color: {
    name: 'Blue',
    hex: '#0000ff',
  },
  photoUrl: null,
  soat_exp: '2026-07-11T00:00:00.000Z',
  tec_exp: '2026-08-15T00:00:00.000Z',
  enabled: false,
  currently_driven_by: null,
  linked_drivers: [],
  ...overrides,
})

describe('vehicles/Edit.vue', () => {
  let wrapper: VueWrapper<any>

  async function mountView(vehicleOverrides: Partial<Vehicle> = {}): Promise<VueWrapper<any>> {
    const vehicle = buildVehicle(vehicleOverrides)
    VehicleRepository.findById = jest.fn().mockResolvedValue(vehicle)
    VehicleRepository.update = jest.fn().mockResolvedValue({
      ...vehicle,
      ...vehicleOverrides,
    })
    VehicleRepository.setEnabled = jest.fn().mockResolvedValue(undefined)

    await router.push({ name: 'vehicles.edit', params: { id: vehicle.id } }).catch(() => undefined)
    wrapper = mount(Edit, {
      attachTo: '#root',
      global: {
        plugins: [router, i18n],
        stubs: {
          ImageLoader: true,
        },
      },
    })
    await router.isReady()
    await flushPromises()
    return wrapper
  }

  afterEach(async () => {
    wrapper?.unmount()
    await flushPromises()
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it('normalizes API timestamps for date inputs and returns empty strings for empty or invalid helper values', async () => {
    expect(DateHelper.normalizeDateInput(null)).toBe('')
    expect(DateHelper.normalizeDateInput('invalid-date')).toBe('')
    expect(DateHelper.normalizeDateInput('2026-07-11T00:00:00.000Z')).toBe('2026-07-11')

    await mountView()

    const dateInputs = wrapper.findAll('input[type="date"]')
    expect(dateInputs).toHaveLength(2)
    expect((dateInputs[0].element as HTMLInputElement).value).toBe('2026-07-11')
    expect((dateInputs[1].element as HTMLInputElement).value).toBe('2026-08-15')
  })

  it('updates the vehicle before enabling it on submit', async () => {
    await mountView({
      soat_exp: null,
      tec_exp: null,
      enabled: false,
    })

    const callOrder: string[] = []
    ;(VehicleRepository.update as jest.Mock).mockImplementation(async () => {
      callOrder.push('update')
      return buildVehicle({
        soat_exp: '2026-09-01',
        tec_exp: '2026-10-01',
        enabled: false,
      })
    })
    ;(VehicleRepository.setEnabled as jest.Mock).mockImplementation(async () => {
      callOrder.push('setEnabled')
    })

    const dateInputs = wrapper.findAll('input[type="date"]')
    await dateInputs[0].setValue('2026-09-01')
    await dateInputs[1].setValue('2026-10-01')
    await wrapper.find('#vehicleEnabled').setValue(true)

    const pushSpy = jest.spyOn(router, 'push').mockResolvedValue(undefined)

    await wrapper.find('.card-footer button.btn.btn-info').trigger('click')
    await flushPromises()

    expect(VehicleRepository.update).toHaveBeenCalledWith('vehicle-1', expect.objectContaining({
      soat_exp: '2026-09-01',
      tec_exp: '2026-10-01',
    }))
    expect(VehicleRepository.setEnabled).toHaveBeenCalledWith('vehicle-1', true)
    expect(callOrder).toEqual(['update', 'setEnabled'])
    expect(pushSpy).toHaveBeenCalledWith({ name: 'vehicles.detail', params: { id: 'vehicle-1' } })
  })
})
