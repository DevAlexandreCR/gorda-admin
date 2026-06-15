import { flushPromises, mount } from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import RosterPanel from '@/components/vehicles/RosterPanel.vue'
import DriverVehicleRepository from '@/repositories/DriverVehicleRepository'
import type { DriverVehicleLink } from '@/types/Vehicle'

describe('vehicles/RosterPanel.vue', () => {
  const links: DriverVehicleLink[] = [
    {
      id: 'link-1',
      driver_id: 'driver-1',
      vehicle_id: 'vehicle-1',
      selectable: true,
      added_at: '2026-06-15T00:00:00.000Z',
      updated_at: '2026-06-15T00:00:00.000Z',
      is_selected: true,
      is_active: true,
      vehicle: {
        id: 'vehicle-1',
        plate: 'CXD458',
        brand: 'Chevrolet',
        model: 'Aveo',
        color: null,
        photoUrl: null,
        soat_exp: null,
        tec_exp: null,
        enabled: true,
      },
    },
  ]

  it('links the vehicle plate to the vehicle detail view', async () => {
    DriverVehicleRepository.listForDriver = jest.fn().mockResolvedValue(links)

    await router.push({ name: 'drivers.edit', params: { id: 'driver-1' } }).catch(() => undefined)

    const wrapper = mount(RosterPanel, {
      props: {
        driverId: 'driver-1',
      },
      global: {
        plugins: [router, i18n],
        stubs: {
          VehicleLookupCard: true,
        },
      },
    })

    await router.isReady()
    await flushPromises()

    const plateLink = wrapper.find('a')
    expect(plateLink.exists()).toBe(true)
    expect(plateLink.text()).toContain('CXD458')
    expect(plateLink.attributes('href')).toContain('/dashboard/vehicles/vehicle-1')

    wrapper.unmount()
  })
})
