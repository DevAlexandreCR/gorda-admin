<template>
  <div class="vehicle-lookup-card">
    <div class="form-group">
      <label>{{ $t('vehicles.fields.plate') }}</label>
      <input
        class="form-control form-control-sm"
        type="text"
        :value="plateInput"
        :placeholder="$t('vehicles.fields.plate')"
        @input="onPlateInput"
        autocomplete="none"
      />
    </div>

    <!-- Found vehicle -->
    <div v-if="state === 'found' && foundVehicle" class="card mt-2 border-success">
      <div class="card-body py-2">
        <p class="mb-1 text-success fw-bold">{{ $t('vehicles.lookup.found') }}</p>
        <p class="mb-0">
          <strong>{{ foundVehicle.brand }}</strong> &mdash; {{ foundVehicle.model }}
        </p>
        <p class="mb-0 text-muted small" v-if="foundVehicle.linked_drivers && foundVehicle.linked_drivers.length">
          {{ $t('vehicles.lookup.linked_to_n_drivers', { n: foundVehicle.linked_drivers.length }) }}
        </p>
        <p class="mb-0 text-muted small" v-if="foundVehicle.currently_driven_by">
          {{ $t('vehicles.lookup.currently_driven_by_x', { name: foundVehicle.currently_driven_by.name }) }}
        </p>
        <div class="d-flex gap-2 mt-2">
          <button type="button" class="btn btn-sm btn-success" @click="selectFound">
            {{ $t('vehicles.lookup.link_this_vehicle') }}
          </button>
          <button type="button" class="btn btn-sm btn-outline-secondary" @click="useDifferentPlate">
            {{ $t('vehicles.lookup.different_plate') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Not found — show full form -->
    <div v-if="state === 'not_found' || state === 'manual'" @keydown.enter.prevent>
      <p class="text-muted small mt-1" v-if="state === 'not_found'">{{ $t('vehicles.lookup.not_found') }}</p>
      <div class="form-group">
        <label>{{ $t('vehicles.fields.brand') }} <span class="text-danger">*</span></label>
        <input
          class="form-control form-control-sm"
          type="text"
          v-model="form.brand"
          :placeholder="$t('vehicles.fields.brand')"
          autocomplete="none"
        />
      </div>
      <div class="form-group">
        <label>{{ $t('vehicles.fields.model') }} <span class="text-danger">*</span></label>
        <input
          class="form-control form-control-sm"
          type="text"
          v-model="form.model"
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
            v-model="form.soat_exp"
            autocomplete="none"
          />
        </div>
        <div class="form-group col-sm-6">
          <label>{{ $t('vehicles.fields.tec_exp') }}</label>
          <input
            class="form-control form-control-sm"
            type="date"
            v-model="form.tec_exp"
            autocomplete="none"
          />
        </div>
      </div>
      <div class="form-group">
        <label>{{ $t('vehicles.fields.photo_url') }}</label>
        <input
          class="form-control form-control-sm"
          type="text"
          v-model="form.photoUrl"
          :placeholder="$t('vehicles.placeholders.photo_url')"
          autocomplete="none"
        />
      </div>
      <div class="d-flex gap-2 mt-2">
        <button type="button" class="btn btn-sm btn-success" @click="confirmNewVehicle">
          {{ $t('vehicles.actions.add_vehicle') }}
        </button>
      </div>
      <p v-if="formError" class="text-danger small mt-1 mb-0">{{ formError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import VehicleRepository from '@/repositories/VehicleRepository'
import { Vehicle } from '@/types/Vehicle'
import { Constants } from '@/constants/Constants'
import { StrHelper } from '@/helpers/StrHelper'

export interface VehiclePayload {
  vehicleId?: string
  plate?: string
  brand?: string
  model?: string
  color?: { name: string; hex?: string }
  photoUrl?: string
  soat_exp?: string
  tec_exp?: string
}

const props = defineProps<{
  modelValue: VehiclePayload | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: VehiclePayload | null]
  'select': [value: VehiclePayload]
}>()

type LookupState = 'idle' | 'searching' | 'found' | 'not_found' | 'manual'

const plateInput = ref(props.modelValue?.plate ?? '')
const state = ref<LookupState>('idle')
const foundVehicle = ref<Vehicle | null>(null)
const selectedColorHex = ref<string>(Constants.COLORS[0].hex)
const formError = ref<string>('')
const form = ref({
  brand: props.modelValue?.brand ?? '',
  model: props.modelValue?.model ?? '',
  photoUrl: props.modelValue?.photoUrl ?? '',
  soat_exp: props.modelValue?.soat_exp ?? '',
  tec_exp: props.modelValue?.tec_exp ?? '',
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.modelValue, (val) => {
  if (val && val.plate && val.plate !== plateInput.value) {
    plateInput.value = val.plate
  }
})

function onPlateInput(event: Event): void {
  const raw = (event.target as HTMLInputElement).value
  plateInput.value = raw
  state.value = 'idle'
  foundVehicle.value = null

  if (debounceTimer !== null) clearTimeout(debounceTimer)

  const normalized = StrHelper.formatPlate(raw)
  if (!normalized || normalized.length < 3) {
    emit('update:modelValue', null)
    return
  }

  debounceTimer = setTimeout(() => {
    doLookup(normalized)
  }, 500)
}

async function doLookup(plate: string): Promise<void> {
  state.value = 'searching'
  try {
    const vehicle = await VehicleRepository.lookupByPlate(plate)
    if (vehicle) {
      foundVehicle.value = vehicle
      state.value = 'found'
    } else {
      state.value = 'not_found'
      form.value = { brand: '', model: '', photoUrl: '', soat_exp: '', tec_exp: '' }
    }
  } catch {
    state.value = 'not_found'
    form.value = { brand: '', model: '', photoUrl: '', soat_exp: '', tec_exp: '' }
  }
}

function selectFound(): void {
  if (!foundVehicle.value) return
  const payload: VehiclePayload = { vehicleId: foundVehicle.value.id }
  emit('update:modelValue', payload)
  emit('select', payload)
}

function useDifferentPlate(): void {
  foundVehicle.value = null
  state.value = 'manual'
  form.value = { brand: '', model: '', photoUrl: '', soat_exp: '', tec_exp: '' }
  emitForm()
}

function buildPayload(): VehiclePayload {
  const color = Constants.COLORS.find(c => c.hex === selectedColorHex.value) ?? Constants.COLORS[0]
  return {
    plate: StrHelper.formatPlate(plateInput.value),
    brand: form.value.brand,
    model: form.value.model,
    color: { name: color.name, hex: color.hex },
    photoUrl: form.value.photoUrl || undefined,
    soat_exp: form.value.soat_exp || undefined,
    tec_exp: form.value.tec_exp || undefined,
  }
}

function emitForm(): void {
  emit('update:modelValue', buildPayload())
}

function confirmNewVehicle(): void {
  formError.value = ''
  if (!form.value.brand.trim()) {
    formError.value = 'La marca es obligatoria'
    return
  }
  if (!form.value.model.trim()) {
    formError.value = 'El modelo es obligatorio'
    return
  }
  const payload = buildPayload()
  emit('update:modelValue', payload)
  emit('select', payload)
}
</script>
