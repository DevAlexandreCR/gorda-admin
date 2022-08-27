import {DriverInterface} from "@/types/DriverInterface";
import Vehicle from "@/models/Vehicle";
import {VehicleInterface} from "@/types/VehicleInterface";
import dayjs from 'dayjs'

export default class Driver implements DriverInterface {

  id: string
  created_at: number
  docType: string
  document: string
  email: string
  enabled_at = 0
  name: string
  phone: string
  photoUrl: string | null
  vehicle: VehicleInterface
  
  constructor() {
    this.id = ''
    this.created_at = dayjs().unix()
    this.photoUrl = null
    this.vehicle = new Vehicle()
  }
  
  isEnabled(): boolean {
    return !!this.enabled_at
  }
}