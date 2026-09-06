<template>
  <div class="payaudit-filters-bar">
    <div class="row g-3">
      <div class="col-12 col-sm-6 col-lg-3">
        <label class="form-label fw-bold payaudit-filters-bar__label">
          {{ fallbackLabel('drivers.payments_audit.filters.filter_period', 'Period') }}
        </label>
        <select
          class="form-select form-select-sm"
          name="period"
          :aria-label="fallbackLabel('drivers.payments_audit.filters.filter_period', 'Period')"
          :value="filters.period ?? ''"
          @change="onPeriodChange"
        >
          <option value="">{{ periodAllLabel }}</option>
          <option v-for="value in periodOptionsList" :key="value" :value="value">
            {{ periodLabel(value) }}
          </option>
        </select>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <label class="form-label fw-bold payaudit-filters-bar__label">
          {{ fallbackLabel('drivers.payments_audit.filters.filter_created_from', 'Registered from') }}
        </label>
        <input
          type="date"
          class="form-control form-control-sm"
          name="createdFrom"
          :value="filters.createdFrom ?? ''"
          @change="onCreatedFromChange"
        />
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <label class="form-label fw-bold payaudit-filters-bar__label">
          {{ fallbackLabel('drivers.payments_audit.filters.filter_created_to', 'Registered to') }}
        </label>
        <input
          type="date"
          class="form-control form-control-sm"
          name="createdTo"
          :value="filters.createdTo ?? ''"
          @change="onCreatedToChange"
        />
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <label class="form-label fw-bold payaudit-filters-bar__label">
          {{ fallbackLabel('drivers.payments_audit.filters.filter_driver_search', 'Search driver') }}
        </label>
        <div class="payaudit-filters-bar__search">
          <em class="fas fa-search payaudit-filters-bar__search-icon" aria-hidden="true"></em>
          <input
            type="text"
            class="form-control form-control-sm payaudit-filters-bar__search-input"
            :placeholder="searchPlaceholder"
            :aria-label="searchPlaceholder"
            :value="localSearch"
            @input="onSearchInput"
          />
        </div>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <label class="form-label fw-bold payaudit-filters-bar__label">
          {{ fallbackLabel('drivers.payments_audit.filters.filter_actor', 'Registered by') }}
        </label>
        <select
          class="form-select form-select-sm"
          name="createdByUid"
          :aria-label="fallbackLabel('drivers.payments_audit.filters.filter_actor', 'Registered by')"
          :value="filters.createdByUid ?? ''"
          @change="onActorChange"
        >
          <option value="">{{ allLabel }}</option>
          <option v-for="actor in actors" :key="actor.uid" :value="actor.uid">
            {{ actor.name }}
          </option>
        </select>
      </div>

      <div v-if="filters.type === 'monthly'" class="col-12 col-sm-6 col-lg-3">
        <label class="form-label fw-bold payaudit-filters-bar__label">
          {{ fallbackLabel('drivers.payments_audit.filters.filter_status', 'Status') }}
        </label>
        <select
          class="form-select form-select-sm"
          name="status"
          :aria-label="fallbackLabel('drivers.payments_audit.filters.filter_status', 'Status')"
          :value="filters.status ?? ''"
          @change="onStatusChange"
        >
          <option value="">{{ allLabel }}</option>
          <option value="active">{{ statusOptionLabel('active') }}</option>
          <option value="voided">{{ statusOptionLabel('voided') }}</option>
        </select>
      </div>

      <div v-if="filters.type === 'monthly'" class="col-12 col-sm-6 col-lg-3">
        <label class="form-label fw-bold payaudit-filters-bar__label">
          {{ fallbackLabel('drivers.payments_audit.filters.filter_amount_threshold', 'Amount threshold') }}
        </label>
        <input
          type="number"
          min="0"
          class="form-control form-control-sm"
          name="amountThreshold"
          :value="filters.amountThreshold ?? ''"
          @change="onAmountThresholdChange"
        />
      </div>

      <div v-if="filters.type === 'recharges'" class="col-12 col-sm-6 col-lg-3">
        <label class="form-label fw-bold payaudit-filters-bar__label">
          {{ fallbackLabel('drivers.payments_audit.filters.filter_min_amount', 'Min amount') }}
        </label>
        <input
          type="number"
          min="0"
          class="form-control form-control-sm"
          name="minAmount"
          :value="filters.minAmount ?? ''"
          @change="onMinAmountChange"
        />
      </div>

      <div v-if="filters.type === 'recharges'" class="col-12 col-sm-6 col-lg-3">
        <label class="form-label fw-bold payaudit-filters-bar__label">
          {{ fallbackLabel('drivers.payments_audit.filters.filter_max_amount', 'Max amount') }}
        </label>
        <input
          type="number"
          min="0"
          class="form-control form-control-sm"
          name="maxAmount"
          :value="filters.maxAmount ?? ''"
          @change="onMaxAmountChange"
        />
      </div>
    </div>

    <div class="mt-3">
      <label class="form-label fw-bold payaudit-filters-bar__label d-block">
        {{ fallbackLabel('drivers.payments_audit.filters.filter_anomalies', 'Anomalies') }}
      </label>
      <div class="d-flex flex-wrap gap-2">
        <button
          v-for="flag in anomalyFlags"
          :key="flag"
          type="button"
          class="btn btn-sm payaudit-filters-bar__pill"
          :class="{ 'payaudit-filters-bar__pill--active': isAnomalyActive(flag) }"
          @click="toggleAnomaly(flag)"
        >
          {{ anomalyLabel(flag) }}
        </button>
      </div>
    </div>

    <div v-if="hasActiveFilters" class="mt-3">
      <button
        type="button"
        class="btn btn-link btn-sm p-0 payaudit-filters-bar__clear"
        @click="onClearFilters"
      >
        <em class="fas fa-times me-1" aria-hidden="true"></em
        >{{ fallbackLabel('drivers.payments_audit.filters.clear_filters', 'Clear filters') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PaymentsAuditFilters } from '@/types/PaymentsAuditFilters'
import type { AuditActor, PaymentsAuditAnomalyFlag } from '@/types/PaymentsAuditRow'
import PaymentsAuditRepository from '@/repositories/PaymentsAuditRepository'
import MonthlyPaymentSettingsRepository from '@/repositories/MonthlyPaymentSettingsRepository'
import {
  fallbackLabel as fallbackLabelHelper,
  periodLabel as periodLabelHelper,
  periodOptions as periodOptionsHelper,
} from '@/helpers/driverFilterLabels'

interface Props {
  filters: PaymentsAuditFilters
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:filters': [filters: PaymentsAuditFilters]
}>()
const { t, locale } = useI18n()

const localSearch = ref(props.filters.driverSearch ?? '')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const actors = ref<AuditActor[]>([])
let suggestedAmount: number | null = null
let suggestedAmountApplied = false

const monthlyAnomalyFlags: PaymentsAuditAnomalyFlag[] = ['duplicate', 'atypical', 'outOfPeriod', 'voided']
const rechargesAnomalyFlags: PaymentsAuditAnomalyFlag[] = ['duplicate', 'atypical']

const anomalyFlags = computed(() =>
  props.filters.type === 'monthly' ? monthlyAnomalyFlags : rechargesAnomalyFlags
)

const allLabel = computed(() => fallbackLabel('common.placeholders.all', 'All'))
const periodAllLabel = computed(() =>
  fallbackLabel('drivers.payments_audit.filters.period_all', 'All periods')
)
const periodOptionsList = computed(() => periodOptionsHelper(props.filters.period))
const searchPlaceholder = computed(() =>
  fallbackLabel('drivers.payments_audit.filters.placeholder_driver_search', 'Name, document or plate')
)

const hasActiveFilters = computed(() => {
  const f = props.filters
  return Boolean(
    f.period ||
      f.createdFrom ||
      f.createdTo ||
      f.driverSearch ||
      f.createdByUid ||
      f.status ||
      f.amountThreshold !== undefined ||
      f.minAmount !== undefined ||
      f.maxAmount !== undefined ||
      f.anomaly.length > 0 ||
      localSearch.value !== ''
  )
})

watch(
  () => props.filters.type,
  (type) => {
    void loadActors()
    if (type === 'monthly') {
      void ensureSuggestedAmount()
    }
  },
  { immediate: true }
)

watch(
  () => props.filters.driverSearch,
  (value) => {
    localSearch.value = value ?? ''
  }
)

async function loadActors(): Promise<void> {
  actors.value = await PaymentsAuditRepository.listActors(props.filters.type)
}

async function ensureSuggestedAmount(): Promise<void> {
  if (suggestedAmount === null) {
    try {
      const settings = await MonthlyPaymentSettingsRepository.get()
      suggestedAmount = settings.suggested_amount
    } catch {
      return
    }
  }
  if (
    !suggestedAmountApplied &&
    props.filters.type === 'monthly' &&
    props.filters.amountThreshold === undefined &&
    suggestedAmount
  ) {
    suggestedAmountApplied = true
    updateFilters((next) => {
      next.amountThreshold = suggestedAmount as number
    })
  }
}

function updateFilters(mutator: (next: PaymentsAuditFilters) => void): void {
  const next: PaymentsAuditFilters = { ...props.filters, anomaly: [...props.filters.anomaly] }
  mutator(next)
  emit('update:filters', next)
}

function fallbackLabel(key: string, fallback: string, params?: Record<string, number>): string {
  return fallbackLabelHelper(t, key, fallback, params)
}

function periodLabel(period: string): string {
  return periodLabelHelper(period, locale.value)
}

function anomalyLabel(flag: PaymentsAuditAnomalyFlag): string {
  if (flag === 'duplicate' && props.filters.type === 'recharges') {
    return fallbackLabel('drivers.payments_audit.anomalies.possible_duplicate', 'Possible duplicate')
  }
  const keyMap: Record<PaymentsAuditAnomalyFlag, string> = {
    duplicate: 'duplicate',
    atypical: 'atypical',
    outOfPeriod: 'out_of_period',
    voided: 'voided',
  }
  return fallbackLabel(`drivers.payments_audit.anomalies.${keyMap[flag]}`, flag)
}

function statusOptionLabel(value: 'active' | 'voided'): string {
  if (value === 'voided') {
    return fallbackLabel(
      'drivers.monthly_payments.badge_voided',
      locale.value === 'es' ? 'Anulado' : 'Voided'
    )
  }
  return locale.value === 'es' ? 'Activo' : 'Active'
}

function isAnomalyActive(flag: PaymentsAuditAnomalyFlag): boolean {
  return props.filters.anomaly.includes(flag)
}

function toggleAnomaly(flag: PaymentsAuditAnomalyFlag): void {
  updateFilters((next) => {
    const set = new Set(next.anomaly)
    if (set.has(flag)) {
      set.delete(flag)
    } else {
      set.add(flag)
    }
    next.anomaly = Array.from(set)
  })
}

function onPeriodChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value
  updateFilters((next) => {
    if (value) {
      next.period = value
    } else {
      delete next.period
    }
  })
}

