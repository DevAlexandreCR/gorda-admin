import {VehicleInterface} from "@/types/VehicleInterface";
import {DeviceType} from '@/types/DeviceType'

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
	device: DeviceType|null
  enabled_at: number
  created_at: number
}