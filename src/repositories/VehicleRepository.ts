import serverApi, { ApiResponse } from '@/services/gordaApi/server/ServerApi'
import { Vehicle } from '@/types/Vehicle'

export interface VehicleSearchQuery {
  search?: string
  enabled?: boolean
  sort?: string
  page?: number
  perPage?: number
}

class VehicleRepository {
  async list(query: VehicleSearchQuery = {}): Promise<{ vehicles: Vehicle[]; total: number }> {
    const response = await serverApi.get<ApiResponse<{ vehicles: Vehicle[]; total: number }>>('/vehicles', { params: query })
    return {
      vehicles: response.data.data.vehicles ?? [],
      total: response.data.data.total ?? 0,
    }
  }

  async findById(id: string): Promise<Vehicle> {
    const response = await serverApi.get<ApiResponse<{ vehicle: Vehicle }>>(`/vehicles/${id}`)
    return response.data.data.vehicle
  }

  async lookupByPlate(plate: string): Promise<Vehicle | null> {
    try {
      const response = await serverApi.get<ApiResponse<{ vehicle: Vehicle }>>('/vehicles/lookup', { params: { plate } })
      return response.data.data.vehicle ?? null
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError?.response?.status === 404) return null
      throw error
    }
  }

  async create(data: Partial<Vehicle>): Promise<Vehicle> {
    const response = await serverApi.post<ApiResponse<{ vehicle: Vehicle }>>('/vehicles', data)
    return response.data.data.vehicle
  }

  async update(id: string, partial: Partial<Vehicle>): Promise<Vehicle> {
    const response = await serverApi.patch<ApiResponse<{ vehicle: Vehicle }>>(`/vehicles/${id}`, partial)
    return response.data.data.vehicle
  }

  async setEnabled(id: string, enabled: boolean, confirmed?: boolean): Promise<void> {
    await serverApi.patch(`/vehicles/${id}/enabled`, { enabled, ...(confirmed !== undefined ? { confirmed } : {}) })
  }
}

export default new VehicleRepository()