function onCreatedFromChange(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  updateFilters((next) => {
    if (value) {
      next.createdFrom = value
    } else {
      delete next.createdFrom
    }
  })
}

function onCreatedToChange(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  updateFilters((next) => {
    if (value) {
      next.createdTo = value
    } else {
      delete next.createdTo
    }
  })
}

function onActorChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value
  updateFilters((next) => {
    if (value) {
      next.createdByUid = value
    } else {
      delete next.createdByUid
    }
  })
}

function onStatusChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value
  updateFilters((next) => {
    if (value === 'active' || value === 'voided') {
      next.status = value
    } else {
      delete next.status
    }
  })
}

function onAmountThresholdChange(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  updateFilters((next) => {
    if (value === '') {
      delete next.amountThreshold
    } else {
      next.amountThreshold = Number(value)
    }
  })
}

function onMinAmountChange(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  updateFilters((next) => {
    if (value === '') {
      delete next.minAmount
    } else {
      next.minAmount = Number(value)
    }
  })
}

function onMaxAmountChange(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  updateFilters((next) => {
    if (value === '') {
      delete next.maxAmount
    } else {
      next.maxAmount = Number(value)
    }
  })
}

function onSearchInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  localSearch.value = value
  if (debounceTimer !== null) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    updateFilters((next) => {
      if (value) {
        next.driverSearch = value
      } else {
        delete next.driverSearch
      }
    })
  }, 300)
}

