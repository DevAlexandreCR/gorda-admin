<template>
  <div class="card px-2 py-1 payaudit-table">
    <div class="gorda-table-header">
      <div class="d-flex align-items-center gap-2">
        <span class="gorda-table-header-icon" :style="{ background: headerConfig.gradient }">
          <em class="fas" :class="headerConfig.icon"></em>
        </span>
        <h6 class="gorda-table-header-title mb-0">{{ headerConfig.title }}</h6>
        <span class="gorda-table-header-count">{{ rows.length }}</span>
      </div>
    </div>

    <div v-if="type === 'recharges'" class="payaudit-readonly-hint">
      <em class="fas fa-lock me-1"></em>{{ $t('drivers.payments_audit.recharges_readonly_hint') }}
    </div>

    <div class="table-responsive">
      <table class="table table-sm align-items-center mb-0" :class="{ 'opacity-50': loading }">
        <caption hidden></caption>
        <thead>
          <tr v-if="type === 'monthly'">
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.monthly.col_driver') }}</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.monthly.col_period') }}</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.monthly.col_amount') }}</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.monthly.col_actor') }}</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.monthly.col_date') }}</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.monthly.col_note') }}</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.monthly.col_anomalies') }}</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.monthly.col_status') }}</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.monthly.col_actions') }}</th>
          </tr>
          <tr v-else>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.recharges.col_driver') }}</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.recharges.col_month') }}</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.recharges.col_amount') }}</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.recharges.col_balance_before') }}</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.recharges.col_balance_after') }}</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.recharges.col_actor') }}</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.recharges.col_date') }}</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.recharges.col_note') }}</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">{{ $t('drivers.payments_audit.recharges.col_anomalies') }}</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2"></th>
          </tr>
        </thead>

        <tbody v-if="rows.length > 0">
          <template v-if="type === 'monthly'">
            <tr v-for="row in monthlyRows" :key="row.id" :class="{ 'payaudit-row-voided': row.status === 'voided' }">
              <td class="py-1">
                <div class="d-flex align-items-center gap-2">
                  <span class="payaudit-avatar">{{ initials(row.driver.name) }}</span>
                  <div class="d-flex flex-column justify-content-center">
                    <span class="text-sm font-weight-bold">{{ row.driver.name }}</span>
                    <span class="text-xs text-secondary">{{ row.driver.document }}</span>
                    <button
                      v-if="row.driver.plate"
                      type="button"
                      class="btn btn-link btn-sm p-0 payaudit-plate-link"
                      :disabled="resolvingPlate === row.driver.plate"
                      @click="goToVehicleByPlate(row.driver.plate)"
                    >{{ row.driver.plate }}</button>
                  </div>
                </div>
              </td>
              <td class="py-1"><span class="payaudit-period-pill">{{ row.period }}</span></td>
              <td class="py-1 payaudit-amount">{{ formatAmount(row.amount) }}</td>
              <td class="py-1">
                <span class="payaudit-actor">
                  <span class="payaudit-avatar payaudit-avatar--actor">{{ initials(row.createdByName) }}</span>
                  {{ row.createdByName }}
                </span>
              </td>
              <td class="py-1">
                <span class="payaudit-cell-icon"><em class="fas fa-clock payaudit-clock"></em>{{ formatDate(row.created_at) }}</span>
              </td>
              <td class="py-1">
                <span v-if="row.note" class="payaudit-note-pill">{{ row.note }}</span>
                <span v-else class="payaudit-dash">&mdash;</span>
              </td>
              <td class="py-1">
                <div v-if="monthlyAnomalyBadges(row).length > 0" class="d-flex flex-wrap gap-1">
                  <span
                    v-for="badge in monthlyAnomalyBadges(row)"
                    :key="badge.key"
                    class="gorda-status-badge"
                    :class="'gorda-status-badge--' + badge.variant"
                  >{{ badge.label }}</span>
                </div>
                <span v-else class="payaudit-dash">&mdash;</span>
              </td>
              <td class="payaudit-status-cell">
                <template v-if="row.status === 'voided'">
                  <span class="payaudit-voided-badge">
                    <em class="fas fa-ban me-1"></em>{{ $t('drivers.monthly_payments.badge_voided') }}
                  </span>
                  <div class="payaudit-voided-meta">
                    <div v-if="row.voidReason">{{ row.voidReason }}</div>
                    <div>
                      {{ $t('drivers.monthly_payments.voided_by', { name: row.voidedByName }) }}
                      <span v-if="row.voidedAt"> · {{ formatDate(row.voidedAt) }}</span>
                    </div>
                  </div>
                </template>
                <span v-else class="payaudit-dash">&mdash;</span>
              </td>
              <td class="py-1">
                <div class="d-flex align-items-center gap-1">
                  <button
                    v-if="row.status !== 'voided'"
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    @click="emit('void-payment', row)"
                  >
                    <em class="fas fa-ban me-1"></em>{{ $t('drivers.monthly_payments.action_void') }}
                  </button>
                  <router-link
                    :to="{ name: 'drivers.edit', params: { id: row.driver.id } }"
                    class="btn btn-sm btn-outline-primary px-2"
                    :title="$t('common.actions.edit')"
                  >
                    <em class="fas fa-pencil"></em>
                  </router-link>
                </div>
              </td>
            </tr>
          </template>

          <template v-else>
            <tr v-for="row in rechargeRows" :key="row.id">
              <td class="py-1">
                <div class="d-flex align-items-center gap-2">
                  <span class="payaudit-avatar">{{ initials(row.driver.name) }}</span>
                  <div class="d-flex flex-column justify-content-center">
                    <span class="text-sm font-weight-bold">{{ row.driver.name }}</span>
                    <span class="text-xs text-secondary">{{ row.driver.document }}</span>
                    <button
                      v-if="row.driver.plate"
                      type="button"
                      class="btn btn-link btn-sm p-0 payaudit-plate-link"
                      :disabled="resolvingPlate === row.driver.plate"
                      @click="goToVehicleByPlate(row.driver.plate)"
                    >{{ row.driver.plate }}</button>
                  </div>
                </div>
              </td>
              <td class="py-1"><span class="payaudit-period-pill">{{ row.period }}</span></td>
              <td class="py-1 payaudit-amount">{{ formatAmount(row.amount) }}</td>
              <td class="py-1 payaudit-balance">{{ formatAmount(row.balanceBefore) }}</td>
              <td class="py-1 payaudit-balance">{{ formatAmount(row.balanceAfter) }}</td>
              <td class="py-1">
                <span class="payaudit-actor">
                  <span class="payaudit-avatar payaudit-avatar--actor">{{ initials(row.createdByName) }}</span>
                  {{ row.createdByName }}
                </span>
              </td>
              <td class="py-1">
                <span class="payaudit-cell-icon"><em class="fas fa-clock payaudit-clock"></em>{{ formatDate(row.created_at) }}</span>
              </td>
              <td class="py-1">
                <span v-if="row.note" class="payaudit-note-pill">{{ row.note }}</span>
                <span v-else class="payaudit-dash">&mdash;</span>
              </td>
              <td class="py-1">
                <div v-if="rechargeAnomalyBadges(row).length > 0" class="d-flex flex-wrap gap-1">
                  <span
                    v-for="badge in rechargeAnomalyBadges(row)"
                    :key="badge.key"
                    class="gorda-status-badge"
                    :class="'gorda-status-badge--' + badge.variant"
                  >{{ badge.label }}</span>
                </div>
                <span v-else class="payaudit-dash">&mdash;</span>
              </td>
              <td class="py-1">
                <router-link
                  :to="{ name: 'drivers.edit', params: { id: row.driver.id } }"
                  class="btn btn-sm btn-outline-primary px-2"
                  :title="$t('common.actions.edit')"
                >
                  <em class="fas fa-pencil"></em>
                </router-link>
              </td>
            </tr>
          </template>
        </tbody>

        <tbody v-else>
          <tr>
            <td :colspan="columnCount" class="text-center py-4 text-secondary text-sm">
              {{ $t('drivers.payments_audit.empty') }}
            </td>
          </tr>
        </tbody>

        <PaymentsAuditTotalsFooter :totals="totals" :colspan="columnCount" />
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import VehicleRepository from '@/repositories/VehicleRepository'
import PaymentsAuditTotalsFooter from '@/components/drivers/PaymentsAuditTotalsFooter.vue'
import type { AuditTotals, MonthlyPaymentAuditRow, RechargeAuditRow } from '@/types/PaymentsAuditRow'
import type { PaymentsAuditType } from '@/types/PaymentsAuditFilters'

