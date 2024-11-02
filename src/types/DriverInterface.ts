import {VehicleInterface} from "@/types/VehicleInterface";
import {DeviceType} from '@/types/DeviceType'
import { DriverPaymentMode } from "@/constants/DriverPaymentMode";

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
  vehicle: VehicleInterface
  device: DeviceType | null
  balance: number
  enabled_at: number
  created_at: number
}