import {defineStore} from 'pinia'
import {Chat} from '@/types/Chat'
import {Message} from '@/types/Message'
import ChatRepository from '@/repositories/ChatRepository'

export const useWpChatStore = defineStore('wpChatStore', {
  state: () => {
    return {
      chats: new Map<string, Chat>(),
      messages: new Map<string, Message>()
    }
  },
  actions: {
    getChats(wpClientId: string): void {
      ChatRepository.getChats(wpClientId, (chats) => {
        this.chats = chats
      })
    },
    getMessages(message: Message): void {
      this.messages.set(message.id, message)
    }
  }
})
