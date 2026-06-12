<template>
  <div class="container-fluid pb-4" v-if="vehicle">
    <div class="d-flex justify-content-end mb-3">
      <button @click="goBack" class="btn btn-sm btn-info me-2">
        <em class="fas fa-arrow-left me-1"></em> {{ $t('common.actions.back') }}
      </button>
    </div>

    <div class="card mx-auto mx-xxl-5">
      <div class="card-header text-center text-capitalize">
        <h6>{{ $t('vehicles.forms.edit') }} &mdash; {{ vehicle.plate }}</h6>
      </div>
      <div class="card-body pt-2">
        <div class="row">
          <!-- Photo + enable/disable -->
          <div class="col-md-4">
            <div class="text-center mb-3 position-relative d-inline-block w-100">
              <img v-if="vehicle.photoUrl" :src="vehicle.photoUrl" class="img-fluid border-radius-lg" style="max-height: 200px;" alt="Vehicle photo" />
              <em v-else class="fa-solid fa-car-side fa-6x text-secondary"></em>
              <button
                class="btn btn-sm btn-info btn-edit-img py-1 px-2"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#image-vehicle"
                :title="$t('common.actions.edit')"
              >
                <span class="btn-inner--icon"><em class="fas fa-pen"></em></span>
              </button>
            </div>

            <div class="form-group">
              <label class="form-control-label">{{ $t('vehicles.fields.photo_url') }}</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="form.photoUrl"
                :placeholder="$t('vehicles.placeholders.photo_url')"
              />
            </div>

            <!-- Enable/disable toggle -->
            <div class="form-group mt-3">
              <label class="form-control-label d-block mb-1">{{ $t('common.fields.status') }}</label>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="vehicleEnabled"
                  :checked="form.enabled"
                  :disabled="!isComplete && !form.enabled"
                  @change="onEnabledChange"
                />
                <label class="form-check-label" for="vehicleEnabled">
                  {{ $t(form.enabled ? 'common.fields.enabled' : 'common.fields.disabled') }}
                </label>
              </div>
              <small v-if="!isComplete" class="text-muted d-block mt-1">
                {{ $t('vehicles.messages.cannot_enable_incomplete', { fields: missingFields.join(', ') }) }}
              </small>
            </div>
          </div>

          <!-- Fields -->
          <div class="col-md-8">
            <!-- Plate is read-only — shown for reference only -->
            <div class="form-group">
              <label class="form-control-label">{{ $t('drivers.fields.plate') }}</label>
              <input
                type="text"
                class="form-control form-control-sm"
                :value="vehicle.plate"
                disabled
              />
            </div>

            <div class="form-group">
              <label class="form-control-label">{{ $t('drivers.vehicle.brand') }}</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="form.brand"
                :placeholder="$t('drivers.placeholders.brand')"
              />
            </div>

            <div class="form-group">
              <label class="form-control-label">{{ $t('drivers.vehicle.model') }}</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="form.model"
                :placeholder="$t('drivers.vehicle.model')"
              />
            </div>

            <div class="row">
              <div class="form-group col-sm-8">
                <label class="form-control-label">{{ $t('drivers.placeholders.color') }}</label>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  v-model="colorName"
                  :placeholder="$t('drivers.placeholders.color')"
                />
              </div>
              <div class="form-group col-sm-4">
                <label class="form-control-label">{{ $t('drivers.vehicle.color') }}</label>
                <input
                  type="color"
                  class="form-control form-control-sm p-0"
                  v-model="colorHex"
                />
              </div>
            </div>

            <div class="row">
              <div class="form-group col-sm-6">
                <label class="form-control-label">{{ $t('drivers.vehicle.soat_exp') }}</label>
                <input
                  type="date"
                  class="form-control form-control-sm"
                  v-model="form.soat_exp"
                />
              </div>
              <div class="form-group col-sm-6">
                <label class="form-control-label">{{ $t('drivers.vehicle.tec_exp') }}</label>
                <input
                  type="date"
                  class="form-control form-control-sm"
                  v-model="form.tec_exp"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="card-footer text-end">
        <button class="btn btn-info" @click="save" :disabled="saving">
          <em v-if="saving" class="fas fa-circle-notch fa-spin me-1"></em>
          {{ $t('common.actions.submit') }}
        </button>
      </div>
    </div>

    <!-- Force-disconnect confirmation modal -->
    <div class="modal fade" id="vehicle-disable-modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t('vehicles.messages.disable_confirm_title') }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>{{ $t('vehicles.messages.disable_confirm_body', { name: vehicle.currently_driven_by?.name ?? '' }) }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelDisable">
              {{ $t('common.actions.cancel') }}
            </button>
            <button type="button" class="btn btn-danger" @click="confirmDisable">
              {{ $t('vehicles.actions.force_disconnect') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <ImageLoader
      :id="'image-vehicle'"
      :resourceId="vehicle.id"
      :path="vehiclePath"
      :event="vehicleEvent"
      @vehicle-image-loaded="onVehicleImageLoaded"
    />
  </div>

  <div v-else class="text-center py-5">
    <em class="fas fa-circle-notch fa-spin fa-2x text-secondary"></em>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import VehicleRepository from '@/repositories/VehicleRepository'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import { Vehicle } from '@/types/Vehicle'
import ImageLoader from '@/components/ImageLoader.vue'
import StorageService from '@/services/StorageService'

const route = useRoute()
const router = useRouter()

const vehicle = ref<Vehicle | null>(null)
const saving = ref<boolean>(false)

// Form reactive state
const form = ref({
  brand: '' as string | null,
  model: '' as string | null,
  photoUrl: '' as string | null,
  soat_exp: '' as string | null,
  tec_exp: '' as string | null,
  enabled: true,
})

const colorName = ref<string>('')
const colorHex = ref<string>('#000000')

const vehiclePath = StorageService.vehiclePath
const vehicleEvent = 'vehicle-image-loaded'

// Pending disable state when a confirmation modal is needed
let disableModalInstance: Modal | null = null
let pendingDisableConfirmed = false

onMounted(async () => {
  const id = route.params.id as string
  try {
    vehicle.value = await VehicleRepository.findById(id)
    if (vehicle.value) {
      form.value.brand = vehicle.value.brand
      form.value.model = vehicle.value.model
      form.value.photoUrl = vehicle.value.photoUrl
      form.value.soat_exp = vehicle.value.soat_exp
      form.value.tec_exp = vehicle.value.tec_exp
      form.value.enabled = vehicle.value.enabled
      colorName.value = vehicle.value.color?.name ?? ''
      colorHex.value = vehicle.value.color?.hex ?? '#000000'
    }
  } catch (e: unknown) {
    const err = e as { message?: string }
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), err?.message)
  }
})

