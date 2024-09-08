import {DriverInterface} from "@/types/DriverInterface";
import Vehicle from "@/models/Vehicle";
import {VehicleInterface} from "@/types/VehicleInterface";
import dayjs from 'dayjs'
import {DeviceType} from '@/types/DeviceType'

export default class Driver implements DriverInterface {

  id: string
  created_at: number
  docType: string
  document: string
  email: string
  password: string|null
  enabled_at = 0
  name: string
  phone: string
  photoUrl: string | null
  vehicle: VehicleInterface
  device: DeviceType | null = null
  balance = 0

  constructor() {
    this.id = ''
    this.created_at = dayjs().unix()
    this.photoUrl = null
		this.password = null
		this.vehicle = new Vehicle()
  }

  isEnabled(): boolean {
    return !!this.enabled_at
  }
}