import {LocationType} from '@/types/LocationType'
import {Applicant} from '@/types/Applicant'
import { Metadata } from './Metadata'

export interface ServiceInterface {
  id: string | null
  status: string
  start_loc: LocationType
  end_loc: LocationType | null
  applicants: Applicant | null
  phone: string
  name: string
  comment: string | null
  amount: number | null
  metadata: Metadata | null
  wp_client_id: string
  driver_id: string | null
  client_id: string | null
  created_at: number
  created_by: string | null 
  assigned_by: string | null 
  canceled_by: string | null
  terminated_by: string | null 
}