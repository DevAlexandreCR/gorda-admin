import {VehicleInterface} from "@/entities/VehicleInterface";

export interface DriverInterface {
  id: string|null
  name: string
  email: string
  phone: string
  docType: string
  document: string
  photoUrl: string|null
  vehicle: VehicleInterface
  enabled_at: number|null
  created_at: number
}