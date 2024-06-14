import {LocationType} from '@/types/LocationType'
import {MessageTypes} from '@/types/MessageTypes'

export type Message = {
  id: string
  created_at: number
  type: MessageTypes
  body: string
  fromMe: boolean
  location?: LocationType
}
