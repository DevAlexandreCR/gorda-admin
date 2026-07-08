<template>
  <div id="create-driver-modal" role="dialog" class="modal fade cdm-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered cdm-dialog" role="document">
      <div class="modal-content">
        <Form @submit="createDriver" :validation-schema="schema" class="d-flex flex-column">
          <div class="cdm-header">
            <div class="cdm-header-info">
              <div class="cdm-icon-chip bg-gradient-primary d-flex align-items-center justify-content-center shadow-sm">
                <em class="fas fa-id-badge"></em>
              </div>
              <div>
                <div class="cdm-title">{{ $t('drivers.forms.create_title') }}</div>
                <div class="cdm-subtitle">{{ $t('drivers.forms.create_driver') }}</div>
              </div>
            </div>
            <button type="button" class="cdm-close-btn" :aria-label="$t('common.actions.close')" @click="close">
              <em class="fas fa-xmark"></em>
            </button>
          </div>

          <div class="cdm-body">
            <div class="cdm-photo-row">
              <div class="cdm-photo-wrap">
                <div class="cdm-photo-circle" :class="{ 'bg-gradient-primary': !photoPreviewUrl }">
                  <img v-if="photoPreviewUrl" :src="photoPreviewUrl" alt="" class="cdm-photo-img" />
                  <em v-else class="fas fa-user"></em>
                </div>
                <button type="button" class="cdm-photo-btn bg-gradient-info shadow-sm" :title="$t('drivers.placeholders.photo')" @click="triggerFileInput">
                  <em class="fas fa-camera"></em>
                </button>
                <input ref="fileInputRef" type="file" accept="image/*" class="d-none" @change="onPhotoChange" />
              </div>
              <div>
                <div class="cdm-field-label mb-0">{{ $t('drivers.fields.photo') }}</div>
                <div class="cdm-photo-hint">{{ $t('drivers.placeholders.photo_hint') }}</div>
                <span class="is-invalid cdm-photo-error" v-if="photoError">{{ photoError }}</span>
              </div>
            </div>

            <div class="form-group">
              <label class="cdm-field-label">{{ $t('users.fields.name') }}</label>
              <Field name="name" type="text" v-model="driver.name" v-slot="{ field, errorMessage, meta }">
                <div class="input-group input-group-sm">
                  <span class="input-group-text"><em class="fas fa-user"></em></span>
                  <input class="form-control form-control-sm" v-bind="field" v-model="driver.name" :placeholder="$t('common.placeholders.name')" aria-label="Name" />
                </div>
                <span class="is-invalid" v-if="errorMessage && meta.dirty">{{ errorMessage }}</span>
              </Field>
            </div>

            <div class="form-group">
              <label class="cdm-field-label">{{ $t('users.fields.email') }}</label>
              <Field name="email" type="email" v-model="driver.email" v-slot="{ field, errorMessage, meta }" autocomplete="off">
                <div class="input-group input-group-sm">
                  <span class="input-group-text"><em class="fas fa-envelope"></em></span>
                  <input class="form-control form-control-sm" v-bind="field" v-model="field.value" :placeholder="$t('common.placeholders.email')" aria-label="Email" />
                </div>
                <span class="is-invalid" v-if="errorMessage && meta.dirty">{{ errorMessage }}</span>
              </Field>
            </div>

            <div class="form-group">
              <label class="cdm-field-label">{{ $t('users.fields.password') }}</label>
              <Field name="password" v-model="password" v-slot="{ field, errorMessage, meta }">
                <div class="input-group input-group-sm">
                  <span class="input-group-text"><em class="fas fa-lock"></em></span>
                  <input :type="showPassword ? 'text' : 'password'" class="form-control form-control-sm" v-bind="field" v-model="field.value" :placeholder="$t('users.fields.password')" aria-label="Password" />
                  <span class="input-group-text cdm-eye-toggle" role="button" @click="showPassword = !showPassword">
                    <em class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></em>
                  </span>
                </div>
                <span class="is-invalid" v-if="errorMessage && meta.dirty">{{ errorMessage }}</span>
              </Field>
            </div>

            <div class="row">
              <div class="col-sm-6">
                <div class="form-group">
                  <label class="cdm-field-label">{{ $t('users.fields.phone') }}</label>
                  <Field name="phone" v-model="driver.phone" v-slot="{ field, errorMessage, meta }">
                    <div class="input-group input-group-sm">
                      <span class="input-group-text"><em class="fas fa-phone"></em></span>
                      <input class="form-control form-control-sm" v-bind="field" v-model="field.value" :placeholder="$t('common.placeholders.phone')" aria-label="Phone" />
                    </div>
                    <span class="is-invalid" v-if="errorMessage && meta.dirty">{{ errorMessage }}</span>
                  </Field>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <label class="cdm-field-label">{{ $t('users.fields.phone2') }}</label>
                  <Field name="phone2" v-model="driver.phone2" v-slot="{ field, errorMessage, meta }">
                    <div class="input-group input-group-sm">
                      <span class="input-group-text"><em class="fas fa-phone"></em></span>
                      <input class="form-control form-control-sm" v-bind="field" v-model="field.value" :placeholder="$t('common.placeholders.phone2')" aria-label="Phone 2" />
                    </div>
                    <span class="is-invalid" v-if="errorMessage && meta.dirty">{{ errorMessage }}</span>
                  </Field>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label class="cdm-field-label">{{ $t('drivers.fields.doc_type') }}</label>
                  <Field name="docType" class="form-select form-select-sm" as="select" v-model="driver.docType">
                    <option v-for="(type, key) in types" :key="key" :value="type">{{ type }}</option>
                  </Field>
                </div>
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label class="cdm-field-label">{{ $t('drivers.fields.document') }}</label>
                  <Field name="document" v-model="driver.document" v-slot="{ field, errorMessage, meta }">
                    <div class="input-group input-group-sm">
                      <span class="input-group-text"><em class="fas fa-id-card"></em></span>
                      <input class="form-control form-control-sm" v-bind="field" v-model="field.value" :placeholder="$t('common.placeholders.comment')" aria-label="Document" autocomplete="none" />
                    </div>
                    <span class="is-invalid" v-if="errorMessage && meta.dirty">{{ errorMessage }}</span>
                  </Field>
                </div>
              </div>
            </div>

            <div class="row align-items-end">
              <div class="col-sm-6">
                <div class="form-group">
                  <label class="cdm-field-label">{{ $t('drivers.fields.status') }}</label>
                  <div class="form-check form-switch cdm-status-switch">
                    <input class="form-check-input" type="checkbox" id="cdmEnableDriver" @change="onEnable" />
                    <label class="form-check-label" for="cdmEnableDriver">
                      {{ $t(driver.enabled_at ? 'common.fields.enabled' : 'common.fields.disabled') }}
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <label class="cdm-field-label">{{ $t('drivers.fields.payment_mode') }}</label>
                  <Field name="paymentMode" class="form-select form-select-sm" as="select" v-model="driver.paymentMode">
                    <option :value="DriverPaymentMode.MONTHLY">{{ $t('common.placeholders.' + DriverPaymentMode.MONTHLY) }}</option>
                    <option :value="DriverPaymentMode.PERCENTAGE">{{ $t('common.placeholders.' + DriverPaymentMode.PERCENTAGE) }}</option>
                  </Field>
                </div>
              </div>
            </div>
          </div>

          <div class="cdm-footer">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="close">{{ $t('common.actions.cancel') }}</button>
            <button type="submit" class="btn btn-sm bg-gradient-info" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              <em v-else class="fas fa-paper-plane me-1"></em>
              {{ $t('common.actions.submit') }}
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StorageService from '@/services/StorageService'
import { Field, Form } from 'vee-validate'
import { string, mixed, object, ObjectSchema } from 'yup'
import dayjs from 'dayjs'
import Driver from '@/models/Driver'
import DriverRepository from '@/repositories/DriverRepository'
import { Constants } from '@/constants/Constants'
import ToastService from '@/services/ToastService'
import { onBeforeUnmount, onMounted, ref, Ref, watch } from 'vue'
import { useDriversStore } from '@/services/stores/DriversStore'
import { useSettingsStore } from '@/services/stores/SettingsStore'
import { StrHelper } from '@/helpers/StrHelper'
import { DriverPaymentMode } from '@/constants/DriverPaymentMode'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created'): void
}>()

