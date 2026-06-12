<template>
  <div class="vehicle-lookup-card">
    <div class="form-group position-relative">
      <label>{{ $t('vehicles.fields.plate') }}</label>
      <input
        class="form-control form-control-sm"
        type="text"
        :value="plateInput"
        :placeholder="$t('vehicles.fields.plate')"
        @input="onInput"
        @focus="onFocus"
        @keydown="onKeyDown"
        @blur="onBlur"
        autocomplete="none"
      />

      <!-- Dropdown: vehicle suggestions + create option -->
      <ul
        v-if="dropdownOpen"
        class="list-group position-absolute w-100 shadow"
        style="z-index: 200; top: 100%; left: 0; border-top: none; border-radius: 0 0 4px 4px;"
      >
        <li
          v-for="(v, idx) in suggestions"
          :key="v.id"
          class="list-group-item list-group-item-action py-2 px-3 small"
          :class="{ active: idx === activeIndex }"
          @mousedown.prevent="selectSuggestion(v)"
        >
          <strong>{{ v.plate }}</strong>
          <span class="ms-2 text-muted">{{ v.brand }} {{ v.model }}</span>
        </li>

        <!-- Create new vehicle option at bottom -->
        <li
          class="list-group-item list-group-item-action py-2 px-3 small text-success"
          :class="{ active: activeIndex === suggestions.length }"
          @mousedown.prevent="openCreateModal"
        >
          + {{ $t('vehicles.lookup.create_with_plate', { plate: plateInput }) }}
        </li>
      </ul>
    </div>

    <!-- Found vehicle card -->
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

    <VehicleCreateModal ref="createModalRef" @created="onVehicleCreated" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import VehicleRepository from '@/repositories/VehicleRepository'
import { Vehicle } from '@/types/Vehicle'
import { StrHelper } from '@/helpers/StrHelper'
import type { VehiclePayload } from '@/types/VehiclePayload'
import VehicleCreateModal from './VehicleCreateModal.vue'

defineProps<{
  modelValue: VehiclePayload | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: VehiclePayload | null]
  'select': [value: VehiclePayload]
}>()

type LookupState = 'idle' | 'found'

const state = ref<LookupState>('idle')
const foundVehicle = ref<Vehicle | null>(null)
const createModalRef = ref<InstanceType<typeof VehicleCreateModal> | null>(null)
const plateInput = ref('')
const suggestions = ref<Vehicle[]>([])
const activeIndex = ref(-1)
const inputFocused = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Dropdown is open when: input is focused, ≥3 chars typed, no vehicle selected yet
const dropdownOpen = computed(
  () => inputFocused.value && plateInput.value.length >= 3 && state.value !== 'found'
)

function onInput(event: Event): void {
  const normalized = StrHelper.formatPlate((event.target as HTMLInputElement).value)
  plateInput.value = normalized
  ;(event.target as HTMLInputElement).value = normalized

  state.value = 'idle'
  foundVehicle.value = null
  suggestions.value = []
  activeIndex.value = -1

  if (debounceTimer !== null) clearTimeout(debounceTimer)
  if (normalized.length < 3) return

  debounceTimer = setTimeout(() => fetchSuggestions(normalized), 300)
}

async function fetchSuggestions(term: string): Promise<void> {
  try {
    const { vehicles } = await VehicleRepository.list({ search: term, perPage: 20 })
    if (plateInput.value === term) {
      suggestions.value = vehicles
    }
  } catch {
    suggestions.value = []
  }
}

function onKeyDown(event: KeyboardEvent): void {
  if (!dropdownOpen.value) return
  // Total items: suggestions + create option
  const total = suggestions.value.length + 1

  if (event.code === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % total
  } else if (event.code === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = activeIndex.value <= 0 ? total - 1 : activeIndex.value - 1
  } else if (event.code === 'Enter' && activeIndex.value >= 0) {
    event.preventDefault()
    if (activeIndex.value < suggestions.value.length) {
      selectSuggestion(suggestions.value[activeIndex.value])
    } else {
      openCreateModal()
    }
  } else if (event.code === 'Escape') {
    inputFocused.value = false
    activeIndex.value = -1
  }
}

function onBlur(): void {
  setTimeout(() => {
    inputFocused.value = false
    activeIndex.value = -1
  }, 150)
}

function onFocus(): void {
  inputFocused.value = true
}

function selectSuggestion(vehicle: Vehicle): void {
  plateInput.value = vehicle.plate
  suggestions.value = []
  activeIndex.value = -1
  inputFocused.value = false
  foundVehicle.value = vehicle
  state.value = 'found'
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
  suggestions.value = []
  activeIndex.value = -1
  inputFocused.value = false
  emit('update:modelValue', null)
}

function openCreateModal(): void {
  inputFocused.value = false
  createModalRef.value?.open(plateInput.value)
}

function onVehicleCreated(vehicleId: string): void {
  const payload: VehiclePayload = { vehicleId }
  emit('update:modelValue', payload)
  emit('select', payload)
}
</script>
