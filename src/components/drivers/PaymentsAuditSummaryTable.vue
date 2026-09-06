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

    <div class="table-responsive">
      <table class="table table-sm align-items-center mb-0" :class="{ 'opacity-50': loading }">
        <caption hidden></caption>
        <thead>
          <tr>
            <th
              class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2 cursor-pointer user-select-none"
              @click="setSort('driver_name')"
            >
              {{ $t('drivers.payments_audit.summary.col_driver') }}
              <span v-if="sortField === 'driver_name'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th
              class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2 cursor-pointer user-select-none"
              @click="setSort('active_amount')"
            >
              {{ $t('drivers.payments_audit.summary.col_active_amount') }}
              <span v-if="sortField === 'active_amount'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th
              class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2 cursor-pointer user-select-none"
              @click="setSort('payment_count')"
            >
              {{ $t('drivers.payments_audit.summary.col_payment_count') }}
              <span v-if="sortField === 'payment_count'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th v-if="type === 'monthly'" class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">
              {{ $t('drivers.payments_audit.summary.col_voided_count') }}
            </th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">
              {{ $t('drivers.payments_audit.summary.col_duplicate_count') }}
            </th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">
              {{ $t('drivers.payments_audit.summary.col_atypical_count') }}
            </th>
            <th v-if="type === 'monthly'" class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2">
              {{ $t('drivers.payments_audit.summary.col_out_of_period_count') }}
            </th>
            <th
              class="text-uppercase text-secondary text-xxs font-weight-bolder ps-2 cursor-pointer user-select-none"
              @click="setSort('last_created_at')"
            >
              {{ $t('drivers.payments_audit.summary.col_last_created_at') }}
              <span v-if="sortField === 'last_created_at'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
            </th>
          </tr>
        </thead>

        <tbody v-if="rows.length > 0">
          <tr
            v-for="row in rows"
            :key="row.driver.id"
            class="payaudit-summary-row"
            @click="emit('select-driver', row.driver.id)"
          >
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
                    @click.stop="goToVehicleByPlate(row.driver.plate)"
                  >{{ row.driver.plate }}</button>
                </div>
              </div>
            </td>
            <td class="py-1 payaudit-amount">{{ formatAmount(row.activeAmount) }}</td>
            <td class="py-1">{{ row.paymentCount }}</td>
            <td v-if="type === 'monthly'" class="py-1">{{ row.voidedCount ?? 0 }}</td>
            <td class="py-1">{{ row.duplicateCount }}</td>
            <td class="py-1">{{ row.atypicalCount }}</td>
            <td v-if="type === 'monthly'" class="py-1">{{ row.outOfPeriodCount ?? 0 }}</td>
            <td class="py-1">
              <span class="payaudit-cell-icon"><em class="fas fa-clock payaudit-clock"></em>{{ formatDate(row.lastCreatedAt) }}</span>
            </td>
          </tr>
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
import type { AuditTotals, PaymentsAuditSummaryRow } from '@/types/PaymentsAuditRow'
import type { PaymentsAuditType } from '@/types/PaymentsAuditFilters'

interface Props {
  type: PaymentsAuditType
  rows: PaymentsAuditSummaryRow[]
  totals: AuditTotals
  sort: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  sort: [sort: string]
  'select-driver': [driverId: string]
}>()

const { t } = useI18n()
const router = useRouter()
const resolvingPlate = ref<string | null>(null)

const columnCount = computed(() => (props.type === 'monthly' ? 8 : 6))

const sortField = computed(() => (props.sort.startsWith('-') ? props.sort.slice(1) : props.sort))
const sortDir = computed<'asc' | 'desc'>(() => (props.sort.startsWith('-') ? 'desc' : 'asc'))

function setSort(field: string): void {
  if (sortField.value === field) {
    emit('sort', sortDir.value === 'asc' ? `-${field}` : field)
  } else {
    emit('sort', field)
  }
}

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
  --payaudit-row-hover: rgba(0, 0, 0, 0.03);
}

body.dark-version .payaudit-table {
  --payaudit-th-color: var(--text-secondary);
  --payaudit-th-bg: rgba(255, 255, 255, 0.04);
  --payaudit-td-border: var(--border-subtle);
  --payaudit-td-color: rgba(255, 255, 255, 0.7);
  --payaudit-clock: rgba(255, 255, 255, 0.3);
  --payaudit-heading: rgba(255, 255, 255, 0.9);
  --payaudit-row-hover: rgba(255, 255, 255, 0.04);
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

.payaudit-summary-row {
  cursor: pointer;
}

.payaudit-summary-row:hover td {
  background: var(--payaudit-row-hover);
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

.payaudit-amount {
  font-weight: 700;
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

.payaudit-plate-link {
  font-size: 0.72rem;
  text-decoration: none;
}
</style>
