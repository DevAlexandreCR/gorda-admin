<template>
  <div class="container-fluid pb-4" v-if="vehicle">
    <div class="d-flex justify-content-end mb-3 gap-2">
      <button @click="goBack" class="btn btn-sm btn-info">
        <em class="fas fa-arrow-left me-1"></em> {{ $t('common.actions.back') }}
      </button>
      <router-link
        :to="{ name: 'vehicles.edit', params: { id: vehicle.id } }"
        class="btn btn-sm btn-outline-primary"
      >
        <em class="fas fa-pencil me-1"></em> {{ $t('common.actions.edit') }}
      </router-link>
    </div>

    <div class="row">
      <!-- Vehicle info card -->
      <div class="col-md-5 mb-4">
        <div class="card h-100">
          <div class="card-header text-center text-capitalize">
            <h6>{{ $t('vehicles.forms.detail') }}</h6>
          </div>
          <div class="card-body">
            <div class="text-center mb-3" v-if="vehicle.photoUrl">
              <img :src="vehicle.photoUrl" class="img-fluid border-radius-lg" style="max-height: 200px;" alt="Vehicle photo" />
            </div>
            <div v-else class="text-center mb-3">
              <em class="fa-solid fa-car-side fa-6x text-secondary"></em>
            </div>

            <table class="table table-sm">
              <caption hidden></caption>
              <tbody>
                <tr>
                  <th class="text-secondary text-xs" scope="row">{{ $t('drivers.fields.plate') }}</th>
                  <td class="text-sm font-weight-bold">{{ vehicle.plate }}</td>
                </tr>
                <tr>
                  <th class="text-secondary text-xs" scope="row">{{ $t('drivers.vehicle.brand') }}</th>
                  <td class="text-sm">{{ vehicle.brand }}</td>
                </tr>
                <tr>
                  <th class="text-secondary text-xs" scope="row">{{ $t('drivers.vehicle.model') }}</th>
                  <td class="text-sm">{{ vehicle.model }}</td>
                </tr>
                <tr>
                  <th class="text-secondary text-xs" scope="row">{{ $t('drivers.placeholders.color') }}</th>
                  <td class="text-sm">
                    <div class="d-flex align-items-center gap-1">
                      <span
                        v-if="vehicle.color?.hex"
                        class="rounded-circle d-inline-block"
                        style="width: 16px; height: 16px; border: 1px solid #ccc;"
                        :style="{ backgroundColor: vehicle.color.hex }"
                      ></span>
                      {{ vehicle.color?.name ?? '' }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th class="text-secondary text-xs" scope="row">{{ $t('common.fields.status') }}</th>
                  <td>
                    <span
                      class="badge badge-sm"
                      :class="vehicle.enabled ? 'bg-gradient-success' : 'bg-gradient-danger'"
                    >
                      {{ $t(vehicle.enabled ? 'common.fields.enabled' : 'common.fields.disabled') }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th class="text-secondary text-xs" scope="row">{{ $t('vehicles.fields.soat_exp') }}</th>
                  <td class="text-sm">{{ vehicle.soat_exp ?? '—' }}</td>
                </tr>
                <tr>
                  <th class="text-secondary text-xs" scope="row">{{ $t('vehicles.fields.tec_exp') }}</th>
                  <td class="text-sm">{{ vehicle.tec_exp ?? '—' }}</td>
                </tr>
                <tr v-if="vehicle.currently_driven_by">
                  <th class="text-secondary text-xs" scope="row">{{ $t('vehicles.fields.currently_driven_by') }}</th>
                  <td class="text-sm text-warning font-weight-bold">{{ vehicle.currently_driven_by.name }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Linked drivers card -->
      <div class="col-md-7 mb-4">
        <div class="card h-100">
          <div class="card-header text-capitalize">
            <h6>{{ $t('vehicles.fields.linked_drivers') }}</h6>
          </div>
          <div class="card-body px-0 pt-0">
            <div v-if="!vehicle.linked_drivers || vehicle.linked_drivers.length === 0" class="text-center text-secondary py-4">
              <em class="fa-solid fa-users-slash fa-2x mb-2"></em>
              <p class="text-sm mb-0">{{ $t('vehicles.messages.no_linked_drivers') }}</p>
            </div>
            <table v-else class="table align-items-center mb-0">
              <caption hidden></caption>
              <thead>
                <tr>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                    {{ $t('common.fields.name') }}
                  </th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                    {{ $t('vehicles.fields.selectable') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="entry in vehicle.linked_drivers" :key="entry.driver_id">
                  <td class="py-1">
                    <p class="text-xs font-weight-bold mb-0">{{ entry.driver_name }}</p>
                  </td>
                  <td class="align-middle">
                    <div class="form-check form-switch mb-0">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        :checked="entry.selectable"
                        :disabled="togglingDriverId === entry.driver_id"
                        @change="onSelectableToggle(entry.driver_id, !entry.selectable)"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="loading" class="text-center py-5">
    <em class="fas fa-circle-notch fa-spin fa-2x text-secondary"></em>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VehicleRepository from '@/repositories/VehicleRepository'
import DriverVehicleRepository from '@/repositories/DriverVehicleRepository'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import { Vehicle } from '@/types/Vehicle'

const route = useRoute()
const router = useRouter()

const vehicle = ref<Vehicle | null>(null)
const loading = ref<boolean>(false)
const togglingDriverId = ref<string | null>(null)

onMounted(async () => {
  const id = route.params.id as string
  loading.value = true
  try {
    vehicle.value = await VehicleRepository.findById(id)
  } catch (e: unknown) {
    const err = e as { message?: string }
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), err?.message)
  } finally {
    loading.value = false
  }
})

async function onSelectableToggle(driverId: string, newValue: boolean): Promise<void> {
  if (!vehicle.value) return

  const isActive = vehicle.value.currently_driven_by?.id === driverId
  if (!newValue && isActive) {
    const driverName = vehicle.value.currently_driven_by?.name ?? driverId
    const confirmed = window.confirm(
      i18n.global.t('vehicles.messages.disable_selectable_confirm', { name: driverName })
    )
    if (!confirmed) return
  }

  togglingDriverId.value = driverId
  try {
    await DriverVehicleRepository.setSelectable(driverId, vehicle.value.id, newValue)
    // Update local state
    const entry = vehicle.value.linked_drivers?.find(e => e.driver_id === driverId)
    if (entry) entry.selectable = newValue
    ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  } catch (e: unknown) {
    const err = e as { message?: string }
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), err?.message)
  } finally {
    togglingDriverId.value = null
  }
}

function goBack(): void {
  router.back()
}
</script>
