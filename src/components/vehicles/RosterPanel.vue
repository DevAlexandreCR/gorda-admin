<template>
  <div class="roster-panel">
    <div v-if="links.length === 0 && !showLookup" class="text-muted small mt-2">
      {{ $t('vehicles.messages.no_linked_drivers') }}
    </div>

    <ul v-if="links.length > 0" class="list-group list-group-flush mt-2">
      <li
        v-for="link in links"
        :key="link.vehicle_id"
        class="list-group-item d-flex align-items-center gap-2 px-0 py-1"
      >
        <span class="d-flex align-items-center">
          <input
            type="radio"
            :name="`selected-vehicle-${driverId}`"
            :checked="link.is_selected"
            :disabled="savingSelected.has(link.vehicle_id)"
            @change="onSelectVehicle(link.vehicle_id)"
            class="form-check-input mt-0"
            title="Set as selected vehicle"
          />
          <span
            v-if="savingSelected.has(link.vehicle_id)"
            class="spinner-border spinner-border-sm text-secondary ms-1"
            role="status"
            aria-hidden="true"
          ></span>
        </span>
        <span class="flex-grow-1">
          <router-link
            :to="{ name: 'vehicles.detail', params: { id: link.vehicle_id } }"
            class="fw-bold text-decoration-none"
          >
            {{ link.vehicle.plate }}
          </router-link>
          <span v-if="link.vehicle.brand" class="text-muted small ms-1">{{ link.vehicle.brand }}</span>
        </span>
        <div class="form-check form-switch mb-0 d-flex align-items-center">
          <input
            class="form-check-input"
            type="checkbox"
            :id="`selectable-${link.vehicle_id}`"
            :checked="link.selectable"
            :disabled="savingSelectable.has(link.vehicle_id)"
            @change="onToggleSelectable(link.vehicle_id, !link.selectable)"
          />
          <label class="form-check-label small" :for="`selectable-${link.vehicle_id}`">
            {{ $t('vehicles.fields.selectable') }}
          </label>
          <span
            v-if="savingSelectable.has(link.vehicle_id)"
            class="spinner-border spinner-border-sm text-secondary ms-1"
            role="status"
            aria-hidden="true"
          ></span>
        </div>
        <span v-if="link.is_active" class="badge bg-success rounded-pill ms-1">
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
const savingSelectable = ref<Set<string>>(new Set())
const savingSelected = ref<Set<string>>(new Set())

async function fetchLinks(): Promise<void> {
  try {
    links.value = await DriverVehicleRepository.listForDriver(props.driverId)
  } catch (e: unknown) {
    const err = e as Error
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), err.message)
  }
}

async function onToggleSelectable(vehicleId: string, selectable: boolean): Promise<void> {
  if (savingSelectable.value.has(vehicleId)) return
  savingSelectable.value.add(vehicleId)
  try {
    await DriverVehicleRepository.setSelectable(props.driverId, vehicleId, selectable)
    await fetchLinks()
    await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  } catch (e: unknown) {
    const err = e as Error
    // Switch is bound one-way (:checked), so the browser already flipped it on click;
    // re-fetch to force the visual back to the persisted state.
    await fetchLinks()
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), err.message)
  } finally {
    savingSelectable.value.delete(vehicleId)
  }
}

async function onSelectVehicle(vehicleId: string): Promise<void> {
  if (savingSelected.value.has(vehicleId)) return
  savingSelected.value.add(vehicleId)
  try {
    await DriverVehicleRepository.setSelected(props.driverId, vehicleId)
    await fetchLinks()
    await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  } catch (e: unknown) {
    const err = e as Error
    await fetchLinks()
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), err.message)
  } finally {
    savingSelected.value.delete(vehicleId)
  }
}

async function onVehicleSelected(payload: VehiclePayload): Promise<void> {
  try {
    await DriverVehicleRepository.link(props.driverId, { vehicleId: payload.vehicleId })
    showLookup.value = false
    await fetchLinks()
    await ToastService.toast(ToastService.SUCCESS, i18n.global.t('vehicles.messages.vehicle_added'))
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

<style scoped lang="scss">
.roster-panel :deep(.form-check-input[type='radio']:checked) {
  background-image: none;
  background-color: #82d616;
  border-color: #82d616;
}
body.dark-version .roster-panel :deep(.form-check-input[type='radio']:checked) {
  background-color: #82d616;
  border-color: #82d616;
}
</style>
