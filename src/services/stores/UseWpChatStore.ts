import {defineStore} from 'pinia'
import {Chat} from '@/types/Chat'
import {Message} from '@/types/Message'
import ChatRepository from '@/repositories/ChatRepository'
import pingSound from '@/assets/sounds/ping.mp3'
import DateHelper from "@/helpers/DateHelper";
import {ChatThemes} from "@/services/gordaApi/constants/ChatThemes";
import {MessageTypes} from "@/types/MessageTypes";

export const useWpChatStore = defineStore('wpChatStore', {
  state: () => {
    return {
      chats: new Map<string, Chat>(),
      allChats: new Map<string, Chat>(),
      messages: new Map<string, Message[]>(),
      activeChat: null as string|null,
      hasPermission: false,
      lastNotify: 0,
      firstStart: true,
      theme: ChatThemes.DARK as ChatThemes
    }
  },
  actions: {
    getConfig(): void {
      this.activeChat = sessionStorage.getItem('activeChat') || null
      this.theme = sessionStorage.getItem('theme') as ChatThemes || ChatThemes.DARK
    },
    setActiveChat(chatId: string): void {
      this.activeChat = chatId
      sessionStorage.setItem('activeChat', chatId)
    },

    getChats(wpClientId: string): void {
      ChatRepository.getChats(wpClientId, async (chats) => {
        for (const chat of Array.from(chats.values())) {
          const lastMessage = this.chats.get(chat.id)?.lastMessage
          if (lastMessage && chat.lastMessage.id !== lastMessage.id) {
            if (!this.firstStart && !chat.lastMessage.fromMe) {
              this.notify()
            }
          }
          this.chats.set(chat.id, chat)
          this.allChats.set(chat.id, chat)
        }
        this.firstStart = false
      })
    },
    filterChat(chatId: string): void {
      if (chatId.length === 0) {
        this.chats = this.allChats
        return
      } else if (chatId.length > 10) {
        return
      } else if (/^\d+$/.test(chatId)){
        this.chats = new Map<string, Chat>(Array.from(this.allChats.entries()).filter(([id]) => id.includes(chatId)))
        if (this.chats.size === 0) {
          this.chats.set(chatId, {
            id: chatId,
            archived: true,
            clientName: 'No Chats',
            updated_at: DateHelper.unix(),
            lastMessage: {
              id: chatId,
              created_at: DateHelper.unix(),
              type: MessageTypes.TEXT,
              body: '',
              fromMe: true,
              from: chatId
            }
          })
          this.messages.set(this.activeChat || chatId, [])
        }
      }
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
    setTheme(theme: ChatThemes): void {
      sessionStorage.setItem('theme', theme)
      this.theme = theme
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