interface Props {
  type: PaymentsAuditType
  rows: Array<MonthlyPaymentAuditRow | RechargeAuditRow>
  totals: AuditTotals
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  'void-payment': [row: MonthlyPaymentAuditRow]
}>()

const { t } = useI18n()
const router = useRouter()
const resolvingPlate = ref<string | null>(null)

const monthlyRows = computed(() => props.rows as MonthlyPaymentAuditRow[])
const rechargeRows = computed(() => props.rows as RechargeAuditRow[])

const columnCount = computed(() => (props.type === 'monthly' ? 9 : 10))

const headerConfig = computed(() => {
  if (props.type === 'recharges') {
    return {
      gradient: 'linear-gradient(310deg,#17ad37,#98ec2d)',
      icon: 'fa-coins',
      title: t('drivers.payments_audit.tabs.recharges'),
    }
  }
  return {
    gradient: 'linear-gradient(310deg,#7928ca,#ff0080)',
    icon: 'fa-calendar-check',
    title: t('drivers.payments_audit.tabs.monthly'),
  }
})

interface AnomalyBadge {
  key: string
  variant: 'warning' | 'danger' | 'secondary'
  label: string
}

function monthlyAnomalyBadges(row: MonthlyPaymentAuditRow): AnomalyBadge[] {
  const badges: AnomalyBadge[] = []
  if (row.anomalies.duplicate) badges.push({ key: 'duplicate', variant: 'warning', label: t('drivers.payments_audit.anomalies.duplicate') })
  if (row.anomalies.atypical) badges.push({ key: 'atypical', variant: 'danger', label: t('drivers.payments_audit.anomalies.atypical') })
  if (row.anomalies.outOfPeriod) badges.push({ key: 'outOfPeriod', variant: 'secondary', label: t('drivers.payments_audit.anomalies.out_of_period') })
  return badges
}

