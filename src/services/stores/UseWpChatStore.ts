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
        Array.from(chats.values()).forEach((chat) => {
          this.chats.set(chat.id, chat)
          // const exists = Array.from(this.messages.values()).find((message) => message.from === chat.id)
          // if (exists) {
          //   this.getMessages(wpClientId, chat.id)
          // }
        })
      })
    },
    getMessages(wpClientId: string, chatId: string): void {
      ChatRepository.getMessages(wpClientId, chatId, (messages) => {
        Array.from(messages.values()).forEach((message) => {
          this.messages.set(message.id, message)
        })
      })
    }
  }
})
