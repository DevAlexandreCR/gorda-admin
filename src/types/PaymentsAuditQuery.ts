// Query params sent to the /payments endpoints (api/src/Interfaces/PaymentsAuditInterface.ts).
export interface PaymentsAuditQuery {
  period?: string
  createdFrom?: string
  createdTo?: string
  driverSearch?: string
  driverId?: string
  createdByUid?: string
  anomaly?: string[]
  sort?: string
  page?: number
  perPage?: number
}

export interface MonthlyPaymentsAuditQuery extends PaymentsAuditQuery {
  status?: 'active' | 'voided'
  amountThreshold?: number
}

export interface RechargesAuditQuery extends PaymentsAuditQuery {
  minAmount?: number
  maxAmount?: number
}
