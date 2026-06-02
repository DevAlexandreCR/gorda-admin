import serverApi, { ApiResponse } from '@/services/gordaApi/server/ServerApi'

export interface BillingLineCharge {
  wpClientId: string
  alias: string
  amountCop: number
}

export interface BillingConfigResponse {
  lineCharges: BillingLineCharge[]
  softwareRental: number
}

export interface BillingExtra {
  description: string
  amountCop: number
}

export interface BillingSavePayload {
  lineCharges: { wpClientId: string; amountCop: number }[]
  softwareRental: number
}

export interface BillingSendPayload {
  month: string
  recipientEmail: string
  extras: BillingExtra[]
}

class BillingRepository {
  async getConfig(): Promise<BillingConfigResponse> {
    const response = await serverApi.get<ApiResponse<BillingConfigResponse>>('/billing/config')
    return response.data.data
  }

  async saveConfig(payload: BillingSavePayload): Promise<void> {
    await serverApi.put('/billing/config', payload)
  }

  async sendInvoice(payload: BillingSendPayload): Promise<void> {
    await serverApi.post('/billing/send', payload)
  }
}

export default new BillingRepository()
