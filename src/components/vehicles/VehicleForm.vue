<template>
  <div class="vehicle-form" @keydown.enter.prevent>
    <div class="vehicle-form-group">
      <label class="vehicle-form-label">{{ $t('vehicles.fields.plate') }}</label>
      <input
        class="vehicle-form-input"
        type="text"
        :value="normalizedPlate"
        disabled
        autocomplete="none"
      />
    </div>
    <div class="vehicle-form-group">
      <label class="vehicle-form-label">{{ $t('vehicles.fields.brand') }} <span class="text-danger">*</span></label>
      <input
        class="vehicle-form-input"
        type="text"
        v-model="brand"
        :placeholder="$t('vehicles.fields.brand')"
        autocomplete="none"
      />
    </div>
    <div class="vehicle-form-group">
      <label class="vehicle-form-label">{{ $t('vehicles.fields.model') }} <span class="text-danger">*</span></label>
      <input
        class="vehicle-form-input"
        type="text"
        v-model="model"
        :placeholder="$t('vehicles.fields.model')"
        autocomplete="none"
      />
    </div>
    <div class="row">
      <div class="vehicle-form-group col-sm-8">
        <label class="vehicle-form-label">{{ $t('vehicles.fields.color') }} <span class="text-danger">*</span></label>
        <select class="vehicle-form-input" v-model="selectedColorHex">
          <option v-for="(c, key) in Constants.COLORS" :key="key" :value="c.hex">
            {{ $t('common.colors.' + c.name) }}
          </option>
        </select>
      </div>
      <div class="vehicle-form-group col-sm-4">
        <label class="vehicle-form-label">&nbsp;</label>
        <input
          class="vehicle-form-color-preview"
          type="color"
          disabled
          :value="selectedColorHex"
        />
      </div>
    </div>
    <div class="row">
      <div class="vehicle-form-group col-sm-6">
        <label class="vehicle-form-label">{{ $t('vehicles.fields.soat_exp') }}</label>
        <input
          class="vehicle-form-input"
          type="date"
          v-model="soat_exp"
          autocomplete="none"
        />
      </div>
      <div class="vehicle-form-group col-sm-6">
        <label class="vehicle-form-label">{{ $t('vehicles.fields.tec_exp') }}</label>
        <input
          class="vehicle-form-input"
          type="date"
          v-model="tec_exp"
          autocomplete="none"
        />
      </div>
    </div>
    <div class="vehicle-form-group">
      <label class="vehicle-form-label">{{ $t('vehicles.fields.photo') }}</label>
      <input
        class="vehicle-form-input"
        type="file"
        accept="image/jpeg,image/png"
        @change="onFileChange"
      />
    </div>
    <p v-if="formError" class="text-danger small mt-1 mb-0">{{ formError }}</p>
    <div class="vehicle-form-actions">
      <button type="button" class="vehicle-form-submit" @click="onSubmit">
        {{ $t('common.actions.submit') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Constants } from '@/constants/Constants'
import { StrHelper } from '@/helpers/StrHelper'
import { useI18n } from 'vue-i18n'

interface CreateVehiclePayload {
  plate: string
  brand: string
  model: string
  color: { name: string; hex: string }
  soat_exp?: string
  tec_exp?: string
}

const props = defineProps<{
  initialPlate?: string
}>()

const emit = defineEmits<{
  submit: [payload: CreateVehiclePayload, file: File | null]
}>()

const { t } = useI18n()

const normalizedPlate = computed(() => StrHelper.formatPlate(props.initialPlate ?? ''))

const brand = ref('')
const model = ref('')
const selectedColorHex = ref<string>(Constants.COLORS[0].hex)
const soat_exp = ref('')
const tec_exp = ref('')
const selectedFile = ref<File | null>(null)
const formError = ref('')

function onFileChange(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  if (!file) return
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    formError.value = t('validations.image')
    selectedFile.value = null
    return
  }
  if (file.size / 1024 / 1024 > 1.024) {
    formError.value = t('validations.size')
    selectedFile.value = null
    return
  }
  formError.value = ''
  selectedFile.value = file
}

function onSubmit(): void {
  formError.value = ''

  if (!brand.value.trim()) {
    formError.value = t('vehicles.validations.brand_required')
    return
  }
  if (!model.value.trim()) {
    formError.value = t('vehicles.validations.model_required')
    return
  }

  const color = Constants.COLORS.find(c => c.hex === selectedColorHex.value)
  if (!color) {
    formError.value = t('vehicles.validations.color_required')
    return
  }

  const payload: CreateVehiclePayload = {
    plate: normalizedPlate.value,
    brand: brand.value.trim(),
    model: model.value.trim(),
    color: { name: color.name, hex: color.hex },
    soat_exp: soat_exp.value || undefined,
    tec_exp: tec_exp.value || undefined,
  }

  emit('submit', payload, selectedFile.value)
}
</script>

<style scoped>
.vehicle-form-group {
  margin-bottom: 1rem;
}

.vehicle-form-label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.vehicle-form-input {
  width: 100%;
  padding: 0.45rem 0.65rem;
  background: var(--surface-input);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-heading);
  font-size: 0.875rem;
}

.vehicle-form-input:focus {
  outline: none;
  border-color: var(--primary);
}

.vehicle-form-input:disabled {
  opacity: 0.65;
}

.vehicle-form-input::placeholder {
  color: var(--text-muted);
}

.vehicle-form-color-preview {
  width: 100%;
  height: 2.1rem;
  padding: 0;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--surface-input);
}

.vehicle-form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-subtle);
}

.vehicle-form-submit {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  background: var(--gradient-primary);
  border: none;
  border-radius: 0.5rem;
  color: #fff;
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}
</style>
