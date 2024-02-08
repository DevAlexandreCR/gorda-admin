import {LocationType} from '@/types/LocationType'
import {Applicants} from '@/types/Applicants'
import { Metadata } from './Metadata'

export interface ServiceInterface {
  id: string | null
  status: string
  start_loc: LocationType
  end_loc: LocationType | null
  applicants: Applicants | null
  phone: string
  name: string
  comment: string | null
  amount: number | null
  metadata: Metadata | null
  wp_client_id: string
  driver_id: string | null
  client_id: string | null
  created_at: number
}