<template>
  <div @keydown.enter.prevent>
    <div class="form-group">
      <label>{{ $t('vehicles.fields.plate') }}</label>
      <input
        class="form-control form-control-sm"
        type="text"
        :value="normalizedPlate"
        disabled
        autocomplete="none"
      />
    </div>
    <div class="form-group">
      <label>{{ $t('vehicles.fields.brand') }} <span class="text-danger">*</span></label>
      <input
        class="form-control form-control-sm"
        type="text"
        v-model="brand"
        :placeholder="$t('vehicles.fields.brand')"
        autocomplete="none"
      />
    </div>
    <div class="form-group">
      <label>{{ $t('vehicles.fields.model') }} <span class="text-danger">*</span></label>
      <input
        class="form-control form-control-sm"
        type="text"
        v-model="model"
        :placeholder="$t('vehicles.fields.model')"
        autocomplete="none"
      />
    </div>
    <div class="row">
      <div class="form-group col-sm-8">
        <label>{{ $t('vehicles.fields.color') }} <span class="text-danger">*</span></label>
        <select class="form-select form-select-sm" v-model="selectedColorHex">
          <option v-for="(c, key) in Constants.COLORS" :key="key" :value="c.hex">
            {{ $t('common.colors.' + c.name) }}
          </option>
        </select>
      </div>
      <div class="form-group col-sm-4">
        <label>&nbsp;</label>
        <input
          class="form-control form-control-sm p-0"
          type="color"
          disabled
          :value="selectedColorHex"
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-sm-6">
        <label>{{ $t('vehicles.fields.soat_exp') }}</label>
        <input
          class="form-control form-control-sm"
          type="date"
          v-model="soat_exp"
          autocomplete="none"
        />
      </div>
      <div class="form-group col-sm-6">
        <label>{{ $t('vehicles.fields.tec_exp') }}</label>
        <input
          class="form-control form-control-sm"
          type="date"
          v-model="tec_exp"
          autocomplete="none"
        />
      </div>
    </div>
    <div class="form-group">
      <label>{{ $t('vehicles.fields.photo_url') }}</label>
      <input
        class="form-control form-control-sm"
        type="text"
        v-model="photoUrl"
        :placeholder="$t('vehicles.placeholders.photo_url')"
        autocomplete="none"
      />
    </div>
    <p v-if="formError" class="text-danger small mt-1 mb-0">{{ formError }}</p>
    <div class="mt-2">
      <button type="button" class="btn btn-success btn-sm" @click="onSubmit">
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
  photoUrl?: string
}

const props = defineProps<{
  initialPlate?: string
}>()

const emit = defineEmits<{
  submit: [payload: CreateVehiclePayload]
}>()

const { t } = useI18n()

const normalizedPlate = computed(() => StrHelper.formatPlate(props.initialPlate ?? ''))

const brand = ref('')
const model = ref('')
const selectedColorHex = ref<string>(Constants.COLORS[0].hex)
const soat_exp = ref('')
const tec_exp = ref('')
const photoUrl = ref('')
const formError = ref('')

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
    photoUrl: photoUrl.value || undefined,
  }

  emit('submit', payload)
}
</script>
