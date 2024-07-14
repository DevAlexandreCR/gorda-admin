import {defineStore} from 'pinia'
import {Chat} from '@/types/Chat'
import {Message} from '@/types/Message'
import ChatRepository from '@/repositories/ChatRepository'
import pingSound from '@/assets/sounds/ping.mp3'
import DateHelper from "@/helpers/DateHelper";

export const useWpChatStore = defineStore('wpChatStore', {
  state: () => {
    return {
      chats: new Map<string, Chat>(),
      messages: new Map<string, Message[]>(),
      activeChat: null as string|null,
      hasPermission: false,
      lastNotify: 0,
      firstStart: true
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
          if (!this.firstStart && !chat.lastMessage.fromMe) {
            this.notify()
          }
        }
        this.firstStart = false
      })
    },
    async getMessages(wpClientId: string, chatId: string): Promise<void> {
      await ChatRepository.getMessages(wpClientId, chatId, (messages) => {
        this.messages.set(chatId, Array.from(messages.values()))
      })
      if (this.activeChat) {
        await ChatRepository.updateChat(wpClientId, this.activeChat, {archived: true})
      }
    },
    notify(): void {
      if (this.hasPermission && DateHelper.unix() - this.lastNotify > 5) {
        this.lastNotify = DateHelper.unix()
        const notificationSound = new Audio(pingSound)
        notificationSound.play().catch(error => console.log('Error playing the notification sound:', error))
      }
    },
    checkPermission() {
      if (!('Notification' in window)) {
        alert('This browser does not support desktop notification');
      } else if (Notification.permission === 'granted') {
        this.hasPermission = true;
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          this.hasPermission = permission === 'granted';
        });
      }
    },
  }
})
