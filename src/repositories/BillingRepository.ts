import serverApi, { ApiResponse } from "@/services/gordaApi/server/ServerApi";

export interface BillingLineCharge {
  wpClientId: string;
  alias: string;
  amountCop: number;
}

export interface BillingConfigResponse {
  lineCharges: BillingLineCharge[];
  softwareRental: number;
}

export interface BillingExtra {
  description: string;
  amountCop: number;
}

export interface BillingSavePayload {
  lineCharges: { wpClientId: string; amountCop: number }[];
  softwareRental: number;
}

export interface BillingSendPayload {
  month: string;
  recipientEmail: string;
  extras: BillingExtra[];
}

export interface BillingPreviewPayload {
  month: string;
  lineCharges: BillingLineCharge[];
  softwareRental: number;
  extras: BillingExtra[];
}

export interface BillingSummarySource {
  key: "admin" | "bot" | "unidentified";
  label: string;
  count: number;
}

export interface BillingWhatsappLineSummary {
  wpClientId: string;
  alias: string;
  sessions: number;
  inboundMessages: number;
  outboundMessages: number;
  totalMessages: number;
}

export interface BillingSummaryResponse {
  month: string;
  monthLabel: string;
  monthText: string;
  startDate: string;
  endDate: string;
  startDateLabel: string;
  endDateLabel: string;
  totalServices: number;
  totalSessions: number;
  totalInboundMessages: number;
  totalOutboundMessages: number;
  totalMessages: number;
  serviceSources: BillingSummarySource[];
  whatsappLines: BillingWhatsappLineSummary[];
}

export interface BillingPreviewResponse {
  html: string;
}

class BillingRepository {
  async getConfig(): Promise<BillingConfigResponse> {
    const response = await serverApi.get<ApiResponse<BillingConfigResponse>>(
      "/billing/config"
    );
    return response.data.data;
  }

  async getSummary(month: string): Promise<BillingSummaryResponse> {
    const response = await serverApi.get<ApiResponse<BillingSummaryResponse>>(
      "/billing/summary",
      {
        params: { month },
      }
    );
    return response.data.data;
  }

  async getPreviewHtml(payload: BillingPreviewPayload): Promise<string> {
    const response = await serverApi.post<ApiResponse<BillingPreviewResponse>>(
      "/billing/preview",
      payload
    );
    return response.data.data.html;
  }

  async saveConfig(payload: BillingSavePayload): Promise<void> {
    await serverApi.put("/billing/config", payload);
  }

  async sendInvoice(payload: BillingSendPayload): Promise<void> {
    await serverApi.post("/billing/send", payload);
  }
}

export default new BillingRepository();
