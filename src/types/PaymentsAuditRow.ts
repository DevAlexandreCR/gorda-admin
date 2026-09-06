// Response shapes returned by the /payments endpoints (api/src/Interfaces/PaymentsAuditInterface.ts).
export interface AuditDriver {
  id: string
  name: string
  document: string
  plate: string | null
  paymentMode?: string
}

export interface AuditAnomalies {
  duplicate: boolean
  atypical: boolean
  outOfPeriod: boolean
  voided: boolean
}

export type PaymentsAuditAnomalyFlag = keyof AuditAnomalies

export interface MonthlyPaymentAuditRow {
  id: string
  period: string
  amount: number
  status: string
  note: string | null
  createdByUid: string
  createdByName: string
  created_at: number
  voidedAt: number | null
  voidedByUid: string | null
  voidedByName: string | null
  voidReason: string | null
  driver: AuditDriver
  anomalies: AuditAnomalies
}

export interface RechargeAuditRow {
  id: string
  amount: number
  balanceBefore: number
  balanceAfter: number
  note: string | null
  createdByUid: string
  createdByName: string
  created_at: number
  period: string
  driver: AuditDriver
  anomalies: AuditAnomalies
}

export interface PaymentsAuditSummaryRow {
  driver: AuditDriver
  activeAmount: number
  paymentCount: number
  voidedCount?: number
  duplicateCount: number
  atypicalCount: number
  outOfPeriodCount?: number
  lastCreatedAt: number
}

export interface AuditTotals {
  activeAmount: number
  activeCount: number
  voidedCount: number
  activeDriverCount: number
}

export interface AuditActor {
  uid: string
  name: string
}

// Shared envelope for every /payments list/summary response.
export interface PaymentsAuditListResponse<TRow> {
  rows: TRow[]
  total: number
  totals: AuditTotals
}
