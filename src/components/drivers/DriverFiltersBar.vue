<template>
  <div class="driver-filters-bar">
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

    <!-- Active filter chips -->
    <span
      v-if="filters.status !== undefined"
      class="badge bg-primary d-flex align-items-center gap-1"
    >
      {{ statusChipLabel(filters.status) }}
      <button
        type="button"
        class="btn-close btn-close-white"
        style="font-size: 0.6rem;"
        :aria-label="t('common.actions.delete')"
        @click="removeFilter('status')"
      ></button>
    </span>

    <span
      v-if="filters.paymentMode !== undefined"
      class="badge bg-primary d-flex align-items-center gap-1"
    >
      {{ paymentChipLabel(filters.paymentMode) }}
      <button
        type="button"
        class="btn-close btn-close-white"
        style="font-size: 0.6rem;"
        :aria-label="t('common.actions.delete')"
        @click="removeFilter('paymentMode')"
      ></button>
    </span>

    <span
      v-if="filters.inactiveDays !== undefined"
      class="badge bg-primary d-flex align-items-center gap-1"
    >
      {{ inactiveChipLabel(filters.inactiveDays) }}
      <button
        type="button"
        class="btn-close btn-close-white"
        style="font-size: 0.6rem;"
        :aria-label="t('common.actions.delete')"
        @click="removeFilter('inactiveDays')"
      ></button>
    </span>

    <span
      v-if="filters.needsVehicle"
      class="badge bg-primary d-flex align-items-center gap-1"
    >
      {{ fallbackLabel('drivers.filters.chip_needs_vehicle', 'Needs vehicle') }}
      <button
        type="button"
        class="btn-close btn-close-white"
        style="font-size: 0.6rem;"
        :aria-label="t('common.actions.delete')"
        @click="removeFilter('needsVehicle')"
      ></button>
    </span>

    <!-- + Add filter dropdown (hidden when all filters are active) -->
    <div v-if="availableFilters.length > 0" class="dropdown filter-add-dropdown">
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary dropdown-toggle filter-add-btn"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {{ fallbackLabel('drivers.filters.add_filter', '+ Add filter') }}
      </button>
      <ul class="dropdown-menu shadow-sm filter-menu">
        <li v-for="f in availableFilters" :key="f.key">
          <button
            class="dropdown-item"
            type="button"
            @click="openPicker(f.key)"
          >
            {{ f.label }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Picker panels (shown when openFilter matches) -->
    <div v-if="openFilter === 'status'" class="filter-picker card shadow-sm p-2">
      <p class="filter-picker__title">{{ fallbackLabel('drivers.filters.filter_status', 'Status') }}</p>
      <button
        v-for="val in statusValues"
        :key="val"
        class="dropdown-item"
        type="button"
        @click="applyStatusFilter(val)"
      >
        {{ statusLabel(val) }}
      </button>
      <button class="dropdown-item text-secondary mt-1" type="button" @click="closePicker">
        {{ fallbackLabel('common.actions.cancel', 'Cancel') }}
      </button>
    </div>

    <div v-if="openFilter === 'paymentMode'" class="filter-picker card shadow-sm p-2">
      <p class="filter-picker__title">{{ fallbackLabel('drivers.filters.filter_payment', 'Payment') }}</p>
      <button
        v-for="val in paymentValues"
        :key="val"
        class="dropdown-item"
        type="button"
        @click="applyPaymentFilter(val)"
      >
        {{ paymentLabel(val) }}
      </button>
      <button class="dropdown-item text-secondary mt-1" type="button" @click="closePicker">
        {{ fallbackLabel('common.actions.cancel', 'Cancel') }}
      </button>
    </div>

    <div v-if="openFilter === 'inactiveDays'" class="filter-picker card shadow-sm p-2">
      <p class="filter-picker__title">{{ fallbackLabel('drivers.filters.filter_inactive', 'Inactivity') }}</p>
      <button
        v-for="days in cannedInactiveDays"
        :key="days"
        class="dropdown-item"
        type="button"
        @click="applyInactiveFilter(days)"
      >
        {{ inactiveLabel(days) }}
      </button>
      <hr class="dropdown-divider filter-menu__divider" />
      <div class="filter-menu__section">
        <label class="form-label filter-menu__label mb-0">{{ fallbackLabel('drivers.filters.custom', 'Custom') }}</label>
        <div class="filter-menu__custom">
          <input
            type="number"
            class="form-control form-control-sm filter-menu__input"
            min="1"
            inputmode="numeric"
            v-model.number="customDays"
            :placeholder="fallbackLabel('drivers.filters.custom_placeholder', 'Days')"
            @keydown.enter.stop="applyCustomInactiveFilter"
            @click.stop
          />
          <button
            class="btn btn-sm btn-primary filter-menu__action"
            type="button"
            :disabled="!customDays || customDays < 1"
            @click.stop="applyCustomInactiveFilter"
          >
            {{ fallbackLabel('common.actions.add', 'Add') }}
          </button>
        </div>
      </div>
      <button class="dropdown-item text-secondary mt-1" type="button" @click="closePicker">
        {{ fallbackLabel('common.actions.cancel', 'Cancel') }}
      </button>
    </div>
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

// Local search ref for debouncing
const localSearch = ref(props.search)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Picker state
const openFilter = ref<keyof ActiveFilters | null>(null)

const statusValues: Array<'enabled' | 'disabled'> = ['enabled', 'disabled']
const paymentValues: Array<'monthly' | 'percentage'> = ['monthly', 'percentage']
const cannedInactiveDays = [1, 7, 30]
const customDays = ref<number | null>(null)

const searchPlaceholder = computed(() =>
  fallbackLabel('drivers.placeholders.search', 'Name, email, phone, document, plate...')
)

// Available (not yet active) filters
const allFilterDefs: { key: keyof ActiveFilters; labelKey: string; fallback: string }[] = [
  { key: 'status', labelKey: 'drivers.filters.filter_status', fallback: 'Status' },
  { key: 'paymentMode', labelKey: 'drivers.filters.filter_payment', fallback: 'Payment' },
  { key: 'inactiveDays', labelKey: 'drivers.filters.filter_inactive', fallback: 'Inactivity' },
  { key: 'needsVehicle', labelKey: 'drivers.filters.filter_needs_vehicle', fallback: 'Needs vehicle' },
]

const availableFilters = computed(() =>
  allFilterDefs
    .filter(f => {
      if (f.key === 'status') return props.filters.status === undefined
      if (f.key === 'paymentMode') return props.filters.paymentMode === undefined
      if (f.key === 'inactiveDays') return props.filters.inactiveDays === undefined
      if (f.key === 'needsVehicle') return !props.filters.needsVehicle
      return true
    })
    .map(f => ({ key: f.key, label: fallbackLabel(f.labelKey, f.fallback) }))
)

watch(() => props.search, (val) => {
  localSearch.value = val
})

watch(() => props.filters.inactiveDays, (val) => {
  customDays.value = val && !cannedInactiveDays.includes(val) ? val : null
}, { immediate: true })

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

function statusChipLabel(value: 'enabled' | 'disabled'): string {
  const status = statusLabel(value)
  const key = 'drivers.filters.chip_status'
  const translated = t(key, { value: status })
  return translated === key ? `Estado: ${status}` : translated
}

function paymentChipLabel(value: 'monthly' | 'percentage'): string {
  const payment = paymentLabel(value)
  const key = 'drivers.filters.chip_payment'
  const translated = t(key, { value: payment })
  return translated === key ? `Pago: ${payment}` : translated
}

function inactiveChipLabel(days: number): string {
  return fallbackLabel('drivers.filters.chip_inactive', `Inactive > ${days}d`, { days })
}

// Picker helpers
function openPicker(key: keyof ActiveFilters): void {
  if (key === 'needsVehicle') {
    emit('update:filters', { ...props.filters, needsVehicle: true })
    return
  }
  openFilter.value = key
}

function closePicker(): void {
  openFilter.value = null
}

// Emit helpers
function applyStatusFilter(value: 'enabled' | 'disabled'): void {
  emit('update:filters', { ...props.filters, status: value })
  closePicker()
}

function applyPaymentFilter(value: 'monthly' | 'percentage'): void {
  emit('update:filters', { ...props.filters, paymentMode: value })
  closePicker()
}

function applyInactiveFilter(days: number): void {
  emit('update:filters', { ...props.filters, inactiveDays: days })
  customDays.value = null
  closePicker()
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
.driver-filters-bar {
  --filters-control-height: 3.15rem;
  --filters-surface: var(--drivers-filter-surface);
  --filters-surface-hover: var(--drivers-filter-surface-hover);
  --filters-border: var(--drivers-filter-border);
  --filters-text: var(--drivers-filter-text);
  --filters-muted: var(--drivers-filter-muted);
  --filters-shadow: var(--drivers-filter-shadow);
  --filters-menu-bg: var(--drivers-filter-menu-bg);
  --filters-menu-shadow: var(--drivers-filter-menu-shadow);
  --filters-active-border: var(--drivers-filter-active-border);
  --filters-active-bg: var(--drivers-filter-active-bg);
  --filters-active-text: var(--drivers-filter-active-text);
  --filters-focus-ring: var(--drivers-filter-focus-ring);
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.search-control {
  flex: 1 1 18rem;
  max-width: 23rem;
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

.search-control:focus-within {
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

.filter-add-dropdown {
  position: relative;
}

.filter-add-btn {
  border-radius: 1rem;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.filter-picker {
  position: absolute;
  z-index: 1000;
  min-width: 12rem;
  top: 100%;
  left: 0;
  margin-top: 0.25rem;
}

.filter-picker__title {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--filters-muted);
  margin-bottom: 0.35rem;
}

.filter-menu {
  width: 100%;
  min-width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--filters-border);
  border-radius: 1rem;
  background: var(--filters-menu-bg);
  box-shadow: var(--filters-menu-shadow);
}

.filter-menu .dropdown-item {
  padding: 0.6rem 0.75rem;
  border-radius: 0.75rem;
  color: var(--filters-text);
  font-size: 0.88rem;
  font-weight: 600;
}

.filter-menu .dropdown-item:hover,
.filter-menu .dropdown-item:focus {
  background: var(--filters-surface-hover);
  color: var(--filters-text);
}

.filter-menu .dropdown-item.active,
.filter-menu .dropdown-item:active {
  background: var(--filters-active-bg);
  color: var(--filters-active-text);
}

.filter-menu__divider {
  margin: 0.5rem 0;
  border-color: rgba(71, 85, 105, 0.7);
}

.filter-menu__section {
  padding: 0.35rem;
}

.filter-menu__label {
  display: block;
  color: var(--filters-muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.filter-menu__custom {
  margin-top: 0.5rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.5rem;
}

.filter-menu__input,
.filter-menu__input:focus {
  min-height: 2.45rem;
  border: 1px solid var(--filters-border);
  border-radius: 0.8rem;
  background: var(--filters-surface);
  color: var(--filters-text);
  box-shadow: none;
}

.filter-menu__input::placeholder {
  color: var(--filters-muted);
}

.filter-menu__action {
  min-width: 4.9rem;
  border-radius: 0.8rem;
  font-weight: 700;
}

@media (max-width: 1199.98px) {
  .driver-filters-bar {
    gap: 0.65rem;
  }

  .search-control {
    max-width: 100%;
  }
}

@media (max-width: 767.98px) {
  .search-control {
    flex-basis: 100%;
    max-width: 100%;
  }
}
</style>
