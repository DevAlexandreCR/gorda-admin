import {ServiceInterface} from '@/types/ServiceInterface'
import dayjs from 'dayjs'
import ServiceRepository from '@/repositories/ServiceRepository'
import {LocationType} from '@/types/LocationType'
import {Applicant} from '@/types/Applicant'
import { Metadata } from '@/types/Metadata'
import {useWpClientsStore} from "@/services/stores/WpClientStore";

export default class Service implements ServiceInterface {
  id: string
  status: string
  start_loc: LocationType
  end_loc: LocationType | null = null
  phone: string
  name: string
  amount: number | null = null
  applicants: Applicant | null = null
  metadata: Metadata | null = null
  wp_client_id: string
  driver_id: string | null = null
  client_id: string | null = null
  created_at: number
  comment: string | null = null
  a_go = 0

  static readonly STATUS_PENDING = 'pending'
  static readonly STATUS_IN_PROGRESS = 'in_progress'
  static readonly STATUS_TERMINATED = 'terminated'
  static readonly STATUS_CANCELED = 'canceled'
  static readonly EVENT_CANCEL = 'cancel-service'
  static readonly EVENT_TERMINATE = 'end-service'
  static readonly EVENT_ASSIGN = 'assign-service'
  static readonly EVENT_RELEASE = 'release-service'


  constructor() {
    const {defaultClient} =  useWpClientsStore()
    this.id = dayjs().unix().toString()
    this.created_at = dayjs().unix()
    this.status = Service.STATUS_PENDING
    this.wp_client_id = defaultClient as string
  }

  isPending(): boolean {
    return this.status === Service.STATUS_PENDING
  }

  isInProgress(): boolean {
    return this.status === Service.STATUS_IN_PROGRESS
  }

  isEnd(): boolean {
    return this.status === Service.STATUS_CANCELED || this.status === Service.STATUS_TERMINATED
  }

  async update(data: ServiceInterface): Promise<Service> {
    await ServiceRepository.update(data)
    return this
  }
}