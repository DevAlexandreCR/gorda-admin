import serverApi, { ApiResponse } from "@/services/gordaApi/server/ServerApi";
import { MonthlyPaymentSettingsInterface } from "@/types/MonthlyPaymentSettingsInterface";

class MonthlyPaymentSettingsRepository {
  async get(): Promise<MonthlyPaymentSettingsInterface> {
    const response = await serverApi.get<
      ApiResponse<MonthlyPaymentSettingsInterface>
    >("/drivers/monthly-payment-settings");
    return response.data.data;
  }

  async save(
    payload: MonthlyPaymentSettingsInterface
  ): Promise<MonthlyPaymentSettingsInterface> {
    const response = await serverApi.put<
      ApiResponse<MonthlyPaymentSettingsInterface>
    >("/drivers/monthly-payment-settings", payload);
    return response.data.data;
  }
}

export default new MonthlyPaymentSettingsRepository();
