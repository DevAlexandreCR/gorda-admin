import { defineStore } from 'pinia'
import { Chat } from '@/types/Chat'
import { Message } from '@/types/Message'
import ChatRepository from '@/repositories/ChatRepository'
import pingSound from '@/assets/sounds/ping.mp3'
import DateHelper from '@/helpers/DateHelper'
import { ChatThemes } from '@/services/gordaApi/constants/ChatThemes'
import { MessageTypes } from '@/types/MessageTypes'
import i18n from '@/plugins/i18n'
import ChatCache from '@/services/ChatCache'

export const useWpChatStore = defineStore('wpChatStore', {
  state: () => {
    return {
      chats: new Map<string, Chat>(),
      allChats: new Map<string, Chat>(),
      messages: new Map<string, Message[]>(),
      activeChat: null as string | null,
      activeWpClientId: null as string | null,
      hasPermission: false,
      lastNotify: 0,
      firstStart: true,
      theme: ChatThemes.DARK as ChatThemes
    }
  },
  getters: {
    sortedChats: (state) => {
      return new Map([...state.chats.entries()].sort((a, b) => b[1].updated_at - a[1].updated_at))
    },
    sortedAllChats: (state) => {
      return new Map([...state.allChats.entries()].sort((a, b) => b[1].updated_at - a[1].updated_at))
    }
  },
  actions: {
    shouldShowAsUnread(chat: Chat): boolean {
      return !chat.archived && !chat.lastMessage.fromMe
    },

    clearPlaceholderChats(): void {
      for (const [chatId, chat] of this.chats.entries()) {
        if (chat.lastMessage.body === 'Buscar conversación...') {
          this.chats.delete(chatId)
          this.messages.delete(chatId)
        }
      }

      for (const [chatId, chat] of this.allChats.entries()) {
        if (chat.lastMessage.body === 'Buscar conversación...') {
          this.allChats.delete(chatId)
        }
      }
    },

    getConfig(): void {
      this.activeChat = sessionStorage.getItem('activeChat') || null
      this.theme = sessionStorage.getItem('theme') as ChatThemes || ChatThemes.DARK
    },

    setActiveChat(chatId: string): void {
      this.activeChat = chatId
      sessionStorage.setItem('activeChat', chatId)
      this.keepOnlyChatMessages(chatId)
      this.markChatAsRead(chatId)
    },

    markChatAsRead(chatId: string): void {
      const chat = this.chats.get(chatId)
      const allChat = this.allChats.get(chatId)

      if (chat && !chat.archived) {
        this.chats.set(chatId, { ...chat, archived: true })
      }

      if (allChat && !allChat.archived) {
        this.allChats.set(chatId, { ...allChat, archived: true })
      }
    },

    getChats(wpClientId: string): void {
      ChatRepository.getChats(wpClientId)
        .then((chats) => {
          this.clearPlaceholderChats()

          for (const chat of Array.from(chats.values())) {
            this.upsertChat(chat)
          }

          this.firstStart = false
        })
        .catch((error) => {
          void error
        })
    },

    upsertChat(chat: Chat): void {
      if (chat.lastMessage.body === 'DEFAULT_MESSAGE') {
        return
      }

      const existingChat = this.allChats.get(chat.id) ?? this.chats.get(chat.id)
      const hasNewMessage = existingChat?.lastMessage.id !== chat.lastMessage.id

      if (hasNewMessage && existingChat && !this.firstStart && !chat.lastMessage.fromMe) {
        this.notify(chat)
      }

      this.chats.set(chat.id, chat)
      this.allChats.set(chat.id, chat)
    },

    updateChatActiveSession(chatId: string, activeSession: Chat['activeSession']): void {
      const chat = this.chats.get(chatId)
      const allChat = this.allChats.get(chatId)

      if (chat) {
        this.chats.set(chatId, { ...chat, activeSession })
      }

      if (allChat) {
        this.allChats.set(chatId, { ...allChat, activeSession })
      }
    },

    filterChat(chatId: string): void {
      if (chatId.length === 0) {
        this.chats = new Map(this.allChats)
        return
      }

      if (chatId.length > 10) {
        return
      }

      if (/^\d+$/.test(chatId)) {
        this.chats = new Map<string, Chat>(
          Array.from(this.allChats.entries()).filter(([id]) => id.includes(chatId))
        )

        if (this.chats.size === 0 && chatId.length >= 8) {
          const placeholderChat: Chat = {
            id: chatId,
            archived: false,
            clientName: 'Chat ' + chatId,
            updated_at: DateHelper.unix(),
            lastMessage: {
              id: 'placeholder_' + chatId,
              created_at: DateHelper.unix(),
              type: MessageTypes.TEXT,
              body: 'Buscar conversación...',
              fromMe: false,
              from: chatId
            }
          }
          this.chats.set(chatId, placeholderChat)
          this.setMessagesForActiveChat(chatId, [])
        }
      }
    },

    setMessagesForActiveChat(chatId: string, messages: Message[]): void {
      if (this.activeChat !== chatId) {
        return
      }

      this.messages = new Map([[chatId, messages]])
    },

    keepOnlyChatMessages(chatId: string | null): void {
      if (!chatId) {
        this.messages = new Map()
        this.activeWpClientId = null
        return
      }

      const current = this.messages.get(chatId)
      this.messages = current ? new Map([[chatId, current]]) : new Map()
    },

    appendMessage(chatId: string, message: Message): void {
      const currentMessages = this.messages.get(chatId) ?? []
      const nextMessages = ChatRepository.mergeMessages([...currentMessages, message])

      if (this.activeWpClientId && this.activeChat === chatId) {
        ChatCache.cacheMessages(this.activeWpClientId, chatId, nextMessages).catch((error) => {
          void error
        })
      }

      if (this.activeChat === chatId) {
        this.setMessagesForActiveChat(chatId, nextMessages)
      }
    },

    async getMessages(wpClientId: string, chatId: string): Promise<void> {
      this.activeWpClientId = wpClientId
      const chat = this.chats.get(chatId)
      if (chat && chat.lastMessage.body === 'Buscar conversación...') {
        return
      }

      const cachedMessages = await ChatCache.getMessages(wpClientId, chatId)
      if (cachedMessages.length > 0) {
        this.setMessagesForActiveChat(chatId, cachedMessages)
      }

      await ChatRepository.getMessages(wpClientId, chatId)
        .then((messages) => {
          const existingMessages = this.messages.get(chatId) ?? cachedMessages
          const mergedMessages = ChatRepository.mergeMessages([
            ...existingMessages,
            ...Array.from(messages.values())
          ])

          ChatCache.cacheMessages(wpClientId, chatId, mergedMessages).catch((error) => {
            void error
          })

          this.setMessagesForActiveChat(chatId, mergedMessages)
        })
        .catch((error) => {
          void error
        })

      if (this.activeChat && this.activeChat === chatId) {
        const existingChat = this.chats.get(chatId)
        if (existingChat && existingChat.lastMessage.body !== 'Buscar conversación...') {
          await ChatRepository.updateChat(wpClientId, chatId, { archived: true })
          this.markChatAsRead(chatId)
        }
      }
    },

    notify(chat: Chat): void {
      if (chat.lastMessage.fromMe) {
        return
      }

      if (this.hasPermission && DateHelper.unix() - this.lastNotify > 5) {
        this.lastNotify = DateHelper.unix()
        const notificationSound = new Audio(pingSound)
        notificationSound.play().catch((error) => {
          void error
        })
        if (!document.hasFocus()) {
          new Notification(i18n.global.t('common.messages.new_message'), {
            body: chat.lastMessage.body,
            icon: '/favicon.ico'
          })
        }
      }
    },

    setTheme(theme: ChatThemes): void {
      sessionStorage.setItem('theme', theme)
      this.theme = theme
    },

    checkPermission() {
      if (!('Notification' in window)) {
        alert('This browser does not support desktop notification')
      } else if (Notification.permission === 'granted') {
        this.hasPermission = true
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          this.hasPermission = permission === 'granted'
        })
      }
    },
  }
})
