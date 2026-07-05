<template>
  <div class="driver-filters-bar">
    <div class="row g-3">
      <div class="col-12 col-sm-6 col-lg-3">
        <label class="form-label fw-bold driver-filters-bar__label">
          {{ fallbackLabel('drivers.filters.filter_search', 'Buscar') }}
        </label>
        <div class="driver-filters-bar__search">
          <em class="fas fa-search driver-filters-bar__search-icon" aria-hidden="true"></em>
          <input
            type="text"
            class="form-control form-control-sm driver-filters-bar__search-input"
            :placeholder="searchPlaceholder"
            :aria-label="searchPlaceholder"
            :value="localSearch"
            @input="onSearchInput"
          />
        </div>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <label class="form-label fw-bold driver-filters-bar__label">
          {{ fallbackLabel('drivers.filters.filter_status', 'Status') }}
        </label>
        <select
          class="form-select form-select-sm"
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
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <label class="form-label fw-bold driver-filters-bar__label">
          {{ fallbackLabel('drivers.filters.filter_payment', 'Payment') }}
        </label>
        <select
          class="form-select form-select-sm"
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
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <label class="form-label fw-bold driver-filters-bar__label">
          {{ fallbackLabel('drivers.filters.filter_payment_status', 'Payment status') }}
        </label>
        <select
          class="form-select form-select-sm"
          name="paymentStatus"
          :aria-label="fallbackLabel('drivers.filters.filter_payment_status', 'Payment status')"
          :value="filters.paymentStatus ?? ''"
          :disabled="paymentStatusDisabled"
          :title="paymentStatusDisabled ? paymentStatusHint : undefined"
          @change="onPaymentStatusChange"
        >
          <option value="">{{ allLabel }}</option>
          <option v-for="value in paymentStatusValues" :key="value" :value="value">
            {{ paymentStatusLabel(value) }}
          </option>
        </select>
      </div>

      <div v-if="filters.paymentStatus" class="col-12 col-sm-6 col-lg-3">
        <label class="form-label fw-bold driver-filters-bar__label">
          {{ fallbackLabel('drivers.filters.filter_period', 'Period') }}
        </label>
        <select
          class="form-select form-select-sm"
          name="period"
          :aria-label="fallbackLabel('drivers.filters.filter_period', 'Period')"
          :value="filters.period ?? defaultPeriod"
          @change="onPeriodChange"
        >
          <option v-for="value in periodOptions" :key="value" :value="value">
            {{ periodLabel(value) }}
          </option>
        </select>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <label class="form-label fw-bold driver-filters-bar__label">
          {{ fallbackLabel('drivers.filters.filter_inactive', 'Inactivity') }}
        </label>
        <select
          class="form-select form-select-sm"
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
      </div>
    </div>

    <div v-if="hasActiveFilters" class="mt-3">
      <button
        type="button"
        class="btn btn-link btn-sm p-0 driver-filters-bar__clear"
        @click="onClearFilters"
      >
        <em class="fas fa-times me-1" aria-hidden="true"></em
        >{{ fallbackLabel('common.actions.clear_filters', 'Limpiar filtros') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ActiveFilters } from '@/types/ActiveFilters'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/es'

dayjs.extend(utc)
dayjs.extend(timezone)

const BOGOTA_TIMEZONE = 'America/Bogota'
const PERIOD_HISTORY_MONTHS = 12

interface Props {
  filters: ActiveFilters
  search: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:filters': [filters: ActiveFilters]
  'update:search': [search: string]
}>()
const { t, locale } = useI18n()

const localSearch = ref(props.search)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const statusValues: Array<'enabled' | 'disabled'> = ['enabled', 'disabled']
const paymentValues: Array<'monthly' | 'percentage'> = ['monthly', 'percentage']
const paymentStatusValues: Array<'paid' | 'pending'> = ['paid', 'pending']
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

const paymentStatusDisabled = computed(() => props.filters.paymentMode === 'percentage')
const paymentStatusHint = computed(() =>
  fallbackLabel(
    'drivers.filters.payment_status_percentage_hint',
    'Not applicable for percentage-paid drivers'
  )
)

const hasActiveFilters = computed(() =>
  Object.keys(props.filters).length > 0 || localSearch.value !== ''
)

function currentBogotaPeriod(): string {
  return dayjs().tz(BOGOTA_TIMEZONE).format('YYYY-MM')
}

const defaultPeriod = computed(() => currentBogotaPeriod())

const periodOptions = computed(() => {
  const current = dayjs().tz(BOGOTA_TIMEZONE)
  const periods: string[] = []
  for (let i = 0; i < PERIOD_HISTORY_MONTHS; i++) {
    periods.push(current.subtract(i, 'month').format('YYYY-MM'))
  }
  const selected = props.filters.period
  if (selected && !periods.includes(selected)) {
    periods.push(selected)
    periods.sort((a, b) => (a > b ? -1 : 1))
  }
  return periods
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

function paymentStatusLabel(value: 'paid' | 'pending'): string {
  return fallbackLabel(`drivers.filters.payment_status_values.${value}`, value)
}

function periodLabel(period: string): string {
  const dayjsLocale = locale.value === 'es' ? 'es' : 'en'
  const value = dayjs(`${period}-01`).locale(dayjsLocale).format('MMMM YYYY')
  return value.charAt(0).toUpperCase() + value.slice(1)
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
  if (nextFilters.paymentMode === 'percentage') {
    delete nextFilters.paymentStatus
    delete nextFilters.period
  }
  emit('update:filters', nextFilters)
}

function onPaymentStatusChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value
  const nextFilters = { ...props.filters }
  if (value === 'paid' || value === 'pending') {
    nextFilters.paymentStatus = value
    if (!nextFilters.period) {
      nextFilters.period = currentBogotaPeriod()
    }
  } else {
    delete nextFilters.paymentStatus
    delete nextFilters.period
  }
  emit('update:filters', nextFilters)
}

function onPeriodChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value
  const nextFilters = { ...props.filters }
  if (value) {
    nextFilters.period = value
  } else {
    delete nextFilters.period
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

function onClearFilters(): void {
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  localSearch.value = ''
  emit('update:search', '')
  emit('update:filters', {})
}
</script>

<style scoped>
.driver-filters-bar__label {
  color: var(--text-heading);
  margin-bottom: 0.35rem;
}

.driver-filters-bar__search {
  position: relative;
}

.driver-filters-bar__search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--drivers-filter-muted);
  font-size: 0.8rem;
  pointer-events: none;
}

.driver-filters-bar__search-input {
  padding-left: 2rem;
}

.driver-filters-bar__clear {
  font-weight: 600;
  text-decoration: none;
}
</style>
