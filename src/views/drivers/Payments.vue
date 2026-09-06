<template>
  <div class="mx-3 payments-view">
    <div class="card mb-4">
      <div class="row m-3 align-items-center">
        <div class="col-auto">
          <h6 class="ms-2 mb-0">{{ $t('drivers.payments_audit.title') }}</h6>
        </div>
        <div class="col"></div>
      </div>

      <!-- Type tabs -->
      <div class="mx-3 mb-3">
        <div class="btn-group" role="group">
          <button
            type="button"
            :class="filters.type === 'monthly' ? 'btn btn-outline-primary active' : 'btn btn-outline-secondary'"
            @click="onTypeChange('monthly')"
          >
            <em class="fas fa-calendar-check me-1" aria-hidden="true"></em>{{ $t('drivers.payments_audit.tabs.monthly') }}
          </button>
          <button
            type="button"
            :class="filters.type === 'recharges' ? 'btn btn-outline-primary active' : 'btn btn-outline-secondary'"
            @click="onTypeChange('recharges')"
          >
            <em class="fas fa-coins me-1" aria-hidden="true"></em>{{ $t('drivers.payments_audit.tabs.recharges') }}
          </button>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="mx-3 mb-2">
        <PaymentsAuditFiltersBar :filters="filters" @update:filters="onFiltersUpdate" />
      </div>

      <!-- Removable driver chip -->
      <div v-if="driverChip" class="mx-3 mb-2">
        <span class="payments-view__chip">
          {{ $t('drivers.payments_audit.driver_chip', { name: driverChip }) }}
          <button
            type="button"
            class="payments-view__chip-close"
            @click="clearDriverChip"
          >
            <em class="fas fa-times" aria-hidden="true"></em>
          </button>
        </span>
      </div>

      <!-- Detalle / Resumen toggle -->
      <div class="mx-3 mb-3 d-flex justify-content-end">
        <div class="btn-group btn-group-sm" role="group">
          <button
            type="button"
            :class="filters.view === 'detail' ? 'btn btn-outline-primary active' : 'btn btn-outline-secondary'"
            @click="onViewChange('detail')"
          >
            {{ $t('drivers.payments_audit.mode.detail') }}
          </button>
          <button
            type="button"
            :class="filters.view === 'summary' ? 'btn btn-outline-primary active' : 'btn btn-outline-secondary'"
            @click="onViewChange('summary')"
          >
            {{ $t('drivers.payments_audit.mode.summary') }}
          </button>
        </div>
      </div>

      <div class="mx-3">
        <PaymentsAuditTable
          v-if="filters.view === 'detail'"
          :type="filters.type"
          :rows="detailRows"
          :totals="totals"
          :loading="loading"
          @void-payment="onVoidPayment"
        />
        <PaymentsAuditSummaryTable
          v-else
          :type="filters.type"
          :rows="summaryRows"
          :totals="totals"
          :sort="sort"
          :loading="loading"
          @sort="onSortChange"
          @select-driver="onSelectDriver"
        />
      </div>

      <div class="container mt-2 mb-2">
        <PagePaginator
          :total="total"
          :page="page"
          :per-page="perPage"
          :per-page-options="[20, 50, 100]"
          @update:page="onPageUpdate"
          @update:per-page="onPerPageUpdate"
        />
      </div>
    </div>

    <VoidMonthlyPaymentModal ref="voidModalRef" @voided="onVoided" @error="onVoidError" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import { currentBogotaPeriod } from '@/helpers/driverFilterLabels'
import PaymentsAuditRepository from '@/repositories/PaymentsAuditRepository'
import type { MonthlyPaymentsAuditQuery, PaymentsAuditQuery, RechargesAuditQuery } from '@/types/PaymentsAuditQuery'
import type { PaymentsAuditFilters, PaymentsAuditType, PaymentsAuditViewMode } from '@/types/PaymentsAuditFilters'
import type {
  AuditTotals,
  MonthlyPaymentAuditRow,
  PaymentsAuditAnomalyFlag,
  PaymentsAuditSummaryRow,
  RechargeAuditRow,
} from '@/types/PaymentsAuditRow'
import type { MonthlyPaymentInterface } from '@/types/MonthlyPaymentInterface'
import PaymentsAuditFiltersBar from '@/components/drivers/PaymentsAuditFiltersBar.vue'
import PaymentsAuditTable from '@/components/drivers/PaymentsAuditTable.vue'
import PaymentsAuditSummaryTable from '@/components/drivers/PaymentsAuditSummaryTable.vue'
import VoidMonthlyPaymentModal from '@/components/drivers/VoidMonthlyPaymentModal.vue'
import PagePaginator from '@/components/PagePaginator.vue'

