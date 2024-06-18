import {Message} from '@/types/Message'

export type Chat = {
  id: string
  archived: boolean
  clientName: string
  lastMessage: Message
}