function goBack(): void {
  router.back()
}

function onVehicleImageLoaded(url: string): void {
  form.value.photoUrl = url
  if (vehicle.value) {
    vehicle.value.photoUrl = url
  }
}

const colorObject = computed(() => ({
  name: colorName.value,
  hex: colorHex.value,
}))

const isComplete = computed<boolean>(() => {
  return !!(
    form.value.brand?.trim() &&
    form.value.model?.trim() &&
    colorName.value?.trim() &&
    form.value.soat_exp &&
    form.value.tec_exp
  )
})

const missingFields = computed<string[]>(() => {
  const fields: string[] = []
  if (!form.value.brand?.trim()) fields.push(i18n.global.t('drivers.vehicle.brand'))
  if (!form.value.model?.trim()) fields.push(i18n.global.t('drivers.vehicle.model'))
  if (!colorName.value?.trim()) fields.push(i18n.global.t('drivers.placeholders.color'))
  if (!form.value.soat_exp) fields.push(i18n.global.t('vehicles.fields.soat_exp'))
  if (!form.value.tec_exp) fields.push(i18n.global.t('vehicles.fields.tec_exp'))
  return fields
})

async function onEnabledChange(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement
  const newEnabled = target.checked

  if (newEnabled && !isComplete.value) {
    // Block enabling — vehicle is incomplete
    target.checked = false
    form.value.enabled = false
    ToastService.toast(
      ToastService.ERROR,
      i18n.global.t('common.messages.error'),
      i18n.global.t('vehicles.messages.cannot_enable_incomplete', { fields: missingFields.value.join(', ') }),
    )
    return
  }

  if (!newEnabled && vehicle.value?.currently_driven_by) {
    // Revert the toggle — user must confirm via modal
    target.checked = true
    form.value.enabled = true

    pendingDisableConfirmed = false
    const el = document.getElementById('vehicle-disable-modal')
    if (el) {
      disableModalInstance = Modal.getOrCreateInstance(el)
      disableModalInstance.show()
    }
    return
  }

  form.value.enabled = newEnabled
}

function cancelDisable(): void {
  pendingDisableConfirmed = false
  disableModalInstance?.hide()
}

async function confirmDisable(): Promise<void> {
  pendingDisableConfirmed = true
  disableModalInstance?.hide()

  if (!vehicle.value) return
  try {
    await VehicleRepository.setEnabled(vehicle.value.id, false, true)
    form.value.enabled = false
    vehicle.value.enabled = false
    ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  } catch (e: unknown) {
    const err = e as { message?: string }
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), err?.message)
  }
}

async function save(): Promise<void> {
  if (!vehicle.value) return

  if (!form.value.brand?.trim()) {
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), i18n.global.t('vehicles.validations.brand_required'))
    return
  }
  if (!form.value.model?.trim()) {
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), i18n.global.t('vehicles.validations.model_required'))
    return
  }
  if (!colorName.value?.trim()) {
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), i18n.global.t('vehicles.validations.color_required'))
    return
  }

  saving.value = true
  try {
    const payload: Partial<Vehicle> = {
      brand: form.value.brand,
      model: form.value.model,
      photoUrl: form.value.photoUrl,
      soat_exp: form.value.soat_exp,
      tec_exp: form.value.tec_exp,
      color: colorObject.value,
    }

    // If enabled state changed (and not a force-disconnect case already handled)
    if (form.value.enabled !== vehicle.value.enabled && !pendingDisableConfirmed) {
      if (form.value.enabled && !isComplete.value) {
        ToastService.toast(
          ToastService.ERROR,
          i18n.global.t('common.messages.error'),
          i18n.global.t('vehicles.messages.cannot_enable_incomplete', { fields: missingFields.value.join(', ') }),
        )
        return
      }
      try {
        await VehicleRepository.setEnabled(vehicle.value.id, form.value.enabled)
      } catch (e: unknown) {
        const axiosErr = e as { response?: { data?: { error?: string; missing_fields?: string[] } } }
        if (axiosErr.response?.data?.error === 'vehicle_incomplete') {
          const serverMissing = axiosErr.response.data.missing_fields ?? missingFields.value
          ToastService.toast(
            ToastService.ERROR,
            i18n.global.t('common.messages.error'),
            i18n.global.t('vehicles.messages.cannot_enable_incomplete', { fields: serverMissing.join(', ') }),
          )
          return
        }
        throw e
      }
    }

    await VehicleRepository.update(vehicle.value.id, payload)
    ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
    router.push({ name: 'vehicles.detail', params: { id: vehicle.value.id } })
  } catch (e: unknown) {
    const err = e as { message?: string }
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), err?.message)
  } finally {
    saving.value = false
  }
}
</script>
