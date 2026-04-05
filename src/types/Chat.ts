import {Message} from '@/types/Message'
import {ActiveChatSession} from '@/types/ActiveChatSession'

export type Chat = {
  id: string
  archived: boolean
  clientName: string
  lastMessage: Message
  updated_at: number
  activeSession?: ActiveChatSession
}