const { t } = useI18n()
const driver: Ref<Driver> = ref(new Driver())
const password: Ref<string> = ref('')
const types: Array<string> = Constants.DOC_TYPES
const submitting = ref(false)
const showPassword = ref(false)
const photoFile = ref<File | null>(null)
const photoPreviewUrl = ref<string | null>(null)
const photoError = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const { addDriver } = useDriversStore()
const { branchSelected } = useSettingsStore()

const schema: ObjectSchema<any> = object().shape({
  name: string().required().min(3),
  email: string().required().email(),
  password: string().required().min(6),
  phone: string().required().min(8),
  phone2: string().nullable(),
  docType: mixed().oneOf(Constants.DOC_TYPES).required(),
  document: string().required().min(6).max(10),
  paymentMode: mixed().oneOf([DriverPaymentMode.MONTHLY, DriverPaymentMode.PERCENTAGE]).required(),
})

onMounted(() => {
  driver.value.docType = Constants.DOC_TYPE_CC
})

onBeforeUnmount(() => {
  if (photoPreviewUrl.value) {
    URL.revokeObjectURL(photoPreviewUrl.value)
  }
})

watch(driver, (newDriver) => {
  driver.value.name = StrHelper.toCamelCase(newDriver.name ?? '')
  driver.value.phone = StrHelper.formatNumber(newDriver.phone ?? '')
  driver.value.phone2 = StrHelper.formatNumber(newDriver.phone2 ?? '')
}, { deep: true })

