import {ServiceInterface} from '@/entities/ServiceInterface'
import dayjs from 'dayjs'

export default class Service implements ServiceInterface {
  id: string
  status: string
  start_address: string
  end_address: string | null
  phone: string
  name: string
  amount: number | null
  driver_id: string | null
  client_id: string | null
  created_at: number
  comment: string | null

  static readonly STATUS_PENDING = 'pending'
  static readonly STATUS_IN_PROGRESS = 'in_progress'
  static readonly STATUS_TERMINATED = 'terminated'
  static readonly STATUS_CANCELED = 'canceled'

  constructor() {
    this.created_at = dayjs().unix()
    this.status = Service.STATUS_PENDING
  }
}