
export interface ServiceInterface {
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
}