// ── Constants ─────────────────────────────────────────────────────────────────

const PERIOD_FORMAT = /^\d{4}-(0[1-9]|1[0-2])$/
const DEFAULT_PAGE = 1
const DEFAULT_PER_PAGE = 50
const PER_PAGE_OPTIONS = [20, 50, 100]

// ── Router / route ────────────────────────────────────────────────────────────

const route = useRoute()
const router = useRouter()

// ── Filter helpers ────────────────────────────────────────────────────────────

function anomalyFlagsFor(type: PaymentsAuditType): PaymentsAuditAnomalyFlag[] {
  return type === 'monthly'
    ? ['duplicate', 'atypical', 'outOfPeriod', 'voided']
    : ['duplicate', 'atypical']
}

function parseFilters(q: typeof route.query): PaymentsAuditFilters {
  const type: PaymentsAuditType = q.type === 'recharges' ? 'recharges' : 'monthly'
  const view: PaymentsAuditViewMode = q.view === 'summary' ? 'summary' : 'detail'
  const f: PaymentsAuditFilters = { type, view, anomaly: [] }

  const periodRaw = typeof q.period === 'string' ? q.period : undefined
  if (periodRaw !== 'all') {
    f.period = periodRaw && PERIOD_FORMAT.test(periodRaw) ? periodRaw : currentBogotaPeriod()
  }

  if (typeof q.createdFrom === 'string' && q.createdFrom) f.createdFrom = q.createdFrom
  if (typeof q.createdTo === 'string' && q.createdTo) f.createdTo = q.createdTo
  if (typeof q.search === 'string' && q.search) f.driverSearch = q.search
  if (typeof q.driverId === 'string' && q.driverId) f.driverId = q.driverId
  if (typeof q.createdByUid === 'string' && q.createdByUid) f.createdByUid = q.createdByUid

  const validAnomaly: string[] = anomalyFlagsFor(type)
  const anomalyRaw = typeof q.anomaly === 'string' ? q.anomaly : ''
  f.anomaly = anomalyRaw
    .split(',')
    .map((v) => v.trim())
    .filter((v): v is PaymentsAuditAnomalyFlag => validAnomaly.includes(v))

  if (type === 'monthly') {
    if (q.status === 'active' || q.status === 'voided') f.status = q.status
    if (typeof q.amountThreshold === 'string' && q.amountThreshold !== '') {
      const n = Number(q.amountThreshold)
      if (!Number.isNaN(n) && n > 0) f.amountThreshold = n
    }
  } else {
    if (typeof q.minAmount === 'string' && q.minAmount !== '') {
      const n = Number(q.minAmount)
      if (!Number.isNaN(n)) f.minAmount = n
    }
    if (typeof q.maxAmount === 'string' && q.maxAmount !== '') {
      const n = Number(q.maxAmount)
      if (!Number.isNaN(n)) f.maxAmount = n
    }
  }

  return f
}

// ── Sort helpers ──────────────────────────────────────────────────────────────

function validSortFields(type: PaymentsAuditType, view: PaymentsAuditViewMode): string[] {
  if (view === 'summary') return ['driver_name', 'active_amount', 'payment_count', 'last_created_at']
  return type === 'monthly'
    ? ['created_at', 'amount', 'period', 'driver_name']
    : ['created_at', 'amount', 'driver_name']
}

function defaultSort(view: PaymentsAuditViewMode): string {
  return view === 'summary' ? '-active_amount' : '-created_at'
}

function sanitizeSort(raw: string | undefined, type: PaymentsAuditType, view: PaymentsAuditViewMode): string {
  const value = raw ?? defaultSort(view)
  const field = value.startsWith('-') ? value.slice(1) : value
  return validSortFields(type, view).includes(field) ? value : defaultSort(view)
}

// ── URL-derived state ─────────────────────────────────────────────────────────

const filters = ref<PaymentsAuditFilters>(parseFilters(route.query))
const sort = ref<string>(sanitizeSort(route.query.sort as string | undefined, filters.value.type, filters.value.view))
const page = ref<number>(route.query.page ? Math.max(1, Number(route.query.page)) : DEFAULT_PAGE)
const perPage = ref<number>(
  PER_PAGE_OPTIONS.includes(Number(route.query.perPage)) ? Number(route.query.perPage) : DEFAULT_PER_PAGE
)

// ── URL state commit ──────────────────────────────────────────────────────────

