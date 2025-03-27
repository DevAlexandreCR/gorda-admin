import {DriverInterface} from "@/types/DriverInterface";
import Vehicle from "@/models/Vehicle";
import {VehicleInterface} from "@/types/VehicleInterface";
import dayjs from 'dayjs'
import {DeviceType} from '@/types/DeviceType'
import { DriverPaymentMode } from "@/constants/DriverPaymentMode";

export default class Driver implements DriverInterface {

  id: string
  created_at: number
  last_connection: number = 0;
  docType: string
  document: string
  email: string
  password: string|null
  enabled_at = 0
  name: string
  phone: string
  phone2: string | null = null
  photoUrl: string | null
  vehicle: VehicleInterface
  device: DeviceType | null = null
  balance = 0
  paymentMode: DriverPaymentMode = DriverPaymentMode.MONTHLY

  constructor() {
    this.id = ''
    this.created_at = dayjs().unix()
    this.photoUrl = null
		this.password = null
    this.vehicle = new Vehicle()
    this.phone2 = null
  }

  isEnabled(): boolean {
    return !!this.enabled_at
  }
}