import {DriverInterface} from "@/entities/DriverInterface";

export default class Driver implements DriverInterface {

  created_at: string
  docType: string
  document: string
  email: string
  enabled_at: string | null
  id: string
  name: string
  phone: string
  photoUrl: string | null
  vehicle: { brand: string; model: string; photoUrl: string }
  
  isEnabled(): boolean {
    return !!this.enabled_at
  }
}