import {ServiceInterface} from '@/entities/ServiceInterface'

export default class Service {
  id: string
  status: string
  start_address: string
  end_address: string|null
  phone: string
  name: string
  amount: number|null
  driver_id: string|null
  client_id: string|null
  created_at: string

  constructor(service: ServiceInterface) {
    this.id = service.id
    this.name = service.name
    this.phone = service.phone
    this.amount = service.amount
    this.start_address = service.start_address
    this.end_address = service.end_address
    this.driver_id = service.driver_id
    this.client_id = service.client_id
    this.created_at = service.created_at
  }
}