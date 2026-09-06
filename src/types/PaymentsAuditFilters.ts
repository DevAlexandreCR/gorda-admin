import type { PaymentsAuditAnomalyFlag } from '@/types/PaymentsAuditRow'

// UI/URL filter state exchanged between views/drivers/Payments.vue and
// components/drivers/PaymentsAuditFiltersBar.vue. Mirrors the domain filters
// accepted by the /payments endpoints, plus the tab/mode selection that only
// exists on the admin side (api/src/Interfaces/PaymentsAuditInterface.ts has
// no equivalent for `type`/`view`; `sort`/`page`/`perPage` are tracked as
// separate view state, same convention as views/drivers/Index.vue).
export type PaymentsAuditType = 'monthly' | 'recharges'
export type PaymentsAuditViewMode = 'detail' | 'summary'
export type MonthlyPaymentAuditStatus = 'active' | 'voided'

export interface PaymentsAuditFilters {
  type: PaymentsAuditType
  view: PaymentsAuditViewMode
  period?: string
  createdFrom?: string
  createdTo?: string
  driverSearch?: string
  driverId?: string
  createdByUid?: string
  anomaly: PaymentsAuditAnomalyFlag[]
  status?: MonthlyPaymentAuditStatus
  amountThreshold?: number
  minAmount?: number
  maxAmount?: number
}