function triggerFileInput(): void {
  fileInputRef.value?.click()
}

// photoUrl is intentionally kept out of the yup schema (optional field); validate manually
// only when a file is actually chosen, mirroring CustomValidator.image/size constraints.
function onPhotoChange(e: Event): void {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  if (!file) {
    return
  }
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    photoError.value = t('validations.image')
    input.value = ''
    return
  }
  if (file.size / 1024 / 1024 > 1.024) {
    photoError.value = t('validations.size')
    input.value = ''
    return
  }
  photoError.value = null
  if (photoPreviewUrl.value) {
    URL.revokeObjectURL(photoPreviewUrl.value)
  }
  photoFile.value = file
  photoPreviewUrl.value = URL.createObjectURL(file)
}

function onEnable(e: Event): void {
  const target = e.target as HTMLInputElement
  driver.value.enabled_at = target.checked ? dayjs().unix() : 0
}

function uploadPhoto(id: string, image: File): Promise<string> {
  const reference = StorageService.getStorageReference(StorageService.driverPath, id, image.name)
  return StorageService.uploadFile(reference, image)
}

function finishSuccess(): void {
  submitting.value = false
  addDriver(driver.value)
  ToastService.toast(ToastService.SUCCESS, t('common.messages.created'))
  emit('created')
  emit('close')
}

function handleError(e: any): void {
  submitting.value = false
  ToastService.toast(ToastService.ERROR, t('common.messages.error'), e.message)
}

function createDriver(): void {
  submitting.value = true
  driver.value.phone = (branchSelected?.calling_code ?? '') + driver.value.phone
  DriverRepository.create(driver.value, password.value).then((id) => {
    driver.value.id = id
    if (photoFile.value) {
      uploadPhoto(id, photoFile.value).then((url) => {
        driver.value.photoUrl = url
        return DriverRepository.update(driver.value)
      }).then(() => {
        finishSuccess()
      }).catch((e) => {
        handleError(e)
      })
    } else {
      finishSuccess()
    }
  }).catch((e) => {
    handleError(e)
  })
}

function close(): void {
  emit('close')
}
</script>

<style scoped>
.cdm-dialog {
  max-width: 620px;
}

.cdm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid var(--border-subtle);
  background-color: var(--surface-card);
}

.cdm-header-info {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
}

.cdm-icon-chip {
  width: 38px;
  height: 38px;
  border-radius: 0.65rem;
  flex: none;
}

.cdm-icon-chip em {
  color: #fff;
  font-size: 1.05rem;
}

.cdm-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-heading);
  line-height: 1.2;
}

.cdm-subtitle {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 0.1rem;
}

.cdm-close-btn {
  width: 30px;
  height: 30px;
  border-radius: 0.4rem;
  border: none;
  background-color: var(--surface-input);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  flex: none;
}

.cdm-body {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  padding: 1.5rem;
  max-height: calc(100vh - 260px);
  overflow-y: auto;
}

.cdm-photo-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cdm-photo-wrap {
  position: relative;
  flex: none;
}

.cdm-photo-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-subtle);
}

.cdm-photo-circle em {
  color: #fff;
  font-size: 1.6rem;
  opacity: 0.85;
}

.cdm-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cdm-photo-btn {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 3px solid var(--surface-card);
  color: #fff;
  font-size: 0.62rem;
}

.cdm-field-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-heading);
  margin-bottom: 0.35rem;
}

.cdm-photo-hint {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}

.cdm-eye-toggle {
  cursor: pointer;
}

.cdm-status-switch {
  padding-top: 0.3rem;
}

.cdm-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.6rem;
  padding: 0.9rem 1.5rem;
  border-top: 1px solid var(--border-subtle);
  background-color: var(--surface-card);
}
</style>