function onClearFilters(): void {
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  localSearch.value = ''
  emit('update:filters', { type: props.filters.type, view: props.filters.view, anomaly: [] })
}
</script>

<style scoped>
.payaudit-filters-bar {
  --payaudit-filter-label: var(--text-heading);
  --payaudit-filter-muted: var(--text-secondary);
  --payaudit-pill-bg: var(--surface-input);
  --payaudit-pill-border: var(--border-color);
  --payaudit-pill-color: var(--text-secondary);
  --payaudit-pill-active-bg: #cb0c9f;
  --payaudit-pill-active-color: #fff;
}
body.dark-version .payaudit-filters-bar {
  --payaudit-filter-label: var(--text-heading);
  --payaudit-filter-muted: var(--text-secondary);
  --payaudit-pill-bg: var(--surface-input);
  --payaudit-pill-border: var(--border-color);
  --payaudit-pill-color: var(--text-secondary);
  --payaudit-pill-active-bg: #cb0c9f;
  --payaudit-pill-active-color: #fff;
}

.payaudit-filters-bar__label {
  color: var(--payaudit-filter-label);
  margin-bottom: 0.35rem;
}

.payaudit-filters-bar__search {
  position: relative;
}

.payaudit-filters-bar__search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--payaudit-filter-muted);
  font-size: 0.8rem;
  pointer-events: none;
}

.payaudit-filters-bar__search-input {
  padding-left: 2rem;
}

.payaudit-filters-bar__pill {
  border: 1px solid var(--payaudit-pill-border);
  background: var(--payaudit-pill-bg);
  color: var(--payaudit-pill-color);
  border-radius: var(--radius-md, 0.5rem);
  padding: 0.35rem 0.85rem;
  font-weight: 600;
}

.payaudit-filters-bar__pill--active {
  background: var(--payaudit-pill-active-bg);
  border-color: var(--payaudit-pill-active-bg);
  color: var(--payaudit-pill-active-color);
}

.payaudit-filters-bar__clear {
  font-weight: 600;
  text-decoration: none;
}
</style>
