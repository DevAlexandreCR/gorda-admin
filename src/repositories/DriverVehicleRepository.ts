import serverApi, { ApiResponse } from '@/services/gordaApi/server/ServerApi'
import { DriverVehicleLink, Vehicle } from '@/types/Vehicle'

class DriverVehicleRepository {
  async listForDriver(driverId: string): Promise<DriverVehicleLink[]> {
    const response = await serverApi.get<ApiResponse<{ vehicles: DriverVehicleLink[] }>>(`/drivers/${driverId}/vehicles`)
    return response.data.data.vehicles ?? []
  }

  async link(driverId: string, data: { vehicleId: string } | { vehicle: Partial<Vehicle> }): Promise<void> {
    await serverApi.post(`/drivers/${driverId}/vehicles`, data)
  }

  async setSelectable(driverId: string, vehicleId: string, selectable: boolean, confirmed?: boolean): Promise<void> {
    await serverApi.patch(`/drivers/${driverId}/vehicles/${vehicleId}`, { selectable, ...(confirmed !== undefined ? { confirmed } : {}) })
  }

  async setSelected(driverId: string, vehicleId: string): Promise<void> {
    await serverApi.post(`/drivers/${driverId}/selected-vehicle`, { vehicleId })
  }
}

export default new DriverVehicleRepository()