function commitUrlState(): void {
  const q: Record<string, string | undefined> = {}

  q.type = filters.value.type
  q.view = filters.value.view
  if (filters.value.driverSearch) q.search = filters.value.driverSearch
  q.period = filters.value.period ?? 'all'
  if (filters.value.createdFrom) q.createdFrom = filters.value.createdFrom
  if (filters.value.createdTo) q.createdTo = filters.value.createdTo
  if (filters.value.createdByUid) q.createdByUid = filters.value.createdByUid
  if (filters.value.anomaly.length > 0) q.anomaly = filters.value.anomaly.join(',')

  if (filters.value.type === 'monthly') {
    if (filters.value.status) q.status = filters.value.status
    if (filters.value.amountThreshold !== undefined) q.amountThreshold = String(filters.value.amountThreshold)
  } else {
    if (filters.value.minAmount !== undefined) q.minAmount = String(filters.value.minAmount)
    if (filters.value.maxAmount !== undefined) q.maxAmount = String(filters.value.maxAmount)
  }

  if (filters.value.driverId) q.driverId = filters.value.driverId
  if (sort.value !== defaultSort(filters.value.view)) q.sort = sort.value
  if (page.value !== DEFAULT_PAGE) q.page = String(page.value)
  if (perPage.value !== DEFAULT_PER_PAGE) q.perPage = String(perPage.value)

  if (!hasSameQuery(q)) {
    void router.replace({ query: q })
  }
}

function hasSameQuery(nextQuery: Record<string, string | undefined>): boolean {
  const currentQuery = Object.entries(route.query).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[key] = value
    }
    return acc
  }, {})
  const normalizedNextQuery = Object.entries(nextQuery).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value
    }
    return acc
  }, {})

  const currentKeys = Object.keys(currentQuery).sort()
  const nextKeys = Object.keys(normalizedNextQuery).sort()
  if (currentKeys.length !== nextKeys.length) return false

  return nextKeys.every((key, index) => currentKeys[index] === key && currentQuery[key] === normalizedNextQuery[key])
}

// ── Event handlers ────────────────────────────────────────────────────────────

function onFiltersUpdate(value: PaymentsAuditFilters): void {
  filters.value = value
  page.value = 1
  commitUrlState()
}

function onTypeChange(nextType: PaymentsAuditType): void {
  if (filters.value.type === nextType) return
  const validAnomaly: string[] = anomalyFlagsFor(nextType)
  const next: PaymentsAuditFilters = {
    type: nextType,
    view: filters.value.view,
    anomaly: filters.value.anomaly.filter((flag) => validAnomaly.includes(flag)),
  }
  if (filters.value.period !== undefined) next.period = filters.value.period
  if (filters.value.createdFrom !== undefined) next.createdFrom = filters.value.createdFrom
  if (filters.value.createdTo !== undefined) next.createdTo = filters.value.createdTo
  if (filters.value.driverSearch !== undefined) next.driverSearch = filters.value.driverSearch
  if (filters.value.driverId !== undefined) next.driverId = filters.value.driverId
  if (filters.value.createdByUid !== undefined) next.createdByUid = filters.value.createdByUid
  // status/amountThreshold (monthly-only) and minAmount/maxAmount (recharges-only) are intentionally dropped.

  filters.value = next
  sort.value = sanitizeSort(sort.value, nextType, filters.value.view)
  page.value = 1
  commitUrlState()
}

function onViewChange(nextView: PaymentsAuditViewMode): void {
  if (filters.value.view === nextView) return
  filters.value = { ...filters.value, view: nextView }
  sort.value = sanitizeSort(sort.value, filters.value.type, nextView)
  page.value = 1
  commitUrlState()
}

function onSortChange(value: string): void {
  sort.value = value
  page.value = 1
  commitUrlState()
}

function onSelectDriver(driverId: string): void {
  filters.value = { ...filters.value, view: 'detail', driverId }
  sort.value = sanitizeSort(sort.value, filters.value.type, 'detail')
  page.value = 1
  commitUrlState()
}

function clearDriverChip(): void {
  const next = { ...filters.value }
  delete next.driverId
  filters.value = next
  page.value = 1
  commitUrlState()
}

function onPageUpdate(value: number): void {
  page.value = value
  commitUrlState()
}

function onPerPageUpdate(value: number): void {
  perPage.value = value
  page.value = 1
  commitUrlState()
}

// ── Data state ────────────────────────────────────────────────────────────────

const detailRows = ref<Array<MonthlyPaymentAuditRow | RechargeAuditRow>>([])
const summaryRows = ref<PaymentsAuditSummaryRow[]>([])
const total = ref<number>(0)
const totals = ref<AuditTotals>({ activeAmount: 0, activeCount: 0, voidedCount: 0, activeDriverCount: 0 })
const loading = ref<boolean>(false)

// Incrementing counter used to force a re-fetch (e.g. after voiding a payment)
// without changing any filter/sort/page state.
const fetchTick = ref<number>(0)

