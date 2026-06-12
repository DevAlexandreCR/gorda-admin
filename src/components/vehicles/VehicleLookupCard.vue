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
          <button type="button" class="btn btn-sm btn-outline-secondary" @click="resetPlate">
            {{ $t('vehicles.lookup.different_plate') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Not found — open create modal -->
    <div v-if="state === 'not_found'" class="mt-2">
      <p class="text-muted small mt-1">{{ $t('vehicles.lookup.not_found') }}</p>
      <button type="button" class="btn btn-sm btn-success" @click="openCreateModal">
        {{ $t('vehicles.lookup.create_vehicle') }}
      </button>
    </div>

    <VehicleCreateModal ref="createModalRef" @created="onVehicleCreated" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VehicleRepository from '@/repositories/VehicleRepository'
import { Vehicle } from '@/types/Vehicle'
import { StrHelper } from '@/helpers/StrHelper'
import type { VehiclePayload } from '@/types/VehiclePayload'
import VehicleCreateModal from './VehicleCreateModal.vue'

const props = defineProps<{
  modelValue: VehiclePayload | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: VehiclePayload | null]
  'select': [value: VehiclePayload]
}>()

type LookupState = 'idle' | 'searching' | 'found' | 'not_found'

const plateInput = ref('')
const state = ref<LookupState>('idle')
const foundVehicle = ref<Vehicle | null>(null)
const createModalRef = ref<InstanceType<typeof VehicleCreateModal> | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

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
    }
  } catch {
    state.value = 'not_found'
  }
}

function selectFound(): void {
  if (!foundVehicle.value) return
  const payload: VehiclePayload = { vehicleId: foundVehicle.value.id }
  emit('update:modelValue', payload)
  emit('select', payload)
}

function resetPlate(): void {
  foundVehicle.value = null
  plateInput.value = ''
  state.value = 'idle'
  emit('update:modelValue', null)
}

function openCreateModal(): void {
  createModalRef.value?.open(StrHelper.formatPlate(plateInput.value))
}

function onVehicleCreated(vehicleId: string): void {
  const payload: VehiclePayload = { vehicleId }
  emit('update:modelValue', payload)
  emit('select', payload)
}
</script>
