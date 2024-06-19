import {defineStore} from 'pinia'
import {Chat} from '@/types/Chat'
import {Message} from '@/types/Message'
import ChatRepository from '@/repositories/ChatRepository'

export const useWpChatStore = defineStore('wpChatStore', {
  state: () => {
    return {
      chats: new Map<string, Chat>(),
      messages: new Map<string, Message[]>(),
      activeChat: null as string|null
    }
  },
  actions: {
    setActiveChat(chatId: string): void {
      this.activeChat = chatId
    },

    getChats(wpClientId: string): void {
      ChatRepository.getChats(wpClientId, async (chats) => {
        for (const chat of Array.from(chats.values())) {
          this.chats.set(chat.id, chat)
          await this.getMessages(wpClientId, chat.id)
        }
      })
    },
    async getMessages(wpClientId: string, chatId: string): Promise<void> {
      await ChatRepository.getMessages(wpClientId, chatId, (messages) => {
        this.messages.set(chatId, Array.from(messages.values()))
      })
      if (this.activeChat) {
        await ChatRepository.updateChat(wpClientId, this.activeChat, {archived: true})
      }
    }
  }
})
