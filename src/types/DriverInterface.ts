import {VehicleInterface} from "@/types/VehicleInterface";
import {DeviceType} from '@/types/DeviceType'
import { DriverPaymentMode } from "@/constants/DriverPaymentMode";
import { Vehicle, DriverVehicleLink } from "@/types/Vehicle";

export interface DriverInterface {
  id: string
  name: string
  email: string
	password: string|null
	phone: string
	phone2: string|null
  docType: string
  paymentMode: DriverPaymentMode
  document: string
  photoUrl: string|null
  vehicle?: VehicleInterface
  selected_vehicle: Vehicle | null
  selected_vehicle_id: string | null
  roster: DriverVehicleLink[]
  active_vehicle_id: string | null
  device: DeviceType | null
  balance: number
  enabled_at: number
  created_at: number
  last_connection: number
}