function triggerRefetch(): void {
  fetchTick.value += 1
}

// The driver name for the removable chip: derived from the currently loaded
// detail rows rather than a dedicated lookup, since the audit view already
// fetches those rows filtered by `driverId`.
const driverChip = computed<string | null>(() => {
  const id = filters.value.driverId
  if (!id) return null
  const match = detailRows.value.find((row) => row.driver.id === id)
  return match ? match.driver.name : id
})

// ── Fetch logic ───────────────────────────────────────────────────────────────

watchEffect(async () => {
  void fetchTick.value // tracked to allow forced refetch
  const _type = filters.value.type
  const _view = filters.value.view
  const _period = filters.value.period
  const _createdFrom = filters.value.createdFrom
  const _createdTo = filters.value.createdTo
  const _driverSearch = filters.value.driverSearch
  const _driverId = filters.value.driverId
  const _createdByUid = filters.value.createdByUid
  const _anomaly = filters.value.anomaly
  const _status = filters.value.status
  const _amountThreshold = filters.value.amountThreshold
  const _minAmount = filters.value.minAmount
  const _maxAmount = filters.value.maxAmount
  const _sort = sort.value
  const _page = page.value
  const _perPage = perPage.value

  const baseQuery: PaymentsAuditQuery = {
    period: _period,
    createdFrom: _createdFrom,
    createdTo: _createdTo,
    driverSearch: _driverSearch,
    driverId: _driverId,
    createdByUid: _createdByUid,
    anomaly: _anomaly,
    sort: _sort,
    page: _page,
    perPage: _perPage,
  }

  loading.value = true
  try {
    if (_type === 'monthly') {
      const query: MonthlyPaymentsAuditQuery = { ...baseQuery, status: _status, amountThreshold: _amountThreshold }
      if (_view === 'summary') {
        const result = await PaymentsAuditRepository.summaryMonthly(query)
        summaryRows.value = result.rows
        total.value = result.total
        totals.value = result.totals
      } else {
        const result = await PaymentsAuditRepository.listMonthly(query)
        detailRows.value = result.rows
        total.value = result.total
        totals.value = result.totals
      }
    } else {
      const query: RechargesAuditQuery = { ...baseQuery, minAmount: _minAmount, maxAmount: _maxAmount }
      if (_view === 'summary') {
        const result = await PaymentsAuditRepository.summaryRecharges(query)
        summaryRows.value = result.rows
        total.value = result.total
        totals.value = result.totals
      } else {
        const result = await PaymentsAuditRepository.listRecharges(query)
        detailRows.value = result.rows
        total.value = result.total
        totals.value = result.totals
      }
    }

    // Clamp page if overshoot
    if (total.value > 0 && (_page - 1) * _perPage >= total.value) {
      page.value = 1
      commitUrlState()
    }
  } catch (e: any) {
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e?.message)
  } finally {
    loading.value = false
  }
})

// ── Void flow ─────────────────────────────────────────────────────────────────

const voidModalRef = ref<InstanceType<typeof VoidMonthlyPaymentModal> | null>(null)

function onVoidPayment(row: MonthlyPaymentAuditRow): void {
  // VoidMonthlyPaymentModal.open() expects the driver-edit MonthlyPaymentInterface
  // shape; adapt the audit row (which nests driver info under `driver`) to it.
  const payment: MonthlyPaymentInterface = {
    id: row.id,
    driverId: row.driver.id,
    period: row.period,
    amount: row.amount,
    createdByUid: row.createdByUid,
    createdByName: row.createdByName,
    note: row.note,
    created_at: row.created_at,
    status: row.status,
    voidedAt: row.voidedAt,
    voidedByUid: row.voidedByUid,
    voidedByName: row.voidedByName,
    voidReason: row.voidReason,
  }
  voidModalRef.value?.open(payment, row.driver.id)
}

function onVoided(): void {
  triggerRefetch()
}

function onVoidError(): void {
  triggerRefetch()
}

onMounted(() => {
  commitUrlState()
})
</script>

<style scoped>
.payments-view {
  --payments-view-chip-bg: rgba(203, 12, 159, 0.12);
  --payments-view-chip-text: #344767;
}

body.dark-version .payments-view {
  --payments-view-chip-bg: rgba(203, 12, 159, 0.22);
  --payments-view-chip-text: rgba(255, 255, 255, 0.9);
}

.payments-view__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--payments-view-chip-bg);
  color: var(--payments-view-chip-text);
  padding: 0.35rem 0.75rem;
  border-radius: 50rem;
  font-size: 0.78rem;
  font-weight: 600;
}

.payments-view__chip-close {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 0.7rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}
</style>
