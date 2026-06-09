<template>
  <div class="d-flex flex-wrap align-items-center gap-2">
    <!-- Search input -->
    <div class="input-group input-group-sm filters-search-input">
      <span class="input-group-text">
        <em class="fas fa-search text-secondary text-xs"></em>
      </span>
      <input
        type="text"
        class="form-control"
        :placeholder="$t('common.placeholders.search')"
        :value="localSearch"
        @input="onSearchInput"
      />
    </div>

    <!-- Status filter dropdown -->
    <div class="dropdown">
      <button
        type="button"
        class="btn btn-sm dropdown-toggle"
        :class="filters.status !== undefined ? 'btn-warning' : 'btn-outline-secondary'"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <template v-if="filters.status !== undefined">
          {{ $t('drivers.filters.filter_status') }}: {{ $t('drivers.filters.status_values.' + filters.status) }}
        </template>
        <template v-else>
          {{ $t('drivers.filters.filter_status') }}
        </template>
        <span
          v-if="filters.status !== undefined"
          class="ms-1 filter-clear"
          role="button"
          :aria-label="$t('common.actions.delete')"
          @click.stop="removeFilter('status')"
        >&times;</span>
      </button>
      <ul class="dropdown-menu shadow-sm">
        <li>
          <button
            class="dropdown-item"
            type="button"
            @click="removeFilter('status')"
          >
            {{ $t('drivers.filters.status_values.all') || 'Todos' }}
          </button>
        </li>
        <li v-for="val in statusValues" :key="val">
          <button
            class="dropdown-item"
            :class="{ active: filters.status === val }"
            type="button"
            @click="applyStatusFilter(val)"
          >
            {{ $t('drivers.filters.status_values.' + val) }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Payment filter dropdown -->
    <div class="dropdown">
      <button
        type="button"
        class="btn btn-sm dropdown-toggle"
        :class="filters.paymentMode !== undefined ? 'btn-warning' : 'btn-outline-secondary'"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <template v-if="filters.paymentMode !== undefined">
          {{ $t('drivers.filters.filter_payment') }}: {{ $t('drivers.filters.payment_values.' + filters.paymentMode) }}
        </template>
        <template v-else>
          {{ $t('drivers.filters.filter_payment') }}
        </template>
        <span
          v-if="filters.paymentMode !== undefined"
          class="ms-1 filter-clear"
          role="button"
          :aria-label="$t('common.actions.delete')"
          @click.stop="removeFilter('paymentMode')"
        >&times;</span>
      </button>
      <ul class="dropdown-menu shadow-sm">
        <li>
          <button
            class="dropdown-item"
            type="button"
            @click="removeFilter('paymentMode')"
          >
            {{ $t('drivers.filters.payment_values.all') || 'Todos' }}
          </button>
        </li>
        <li v-for="val in paymentValues" :key="val">
          <button
            class="dropdown-item"
            :class="{ active: filters.paymentMode === val }"
            type="button"
            @click="applyPaymentFilter(val)"
          >
            {{ $t('drivers.filters.payment_values.' + val) }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Inactivity filter dropdown -->
    <div class="dropdown">
      <button
        type="button"
        class="btn btn-sm dropdown-toggle"
        :class="filters.inactiveDays !== undefined ? 'btn-warning' : 'btn-outline-secondary'"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <template v-if="filters.inactiveDays !== undefined">
          {{ $t('drivers.filters.filter_inactive') }}: {{ $t('drivers.filters.inactive_days', { days: filters.inactiveDays }) }}
        </template>
        <template v-else>
          {{ $t('drivers.filters.filter_inactive') }}
        </template>
        <span
          v-if="filters.inactiveDays !== undefined"
          class="ms-1 filter-clear"
          role="button"
          :aria-label="$t('common.actions.delete')"
          @click.stop="removeFilter('inactiveDays')"
        >&times;</span>
      </button>
      <ul class="dropdown-menu shadow-sm" style="min-width: 180px;">
        <li>
          <button
            class="dropdown-item"
            type="button"
            @click="removeFilter('inactiveDays')"
          >
            {{ $t('drivers.filters.inactive_none') || 'Ninguno' }}
          </button>
        </li>
        <li v-for="days in cannedInactiveDays" :key="days">
          <button
            class="dropdown-item"
            :class="{ active: filters.inactiveDays === days }"
            type="button"
            @click="applyInactiveFilter(days)"
          >
            {{ $t('drivers.filters.inactive_days', { days }) }}
          </button>
        </li>
        <li><hr class="dropdown-divider" /></li>
        <li>
          <div class="px-3 py-1">
            <label class="form-label text-xs text-secondary mb-1">{{ $t('drivers.filters.custom') }}</label>
            <div class="input-group input-group-sm">
              <input
                type="number"
                class="form-control"
                min="1"
                v-model.number="customDays"
                :placeholder="$t('drivers.filters.custom_placeholder')"
                @keydown.enter.stop="applyCustomInactiveFilter"
                @click.stop
              />
              <button
                class="btn btn-primary"
                type="button"
                :disabled="!customDays || customDays < 1"
                @click.stop="applyCustomInactiveFilter"
              >
                {{ $t('common.actions.add') }}
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ActiveFilters } from '@/types/ActiveFilters'

interface Props {
  filters: ActiveFilters
  search: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:filters': [filters: ActiveFilters]
  'update:search': [search: string]
}>()

// Local search ref for debouncing
const localSearch = ref(props.search)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.search, (val) => {
  localSearch.value = val
})

function onSearchInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  localSearch.value = value
  if (debounceTimer !== null) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('update:search', value)
  }, 300)
}

const customDays = ref<number | null>(null)

// Filter option lists
const statusValues: Array<'enabled' | 'disabled'> = ['enabled', 'disabled']
const paymentValues: Array<'monthly' | 'percentage'> = ['monthly', 'percentage']
const cannedInactiveDays = [1, 7, 30]

// Emit helpers
function applyStatusFilter(value: 'enabled' | 'disabled'): void {
  emit('update:filters', { ...props.filters, status: value })
}

function applyPaymentFilter(value: 'monthly' | 'percentage'): void {
  emit('update:filters', { ...props.filters, paymentMode: value })
}

function applyInactiveFilter(days: number): void {
  emit('update:filters', { ...props.filters, inactiveDays: days })
  customDays.value = null
}

function applyCustomInactiveFilter(): void {
  if (!customDays.value || customDays.value < 1) return
  applyInactiveFilter(customDays.value)
}

function removeFilter(key: keyof ActiveFilters): void {
  const updated = { ...props.filters }
  delete updated[key]
  emit('update:filters', updated)
}
</script>

<style scoped>
.filters-search-input {
  max-width: 260px;
  flex-grow: 1;
}

.filter-clear {
  font-weight: bold;
  line-height: 1;
  cursor: pointer;
  opacity: 0.75;
}

.filter-clear:hover {
  opacity: 1;
}
</style>