function rechargeAnomalyBadges(row: RechargeAuditRow): AnomalyBadge[] {
  const badges: AnomalyBadge[] = []
  if (row.anomalies.duplicate) badges.push({ key: 'duplicate', variant: 'warning', label: t('drivers.payments_audit.anomalies.possible_duplicate') })
  if (row.anomalies.atypical) badges.push({ key: 'atypical', variant: 'danger', label: t('drivers.payments_audit.anomalies.atypical') })
  return badges
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter((word) => word.length > 0)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function formatAmount(value: number): string {
  return (value ?? 0).toLocaleString('es-CO') + ' COP'
}

function formatDate(unix: number): string {
  return dayjs.unix(unix).format('DD/MM/YY HH:mm')
}

async function goToVehicleByPlate(plate: string | null): Promise<void> {
  if (!plate || resolvingPlate.value) return
  resolvingPlate.value = plate
  try {
    const vehicle = await VehicleRepository.lookupByPlate(plate)
    if (vehicle) {
      await router.push({ name: 'vehicles.detail', params: { id: vehicle.id } })
    }
  } finally {
    resolvingPlate.value = null
  }
}
</script>

<style scoped>
.payaudit-table {
  --payaudit-th-color: var(--text-secondary);
  --payaudit-th-bg: rgba(0, 0, 0, 0.02);
  --payaudit-td-border: var(--border-subtle);
  --payaudit-td-color: #67748e;
  --payaudit-clock: #d2d6da;
  --payaudit-heading: #344767;
  --payaudit-pill-bg: var(--badge-secondary-bg);
  --payaudit-pill-text: var(--badge-secondary-fg);
  --payaudit-footer: #adb5bd;
  --payaudit-hint-bg: var(--badge-info-bg);
  --payaudit-hint-text: var(--badge-info-fg);
}

body.dark-version .payaudit-table {
  --payaudit-th-color: var(--text-secondary);
  --payaudit-th-bg: rgba(255, 255, 255, 0.04);
  --payaudit-td-border: var(--border-subtle);
  --payaudit-td-color: rgba(255, 255, 255, 0.7);
  --payaudit-clock: rgba(255, 255, 255, 0.3);
  --payaudit-heading: rgba(255, 255, 255, 0.9);
  --payaudit-pill-bg: var(--badge-secondary-bg);
  --payaudit-pill-text: var(--badge-secondary-fg);
  --payaudit-footer: rgba(255, 255, 255, 0.4);
  --payaudit-hint-bg: var(--badge-info-bg);
  --payaudit-hint-text: var(--badge-info-fg);
}

.payaudit-table :deep(th) {
  background: var(--payaudit-th-bg);
  color: var(--payaudit-th-color);
}

.payaudit-table :deep(td) {
  color: var(--payaudit-td-color);
  border-bottom: 1px solid var(--payaudit-td-border);
  vertical-align: middle;
}

.payaudit-readonly-hint {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0.6rem 1rem 0;
  padding: 0.5rem 0.85rem;
  border-radius: 0.5rem;
  font-size: 0.78rem;
  background: var(--payaudit-hint-bg);
  color: var(--payaudit-hint-text);
}

.payaudit-clock {
  color: var(--payaudit-clock);
  font-size: 0.7rem;
}

.payaudit-cell-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.payaudit-actor {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.payaudit-amount {
  font-weight: 700;
}

.payaudit-balance {
  color: var(--payaudit-heading);
  font-weight: 600;
}

.payaudit-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(310deg, #7928ca, #ff0080);
  color: #ffffff;
  font-size: 0.62rem;
  font-weight: 700;
}

.payaudit-avatar--actor {
  width: 22px;
  height: 22px;
}

.payaudit-note-pill {
  background: var(--payaudit-pill-bg);
  color: var(--payaudit-pill-text);
  padding: 0.15rem 0.5rem;
  border-radius: 50rem;
  font-size: 0.72rem;
}

.payaudit-period-pill {
  background: var(--badge-primary-bg);
  color: var(--badge-primary-fg);
  padding: 0.15rem 0.55rem;
  border-radius: 50rem;
  font-size: 0.72rem;
  font-weight: 700;
}

.payaudit-plate-link {
  font-size: 0.72rem;
  text-decoration: none;
}

.payaudit-dash {
  color: var(--payaudit-clock);
}

.payaudit-status-cell {
  white-space: normal;
}

.payaudit-row-voided td:not(.payaudit-status-cell) {
  text-decoration: line-through;
  opacity: 0.55;
}

.payaudit-voided-badge {
  --payaudit-voided-bg: var(--badge-danger-bg);
  --payaudit-voided-text: var(--badge-danger-fg);
  display: inline-flex;
  align-items: center;
  background: var(--payaudit-voided-bg);
  color: var(--payaudit-voided-text);
  padding: 0.15rem 0.55rem;
  border-radius: 50rem;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

body.dark-version .payaudit-voided-badge {
  --payaudit-voided-bg: var(--badge-danger-bg);
  --payaudit-voided-text: var(--badge-danger-fg);
}

.payaudit-voided-meta {
  margin-top: 0.35rem;
  font-size: 0.68rem;
  color: var(--payaudit-footer);
  line-height: 1.35;
}
</style>
