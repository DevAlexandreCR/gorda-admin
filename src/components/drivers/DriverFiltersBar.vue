<template>
  <div class="driver-filters-bar">
    <div class="search-control-group">
      <div class="search-control">
        <em class="fas fa-search search-control__icon" aria-hidden="true"></em>
        <input
          type="text"
          class="form-control search-control__input"
          :placeholder="searchPlaceholder"
          :aria-label="searchPlaceholder"
          :value="localSearch"
          @input="onSearchInput"
        />
      </div>
    </div>

    <label class="filter-control">
      <span class="filter-control__label">
        {{ fallbackLabel('drivers.filters.filter_status', 'Status') }}
      </span>
      <select
        class="form-select filter-control__select filter-control__select--status"
        name="status"
        :aria-label="fallbackLabel('drivers.filters.filter_status', 'Status')"
        :value="filters.status ?? ''"
        @change="onStatusChange"
      >
        <option value="">{{ allLabel }}</option>
        <option v-for="value in statusValues" :key="value" :value="value">
          {{ statusLabel(value) }}
        </option>
      </select>
    </label>

    <label class="filter-control">
      <span class="filter-control__label">
        {{ fallbackLabel('drivers.filters.filter_payment', 'Payment') }}
      </span>
      <select
        class="form-select filter-control__select filter-control__select--payment"
        name="paymentMode"
        :aria-label="fallbackLabel('drivers.filters.filter_payment', 'Payment')"
        :value="filters.paymentMode ?? ''"
        @change="onPaymentChange"
      >
        <option value="">{{ allLabel }}</option>
        <option v-for="value in paymentValues" :key="value" :value="value">
          {{ paymentLabel(value) }}
        </option>
      </select>
    </label>

    <label class="filter-control">
      <span class="filter-control__label">
        {{ fallbackLabel('drivers.filters.filter_inactive', 'Inactivity') }}
      </span>
      <select
        class="form-select filter-control__select filter-control__select--inactive"
        name="inactiveDays"
        :aria-label="fallbackLabel('drivers.filters.filter_inactive', 'Inactivity')"
        :value="filters.inactiveDays?.toString() ?? ''"
        @change="onInactiveChange"
      >
        <option value="">{{ inactiveNoneLabel }}</option>
        <option v-for="days in inactiveOptions" :key="days" :value="days.toString()">
          {{ inactiveLabel(days) }}
        </option>
      </select>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ActiveFilters } from '@/types/ActiveFilters'
import { useI18n } from 'vue-i18n'

interface Props {
  filters: ActiveFilters
  search: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:filters': [filters: ActiveFilters]
  'update:search': [search: string]
}>()
const { t } = useI18n()

const localSearch = ref(props.search)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const statusValues: Array<'enabled' | 'disabled'> = ['enabled', 'disabled']
const paymentValues: Array<'monthly' | 'percentage'> = ['monthly', 'percentage']
const cannedInactiveDays = [1, 7, 30]

const searchPlaceholder = computed(() =>
  fallbackLabel('drivers.placeholders.search', 'Search')
)
const allLabel = computed(() => fallbackLabel('common.placeholders.all', 'All'))
const inactiveNoneLabel = computed(() =>
  fallbackLabel('drivers.filters.inactive_none', 'None')
)
const inactiveOptions = computed(() => {
  const values = new Set(cannedInactiveDays)
  const current = props.filters.inactiveDays
  if (current && current > 0) {
    values.add(current)
  }
  return Array.from(values).sort((a, b) => a - b)
})

watch(() => props.search, (value) => {
  localSearch.value = value
})

function onSearchInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  localSearch.value = value
  if (debounceTimer !== null) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('update:search', value)
  }, 300)
}

function fallbackLabel(key: string, fallback: string, params?: Record<string, number>): string {
  const translated = t(key, params ?? {})
  return translated === key ? fallback : translated
}

function statusLabel(value: 'enabled' | 'disabled'): string {
  return fallbackLabel(`drivers.filters.status_values.${value}`, value)
}

function paymentLabel(value: 'monthly' | 'percentage'): string {
  return fallbackLabel(`drivers.filters.payment_values.${value}`, value)
}

function inactiveLabel(days: number): string {
  return fallbackLabel('drivers.filters.inactive_days', `${days}d`, { days })
}

function onStatusChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value
  const nextFilters = { ...props.filters }
  if (value === 'enabled' || value === 'disabled') {
    nextFilters.status = value
  } else {
    delete nextFilters.status
  }
  emit('update:filters', nextFilters)
}

function onPaymentChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value
  const nextFilters = { ...props.filters }
  if (value === 'monthly' || value === 'percentage') {
    nextFilters.paymentMode = value
  } else {
    delete nextFilters.paymentMode
  }
  emit('update:filters', nextFilters)
}

function onInactiveChange(event: Event): void {
  const value = Number((event.target as HTMLSelectElement).value)
  const nextFilters = { ...props.filters }
  if (value > 0) {
    nextFilters.inactiveDays = value
  } else {
    delete nextFilters.inactiveDays
  }
  emit('update:filters', nextFilters)
}
</script>

<style scoped>
.driver-filters-bar {
  --filters-control-height: 3.15rem;
  --filters-label-offset: 1.6rem;
  --filters-surface: var(--drivers-filter-surface);
  --filters-border: var(--drivers-filter-border);
  --filters-text: var(--drivers-filter-text);
  --filters-muted: var(--drivers-filter-muted);
  --filters-shadow: var(--drivers-filter-shadow);
  --filters-active-border: var(--drivers-filter-active-border);
  --filters-focus-ring: var(--drivers-filter-focus-ring);
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: flex-start;
  padding-top: var(--filters-label-offset);
}

.search-control-group {
  flex: 1 1 18rem;
  max-width: 23rem;
}

.search-control {
  height: var(--filters-control-height);
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0 0.95rem;
  border: 1px solid var(--filters-border);
  border-radius: 0.9rem;
  background: var(--filters-surface);
  box-shadow: var(--filters-shadow);
  box-sizing: border-box;
}

.search-control:focus-within,
.filter-control__select:focus {
  border-color: var(--filters-active-border);
  box-shadow: 0 0 0 0.2rem var(--filters-focus-ring);
}

.search-control__icon {
  color: var(--filters-muted);
  font-size: 0.9rem;
}

.search-control__input,
.search-control__input:focus {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--filters-text);
  box-shadow: none;
}

.search-control__input::placeholder {
  color: var(--filters-muted);
}

.filter-control {
  flex: 0 1 12rem;
  min-width: 10rem;
  position: relative;
  display: block;
}

.filter-control__label {
  position: absolute;
  left: 0;
  bottom: calc(100% + 0.55rem);
  display: flex;
  align-items: flex-end;
  color: var(--filters-muted);
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.filter-control__select,
.filter-control__select:focus {
  height: var(--filters-control-height);
  min-height: var(--filters-control-height);
  border: 1px solid var(--filters-border);
  border-radius: 0.9rem;
  background-color: var(--filters-surface);
  color: var(--filters-text);
  box-shadow: var(--filters-shadow);
  font-weight: 600;
}

@media (max-width: 1199.98px) {
  .driver-filters-bar {
    gap: 0.65rem;
  }

  .search-control {
    max-width: 100%;
  }

  .search-control-group {
    max-width: 100%;
  }
}

@media (max-width: 767.98px) {
  .search-control-group,
  .filter-control {
    flex-basis: 100%;
    max-width: 100%;
  }
}
</style>
