<template>
  <div class="container-fluid pb-4" v-if="vehicle">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <p class="text-xs text-secondary mb-0">
          {{ $t('routes.vehicles') }} <span class="mx-1">/</span>
          <span class="text-dark font-weight-bold">{{ vehicle.plate }}</span>
        </p>
        <h6 class="mb-0 mt-1">{{ vehicle.brand }} {{ vehicle.model }}</h6>
      </div>
      <button @click="goBack" class="btn btn-sm btn-info">
        <em class="fas fa-arrow-left me-1"></em> {{ $t('common.actions.back') }}
      </button>
    </div>

    <div class="row align-items-start">
      <!-- LEFT — Editar Vehículo -->
      <div class="col-lg-7 mb-4">
        <div class="card h-100">
          <div class="card-header d-flex align-items-center gap-2">
            <div class="icon icon-shape icon-sm bg-gradient-primary shadow text-center border-radius-md d-flex align-items-center justify-content-center">
              <em class="fas fa-car-side text-white text-xs"></em>
            </div>
            <h6 class="mb-0">{{ $t('vehicles.forms.edit') }}</h6>
          </div>
          <div class="card-body pt-3">
            <!-- Photo -->
            <div class="d-flex flex-column align-items-center mb-4">
              <div class="vehicle-photo-box position-relative">
                <img v-if="vehicle.photoUrl" :src="vehicle.photoUrl" class="vehicle-photo-box__img" alt="Vehicle photo" />
                <em v-else class="fa-solid fa-car-side vehicle-photo-box__placeholder"></em>
                <button
                  class="vehicle-photo-box__edit-btn"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#image-vehicle"
                  :title="$t('common.actions.edit')"
                >
                  <em class="fas fa-pencil"></em>
                </button>
              </div>

              <!-- Enable/disable toggle -->
              <div class="form-check form-switch mt-3 mb-0">
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
              <small v-if="!isComplete" class="text-muted text-center mt-1">
                {{ $t('vehicles.messages.cannot_enable_incomplete', { fields: missingFields.join(', ') }) }}
              </small>
            </div>

            <!-- Fields -->
            <div class="row g-3">
              <div class="col-6">
                <label class="form-control-label">{{ $t('drivers.fields.plate') }}</label>
                <input type="text" class="form-control form-control-sm" :value="vehicle.plate" disabled />
              </div>
              <div class="col-6">
                <label class="form-control-label">{{ $t('drivers.vehicle.brand') }}</label>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  v-model="form.brand"
                  :placeholder="$t('drivers.placeholders.brand')"
                />
              </div>

              <div class="col-6">
                <label class="form-control-label">{{ $t('drivers.vehicle.model') }}</label>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  v-model="form.model"
                  :placeholder="$t('drivers.vehicle.model')"
                />
              </div>
              <div class="col-6">
                <label class="form-control-label">{{ $t('drivers.placeholders.color') }}</label>
                <div class="d-flex gap-2">
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model="colorName"
                    :placeholder="$t('drivers.placeholders.color')"
                  />
                  <input type="color" class="form-control form-control-sm p-0 vehicle-color-swatch" v-model="colorHex" />
                </div>
              </div>

              <div class="col-6">
                <label class="form-control-label">{{ $t('drivers.vehicle.soat_exp') }}</label>
                <input type="date" class="form-control form-control-sm" v-model="form.soat_exp" />
                <small v-if="soatHint" class="d-block fw-bold mt-1" :class="soatHint.cls">{{ soatHint.text }}</small>
              </div>
              <div class="col-6">
                <label class="form-control-label">{{ $t('drivers.vehicle.tec_exp') }}</label>
                <input type="date" class="form-control form-control-sm" v-model="form.tec_exp" />
                <small v-if="tecHint" class="d-block fw-bold mt-1" :class="tecHint.cls">{{ tecHint.text }}</small>
              </div>
            </div>

            <div class="d-flex justify-content-end mt-4">
              <button class="btn btn-info btn-sm mb-0" @click="save" :disabled="saving">
                <em v-if="saving" class="fas fa-circle-notch fa-spin me-1"></em>
                {{ $t('common.actions.submit') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT — Conductores Vinculados -->
      <div class="col-lg-5 mb-4">
        <div class="card h-100">
          <div class="card-header d-flex align-items-center gap-2">
            <div class="icon icon-shape icon-sm bg-gradient-success shadow text-center border-radius-md d-flex align-items-center justify-content-center">
              <em class="fas fa-users text-white text-xs"></em>
            </div>
            <h6 class="mb-0">{{ $t('vehicles.fields.linked_drivers') }}</h6>
            <span class="vehicle-count-pill ms-auto">{{ vehicle.linked_drivers?.length ?? 0 }}</span>
          </div>

          <div v-if="!vehicle.linked_drivers || vehicle.linked_drivers.length === 0" class="text-center text-secondary py-5">
            <em class="fa-solid fa-users-slash fa-2x mb-2 d-block opacity-25"></em>
            <p class="text-sm mb-0">{{ $t('vehicles.messages.no_linked_drivers') }}</p>
          </div>
          <div v-else class="table-responsive">
            <table class="table align-items-center mb-0">
              <caption hidden></caption>
              <thead>
                <tr>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder">{{ $t('common.fields.name') }}</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-end">{{ $t('vehicles.fields.selectable') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="entry in vehicle.linked_drivers" :key="entry.driver_id">
                  <td class="py-1">
                    <div class="d-flex align-items-center gap-2">
                      <span class="vehicle-driver-avatar">{{ initials(entry.driver_name) }}</span>
                      <p class="text-xs font-weight-bold mb-0">{{ entry.driver_name }}</p>
                    </div>
                  </td>
                  <td class="align-middle text-end">
                    <div class="form-check form-switch mb-0 d-inline-block">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        :checked="entry.selectable"
                        :disabled="togglingDriverId === entry.driver_id"
                        @change="onToggle(entry.driver_id, !entry.selectable)"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="vehicle-info-strip">
            <em class="fas fa-circle-info"></em>
            <span>
              Activa <strong>{{ $t('vehicles.fields.selectable') }}</strong> para que el conductor pueda usar este vehículo al
              aceptar servicios. Solo un conductor puede tener el vehículo activo a la vez.
            </span>
          </div>
        </div>
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
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import VehicleRepository from '@/repositories/VehicleRepository'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import { Vehicle } from '@/types/Vehicle'
import ImageLoader from '@/components/ImageLoader.vue'
import StorageService from '@/services/StorageService'
import DateHelper from '@/helpers/DateHelper'
import { useSelectableToggle } from '@/composables/useSelectableToggle'

dayjs.extend(utc)

const route = useRoute()
const router = useRouter()

const vehicle = ref<Vehicle | null>(null)
const saving = ref<boolean>(false)
const { togglingDriverId, toggle } = useSelectableToggle()

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
      form.value.soat_exp = DateHelper.normalizeDateInput(vehicle.value.soat_exp)
      form.value.tec_exp = DateHelper.normalizeDateInput(vehicle.value.tec_exp)
      form.value.enabled = vehicle.value.enabled
      colorName.value = vehicle.value.color?.name ?? ''
      colorHex.value = vehicle.value.color?.hex ?? '#000000'
    }
  } catch (e: unknown) {
    const err = e as { message?: string }
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), err?.message)
  }
})

