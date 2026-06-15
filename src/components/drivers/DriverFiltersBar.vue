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

    <div class="dropdown filter-dropdown">
      <button
        type="button"
        class="btn btn-sm dropdown-toggle filter-control"
        :class="{ 'is-active': filters.status !== undefined }"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span class="filter-control__copy">
          <span class="filter-control__title">{{ t('drivers.filters.filter_status') }}</span>
          <span class="filter-control__value">{{ filters.status !== undefined ? statusLabel(filters.status) : allLabel }}</span>
        </span>
        <span
          v-if="filters.status !== undefined"
          class="filter-clear"
          role="button"
          :aria-label="t('common.actions.delete')"
          @click.stop="removeFilter('status')"
        >&times;</span>
      </button>
      <ul class="dropdown-menu shadow-sm filter-menu">
        <li>
          <button
            class="dropdown-item"
            type="button"
            @click="removeFilter('status')"
          >
            {{ allLabel }}
          </button>
        </li>
        <li v-for="val in statusValues" :key="val">
          <button
            class="dropdown-item"
            :class="{ active: filters.status === val }"
            type="button"
            @click="applyStatusFilter(val)"
          >
            {{ statusLabel(val) }}
          </button>
        </li>
      </ul>
    </div>

    <div class="dropdown filter-dropdown">
      <button
        type="button"
        class="btn btn-sm dropdown-toggle filter-control"
        :class="{ 'is-active': filters.paymentMode !== undefined }"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span class="filter-control__copy">
          <span class="filter-control__title">{{ t('drivers.filters.filter_payment') }}</span>
          <span class="filter-control__value">
            {{ filters.paymentMode !== undefined ? paymentLabel(filters.paymentMode) : allLabel }}
          </span>
        </span>
        <span
          v-if="filters.paymentMode !== undefined"
          class="filter-clear"
          role="button"
          :aria-label="t('common.actions.delete')"
          @click.stop="removeFilter('paymentMode')"
        >&times;</span>
      </button>
      <ul class="dropdown-menu shadow-sm filter-menu">
        <li>
          <button
            class="dropdown-item"
            type="button"
            @click="removeFilter('paymentMode')"
          >
            {{ allLabel }}
          </button>
        </li>
        <li v-for="val in paymentValues" :key="val">
          <button
            class="dropdown-item"
            :class="{ active: filters.paymentMode === val }"
            type="button"
            @click="applyPaymentFilter(val)"
          >
            {{ paymentLabel(val) }}
          </button>
        </li>
      </ul>
    </div>

    <div class="dropdown filter-dropdown">
      <button
        type="button"
        class="btn btn-sm dropdown-toggle filter-control"
        :class="{ 'is-active': filters.inactiveDays !== undefined }"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span class="filter-control__copy">
          <span class="filter-control__title">{{ t('drivers.filters.filter_inactive') }}</span>
          <span class="filter-control__value">
            {{ filters.inactiveDays !== undefined ? inactiveLabel(filters.inactiveDays) : inactiveNoneLabel }}
          </span>
        </span>
        <span
          v-if="filters.inactiveDays !== undefined"
          class="filter-clear"
          role="button"
          :aria-label="t('common.actions.delete')"
          @click.stop="removeFilter('inactiveDays')"
        >&times;</span>
      </button>
      <ul class="dropdown-menu shadow-sm filter-menu">
        <li>
          <button
            class="dropdown-item"
            type="button"
            @click="removeFilter('inactiveDays')"
          >
            {{ inactiveNoneLabel }}
          </button>
        </li>
        <li v-for="days in cannedInactiveDays" :key="days">
          <button
            class="dropdown-item"
            :class="{ active: filters.inactiveDays === days }"
            type="button"
            @click="applyInactiveFilter(days)"
          >
            {{ inactiveLabel(days) }}
          </button>
        </li>
        <li><hr class="dropdown-divider filter-menu__divider" /></li>
        <li>
          <div class="filter-menu__section">
            <label class="form-label filter-menu__label mb-0">{{ customLabel }}</label>
            <div class="filter-menu__custom">
              <input
                type="number"
                class="form-control form-control-sm filter-menu__input"
                min="1"
                inputmode="numeric"
                v-model.number="customDays"
                :placeholder="customPlaceholder"
                @keydown.enter.stop="applyCustomInactiveFilter"
                @click.stop
              />
              <button
                class="btn btn-sm btn-primary filter-menu__action"
                type="button"
                :disabled="!customDays || customDays < 1"
                @click.stop="applyCustomInactiveFilter"
              >
                {{ addLabel }}
              </button>
            </div>
          </div>
        </li>
      </ul>
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

const statusValues: Array<'enabled' | 'disabled'> = ['enabled', 'disabled']
const paymentValues: Array<'monthly' | 'percentage'> = ['monthly', 'percentage']
const cannedInactiveDays = [1, 7, 30]
const allLabel = computed(() => fallbackLabel('common.placeholders.all', 'All'))
const addLabel = computed(() => fallbackLabel('common.actions.add', 'Add'))
const customLabel = computed(() => fallbackLabel('drivers.filters.custom', 'Custom'))
const customPlaceholder = computed(() => fallbackLabel('drivers.filters.custom_placeholder', 'Days'))
const inactiveNoneLabel = computed(() => fallbackLabel('drivers.filters.inactive_none', 'None'))
const searchPlaceholder = computed(() => fallbackLabel('common.placeholders.search', 'Search'))
const customDays = ref<number | null>(null)

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
  align-items: stretch;
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

.filter-dropdown {
  flex: 0 1 13.25rem;
  min-width: 12rem;
  max-width: 14rem;
  display: flex;
}

.filter-control {
  width: 100%;
  height: var(--filters-control-height);
  padding: 0.55rem 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid var(--filters-border);
  border-radius: 0.9rem;
  background: var(--filters-surface);
  color: var(--filters-text);
  text-align: left;
  box-shadow: var(--filters-shadow);
  box-sizing: border-box;
}

.filter-control:hover,
.filter-control:focus,
.filter-control:active,
.filter-control.show {
  border-color: var(--filters-border);
  background: var(--filters-surface-hover);
  color: var(--filters-text);
  box-shadow: var(--filters-shadow);
}

.filter-control.is-active {
  border-color: var(--filters-active-border);
  background: var(--filters-active-bg);
}

.filter-control__copy {
  min-width: 0;
  display: flex;
  flex: 1;
  align-items: baseline;
  gap: 0.5rem;
}

.filter-control__title {
  color: var(--filters-muted);
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.1;
  text-transform: uppercase;
}

.filter-control__value {
  overflow: hidden;
  color: var(--filters-text);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: uppercase;
}

.filter-control.is-active .filter-control__title {
  color: var(--filters-active-text);
}

.filter-control::after {
  flex-shrink: 0;
  margin-left: 0.25rem;
}

.filter-clear {
  flex-shrink: 0;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  opacity: 0.8;
}

.filter-clear:hover {
  opacity: 1;
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
  .search-control,
  .filter-dropdown {
    flex-basis: 100%;
    max-width: 100%;
  }
}
</style>
