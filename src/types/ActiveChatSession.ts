import { PlaceInterface } from '@/types/PlaceInterface'

export type ActiveChatSession = {
  sessionId: string
  status: string
  service_id: string | null
  notifications: {
    assigned: boolean
    arrived: boolean
    greeting: boolean
    completed: boolean
  }
  place: PlaceInterface | null
  placeOptions?: Array<{
    option: number
    placeId: string
  }>
}
