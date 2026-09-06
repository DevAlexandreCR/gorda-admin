<template>
  <tfoot>
    <tr class="payaudit-totals-row">
      <td :colspan="colspan">
        <div class="payaudit-totals-wrap">
          <div class="payaudit-totals-stats">
            <div class="payaudit-totals-stat">
              <span class="payaudit-totals-label">{{ $t('drivers.payments_audit.totals.active_amount') }}</span>
              <span class="payaudit-totals-value">{{ formatAmount(totals.activeAmount) }}</span>
            </div>
            <div class="payaudit-totals-stat">
              <span class="payaudit-totals-label">{{ $t('drivers.payments_audit.totals.active_count') }}</span>
              <span class="payaudit-totals-value">{{ totals.activeCount }}</span>
            </div>
            <div class="payaudit-totals-stat">
              <span class="payaudit-totals-label">{{ $t('drivers.payments_audit.totals.voided_count') }}</span>
              <span class="payaudit-totals-value">{{ totals.voidedCount }}</span>
            </div>
            <div class="payaudit-totals-stat">
              <span class="payaudit-totals-label">{{ $t('drivers.payments_audit.totals.active_driver_count') }}</span>
              <span class="payaudit-totals-value">{{ totals.activeDriverCount }}</span>
            </div>
          </div>
          <router-link :to="{ name: 'metrics.index' }" class="payaudit-totals-hint">
            <em class="fas fa-circle-info me-1"></em>{{ $t('drivers.payments_audit.totals_hint') }}
          </router-link>
        </div>
      </td>
    </tr>
  </tfoot>
</template>

<script setup lang="ts">
import type { AuditTotals } from '@/types/PaymentsAuditRow'

interface Props {
  totals: AuditTotals
  colspan: number
}

defineProps<Props>()

function formatAmount(value: number): string {
  return (value ?? 0).toLocaleString('es-CO') + ' COP'
}
</script>

<style scoped>
.payaudit-totals-row {
  --payaudit-totals-bg: rgba(0, 0, 0, 0.02);
  --payaudit-totals-border: var(--border-subtle);
  --payaudit-totals-label: var(--text-secondary);
  --payaudit-totals-value: #344767;
  --payaudit-totals-hint: #adb5bd;
}

body.dark-version .payaudit-totals-row {
  --payaudit-totals-bg: rgba(255, 255, 255, 0.04);
  --payaudit-totals-border: var(--border-subtle);
  --payaudit-totals-label: var(--text-secondary);
  --payaudit-totals-value: rgba(255, 255, 255, 0.9);
  --payaudit-totals-hint: rgba(255, 255, 255, 0.4);
}

.payaudit-totals-row td {
  background: var(--payaudit-totals-bg);
  border-top: 1px solid var(--payaudit-totals-border);
  padding: 0.75rem 1.25rem;
}

.payaudit-totals-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.payaudit-totals-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.payaudit-totals-stat {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.payaudit-totals-label {
  font-size: 0.62rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--payaudit-totals-label);
}

.payaudit-totals-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--payaudit-totals-value);
}

.payaudit-totals-hint {
  font-size: 0.68rem;
  color: var(--payaudit-totals-hint);
  text-decoration: none;
  max-width: 320px;
}

.payaudit-totals-hint:hover {
  text-decoration: underline;
  color: var(--payaudit-totals-hint);
}
</style>
