<template>
  <div class="roster-panel">
    <div class="card-header text-center text-capitalize">
      <h6>{{ $t('drivers.forms.create_vehicle') }}</h6>
    </div>

    <div v-if="links.length === 0 && !showLookup" class="text-muted small mt-2">
      {{ $t('vehicles.messages.no_linked_drivers') }}
    </div>

    <ul v-if="links.length > 0" class="list-group list-group-flush mt-2">
      <li
        v-for="link in links"
        :key="link.vehicle_id"
        class="list-group-item d-flex align-items-center gap-2 px-0 py-1"
      >
        <input
          type="radio"
          :name="`selected-vehicle-${driverId}`"
          :checked="link.is_selected"
          @change="onSelectVehicle(link.vehicle_id)"
          class="form-check-input mt-0"
          title="Set as selected vehicle"
        />
        <span class="flex-grow-1">
          <strong>{{ link.vehicle.plate }}</strong>
          <span v-if="link.vehicle.brand" class="text-muted small ms-1">{{ link.vehicle.brand }}</span>
        </span>
        <div class="form-check form-switch mb-0">
          <input
            class="form-check-input"
            type="checkbox"
            :id="`selectable-${link.vehicle_id}`"
            :checked="link.selectable"
            @change="onToggleSelectable(link.vehicle_id, !link.selectable)"
          />
          <label class="form-check-label small" :for="`selectable-${link.vehicle_id}`">
            {{ $t('vehicles.fields.selectable') }}
          </label>
        </div>
        <span v-if="link.is_active" class="badge bg-success ms-1">
          {{ $t('common.fields.enabled') }}
        </span>
      </li>
    </ul>

    <div class="mt-2">
      <button
        type="button"
        class="btn btn-sm btn-outline-primary"
        @click="showLookup = !showLookup"
      >
        + {{ $t('vehicles.actions.add_vehicle') }}
      </button>
    </div>

    <div v-if="showLookup" class="mt-2 border rounded p-2">
      <VehicleLookupCard @select="onVehicleSelected" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VehicleLookupCard from '@/components/vehicles/VehicleLookupCard.vue'
import type { VehiclePayload } from '@/types/VehiclePayload'
import DriverVehicleRepository from '@/repositories/DriverVehicleRepository'
import { DriverVehicleLink } from '@/types/Vehicle'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'

const props = defineProps<{
  driverId: string
}>()

const links = ref<DriverVehicleLink[]>([])
const showLookup = ref(false)

async function fetchLinks(): Promise<void> {
  try {
    links.value = await DriverVehicleRepository.listForDriver(props.driverId)
  } catch (e: unknown) {
    const err = e as Error
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), err.message)
  }
}

async function onToggleSelectable(vehicleId: string, selectable: boolean): Promise<void> {
  try {
    await DriverVehicleRepository.setSelectable(props.driverId, vehicleId, selectable)
    await fetchLinks()
  } catch (e: unknown) {
    const err = e as Error
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), err.message)
  }
}

async function onSelectVehicle(vehicleId: string): Promise<void> {
  try {
    await DriverVehicleRepository.setSelected(props.driverId, vehicleId)
    await fetchLinks()
  } catch (e: unknown) {
    const err = e as Error
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), err.message)
  }
}

async function onVehicleSelected(payload: VehiclePayload): Promise<void> {
  try {
    await DriverVehicleRepository.link(props.driverId, { vehicleId: payload.vehicleId })
    showLookup.value = false
    await fetchLinks()
  } catch (e: unknown) {
    const axiosErr = e as { response?: { status?: number; data?: { error?: string } } }
    if (axiosErr?.response?.status === 409 && axiosErr.response?.data?.error === 'link_already_exists') {
      showLookup.value = false
      await fetchLinks()
      return
    }
    const err = e as Error
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), err.message)
  }
}

onMounted(fetchLinks)
</script>
