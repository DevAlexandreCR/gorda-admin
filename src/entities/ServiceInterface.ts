export interface ServiceInterface {
  id: string | null
  status: string
  start_address: string
  end_address: string | null
  phone: string
  name: string
  comment: string | null
  amount: number | null
  driver_id: string | null
  client_id: string | null
  created_at: number
}