import serverApi, { ApiResponse } from '@/services/gordaApi/server/ServerApi'
import type { MonthlyPaymentsAuditQuery, RechargesAuditQuery } from '@/types/PaymentsAuditQuery'
import type {
  AuditActor,
  MonthlyPaymentAuditRow,
  PaymentsAuditListResponse,
  PaymentsAuditSummaryRow,
  RechargeAuditRow,
} from '@/types/PaymentsAuditRow'

// Drops empty/undefined values and joins `anomaly` (and any other array param)
// into the comma-separated list the API expects.
function buildParams<T>(query: T): Record<string, string | number> {
  const params: Record<string, string | number> = {}
  for (const [key, value] of Object.entries(query as Record<string, unknown>)) {
    if (value === undefined || value === null || value === '') {
      continue
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        continue
      }
      params[key] = value.join(',')
      continue
    }
    params[key] = value as string | number
  }
  return params
}

class PaymentsAuditRepository {
  async listMonthly(query: MonthlyPaymentsAuditQuery): Promise<PaymentsAuditListResponse<MonthlyPaymentAuditRow>> {
    const response = await serverApi.get<ApiResponse<PaymentsAuditListResponse<MonthlyPaymentAuditRow>>>('/payments/monthly', {
      params: buildParams(query),
    })
    return response.data.data
  }

  async listRecharges(query: RechargesAuditQuery): Promise<PaymentsAuditListResponse<RechargeAuditRow>> {
    const response = await serverApi.get<ApiResponse<PaymentsAuditListResponse<RechargeAuditRow>>>('/payments/recharges', {
      params: buildParams(query),
    })
    return response.data.data
  }

  async summaryMonthly(query: MonthlyPaymentsAuditQuery): Promise<PaymentsAuditListResponse<PaymentsAuditSummaryRow>> {
    const response = await serverApi.get<ApiResponse<PaymentsAuditListResponse<PaymentsAuditSummaryRow>>>(
      '/payments/monthly/summary',
      { params: buildParams(query) }
    )
    return response.data.data
  }

  async summaryRecharges(query: RechargesAuditQuery): Promise<PaymentsAuditListResponse<PaymentsAuditSummaryRow>> {
    const response = await serverApi.get<ApiResponse<PaymentsAuditListResponse<PaymentsAuditSummaryRow>>>(
      '/payments/recharges/summary',
      { params: buildParams(query) }
    )
    return response.data.data
  }

  async listActors(type: 'monthly' | 'recharges'): Promise<AuditActor[]> {
    const response = await serverApi.get<ApiResponse<{ actors: AuditActor[] }>>('/payments/actors', {
      params: { type },
    })
    return response.data.data.actors ?? []
  }
}

export default new PaymentsAuditRepository()
