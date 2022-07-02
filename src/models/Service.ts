import {ServiceInterface} from '@/types/ServiceInterface'
import dayjs from 'dayjs'
import ServiceRepository from '@/repositories/ServiceRepository'
import {LocationType} from '@/types/LocationType'
import {Applicant} from '@/types/Applicant'

export default class Service implements ServiceInterface {
  id: string
  status: string
  start_loc: LocationType
  end_loc: LocationType | null
  phone: string
  name: string
  amount: number | null
  applicants: Applicant | null
  driver_id: string | null
  client_id: string | null
  created_at: number
  comment: string | null
  aGo: string = ''

  static readonly STATUS_PENDING = 'pending'
  static readonly STATUS_IN_PROGRESS = 'in_progress'
  static readonly STATUS_TERMINATED = 'terminated'
  static readonly STATUS_CANCELED = 'canceled'
  static readonly EVENT_CANCEL = 'cancel-service'
  static readonly EVENT_TERMINATE = 'end-service'
  static readonly EVENT_ASSIGN = 'assign-service'
  static readonly EVENT_RELEASE = 'release-service'

  constructor() {
    this.id = dayjs().unix().toString()
    this.created_at = dayjs().unix()
    this.status = Service.STATUS_PENDING
    this.start_loc = { name: '' }
    this.amount = null
    this.comment = null
    this.driver_id = null
    this.end_loc = null
    this.applicants = null
  }

  isPending(): boolean {
    return this.status === Service.STATUS_PENDING
  }

  isinProgress(): boolean {
    return this.status === Service.STATUS_IN_PROGRESS
  }
  
  async update(data: ServiceInterface): Promise<Service> {
    await ServiceRepository.update(data)
    return this
  }
}