function onToggle(driverId: string, newValue: boolean): Promise<void> {
  return toggle(vehicle.value, driverId, newValue)
}

function initials(name: string): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return parts.slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

interface ExpiryHint {
  text: string
  cls: string
}

function expiryHint(dateStr: string | null): ExpiryHint | null {
  const normalized = DateHelper.normalizeDateInput(dateStr)
  if (!normalized) return null

  const diff = dayjs.utc(normalized).startOf('day').diff(dayjs.utc().startOf('day'), 'day')
  if (diff < 0) {
    return { text: i18n.global.t('vehicles.expiry.expired'), cls: 'text-danger' }
  }
  if (diff < 30) {
    // Named values must precede the plural count for vue-i18n to interpolate {n} correctly
    // (mirrors the pattern used for `drivers.detail.count_movements`).
    return { text: i18n.global.t('vehicles.expiry.expires_in', { n: diff }, diff), cls: 'text-warning' }
  }
  return { text: i18n.global.t('vehicles.expiry.valid'), cls: 'text-success' }
}

const soatHint = computed<ExpiryHint | null>(() => expiryHint(form.value.soat_exp))
const tecHint = computed<ExpiryHint | null>(() => expiryHint(form.value.tec_exp))

function goBack(): void {
  router.back()
}

function onVehicleImageLoaded(url: string): void {
  form.value.photoUrl = url
  if (vehicle.value) {
    vehicle.value.photoUrl = url
  }
}

function normalizeVehicleDateForPayload(value: string | null): string | null {
  const normalized = DateHelper.normalizeDateInput(value)
  return normalized || null
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
      photoUrl: form.value.photoUrl?.trim() || null,
      soat_exp: normalizeVehicleDateForPayload(form.value.soat_exp),
      tec_exp: normalizeVehicleDateForPayload(form.value.tec_exp),
      color: colorObject.value,
    }

    const previousEnabled = vehicle.value.enabled
    const updatedVehicle = await VehicleRepository.update(vehicle.value.id, payload)
    vehicle.value = {
      ...vehicle.value,
      ...updatedVehicle,
      enabled: previousEnabled,
    }

    // If enabled state changed (and not a force-disconnect case already handled)
    if (form.value.enabled !== previousEnabled && !pendingDisableConfirmed) {
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

      vehicle.value.enabled = form.value.enabled
    }
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

<style scoped lang="scss">
.vehicle-photo-box {
  width: 164px;
  height: 128px;

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.75rem;
    border: 1px solid var(--border-subtle);
  }

  &__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    opacity: 0.25;
    color: var(--text-secondary);
    background: var(--surface-input);
    border-radius: 0.75rem;
    border: 1px solid var(--border-subtle);
  }

  &__edit-btn {
    position: absolute;
    bottom: -10px;
    right: -10px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid var(--surface-card, #fff);
    background: linear-gradient(310deg, #17c1e8, #21d4fd);
    color: #fff;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  }
}

.vehicle-color-swatch {
  flex: none;
  width: 42px;
}

.vehicle-count-pill {
  background: var(--surface-input);
  border: 1px solid var(--border-subtle);
  border-radius: 50rem;
  padding: 0.1rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.vehicle-driver-avatar {
  width: 30px;
  height: 30px;
  flex: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(310deg, #7928ca, #ff0080);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
}

.vehicle-info-strip {
  margin: 0.75rem 1rem;
  padding: 0.6rem 0.85rem;
  background: var(--body-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.73rem;
  color: var(--text-secondary);
  line-height: 1.45;

  em {
    color: #17c1e8;
    margin-top: 0.1rem;
    flex: none;
  }

  strong {
    color: var(--text-heading);
  }
}
</style>
