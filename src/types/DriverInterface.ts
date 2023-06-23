import {VehicleInterface} from "@/types/VehicleInterface";

export interface DriverInterface {
  id: string
  name: string
  email: string
	password: string|null
	phone: string
  docType: string
  document: string
  photoUrl: string|null
  vehicle: VehicleInterface
  enabled_at: number
  created_at: number
}