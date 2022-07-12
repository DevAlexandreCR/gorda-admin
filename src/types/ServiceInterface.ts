import {LocationType} from '@/types/LocationType'
import {Applicant} from '@/types/Applicant'

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
  driver_id: string | null
  client_id: string | null
  created_at: number
}