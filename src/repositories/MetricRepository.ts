import { Metric } from '@/types/Metric'
import serverApi, { ApiResponse } from '@/services/gordaApi/server/ServerApi'

class MetricRepository {
  async getGlobal(startDate: string, endDate: string): Promise<Metric[]> {
    const response = await serverApi.get<ApiResponse<Metric[]>>('/metrics/global', {
      params: {
        startDate,
        endDate,
      },
    })

    return response.data.data
  }

  async getTopDrivers(
    from: number,
    to: number,
    frequency: 'daily' | 'weekly'
  ): Promise<Map<string, number>> {
    const response = await serverApi.get<ApiResponse<{ drivers: Array<{ driverId: string; count: number }> }>>(
      '/metrics/top-drivers',
      {
        params: {
          from,
          to,
          frequency,
        },
      }
    )

    const metrics = new Map<string, number>()
    response.data.data.drivers.forEach((driver) => {
      metrics.set(driver.driverId, driver.count)
    })

    return metrics
  }
}

export default new MetricRepository()
