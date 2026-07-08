import { ref } from 'vue'
import DriverVehicleRepository from '@/repositories/DriverVehicleRepository'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import { Vehicle } from '@/types/Vehicle'

export function useSelectableToggle() {
  const togglingDriverId = ref<string | null>(null)

  async function toggle(vehicle: Vehicle | null, driverId: string, newValue: boolean): Promise<void> {
    if (!vehicle) return

    const isActive = vehicle.currently_driven_by?.id === driverId
    if (!newValue && isActive) {
      const driverName = vehicle.currently_driven_by?.name ?? driverId
      const confirmed = window.confirm(
        i18n.global.t('vehicles.messages.disable_selectable_confirm', { name: driverName })
      )
      if (!confirmed) return
    }

    togglingDriverId.value = driverId
    try {
      await DriverVehicleRepository.setSelectable(driverId, vehicle.id, newValue)
      // Update local state
      const entry = vehicle.linked_drivers?.find(e => e.driver_id === driverId)
      if (entry) entry.selectable = newValue
      ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
    } catch (e: unknown) {
      const err = e as { message?: string }
      ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), err?.message)
    } finally {
      togglingDriverId.value = null
    }
  }

  return { togglingDriverId, toggle }
}
