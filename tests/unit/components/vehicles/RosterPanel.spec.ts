import { flushPromises, mount } from '@vue/test-utils'
import router from '@/router'
import i18n from '@/plugins/i18n'
import RosterPanel from '@/components/vehicles/RosterPanel.vue'
import DriverVehicleRepository from '@/repositories/DriverVehicleRepository'
import ToastService from '@/services/ToastService'
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

  it('re-fetches the roster and shows a success toast when setSelectable resolves', async () => {
    DriverVehicleRepository.listForDriver = jest.fn().mockResolvedValue(links)
    DriverVehicleRepository.setSelectable = jest.fn().mockResolvedValue(undefined)
    const toast = jest.spyOn(ToastService, 'toast')

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

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.trigger('change')
    await flushPromises()

    expect(DriverVehicleRepository.setSelectable).toHaveBeenCalledWith('driver-1', 'vehicle-1', false)
    expect(DriverVehicleRepository.listForDriver).toHaveBeenCalledTimes(2)
    expect(toast).toHaveBeenCalledWith('success', i18n.global.t('common.messages.updated'))

    wrapper.unmount()
  })

  it('reverts the roster and shows an error toast when setSelectable rejects', async () => {
    DriverVehicleRepository.listForDriver = jest.fn().mockResolvedValue(links)
    DriverVehicleRepository.setSelectable = jest.fn().mockRejectedValue(new Error('boom'))
    const toast = jest.spyOn(ToastService, 'toast')

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

    const checkbox = wrapper.find('input[type="checkbox"]')
    await expect(checkbox.trigger('change')).resolves.not.toThrow()
    await flushPromises()

    expect(DriverVehicleRepository.setSelectable).toHaveBeenCalledWith('driver-1', 'vehicle-1', false)
    expect(DriverVehicleRepository.listForDriver).toHaveBeenCalledTimes(2)
    expect(toast).toHaveBeenCalledWith('error', i18n.global.t('common.messages.error'), 'boom')

    wrapper.unmount()
  })
})
