import { defineStore } from 'pinia'
import { Chat } from '@/types/Chat'
import { Message } from '@/types/Message'
import ChatRepository from '@/repositories/ChatRepository'
import pingSound from '@/assets/sounds/ping.mp3'
import DateHelper from "@/helpers/DateHelper"
import { ChatThemes } from "@/services/gordaApi/constants/ChatThemes"
import { MessageTypes } from "@/types/MessageTypes"
import i18n from "@/plugins/i18n"

export const useWpChatStore = defineStore('wpChatStore', {
  state: () => {
    return {
      chats: new Map<string, Chat>(),
      allChats: new Map<string, Chat>(),
      messages: new Map<string, Message[]>(),
      activeChat: null as string | null,
      hasPermission: false,
      lastNotify: 0,
      firstStart: true,
      theme: ChatThemes.DARK as ChatThemes
    }
  },
  getters: {
    sortedChats: (state) => {
      // Return chats sorted by updated_at descending (newest first)
      return new Map([...state.chats.entries()].sort((a, b) => b[1].updated_at - a[1].updated_at))
    },
    sortedAllChats: (state) => {
      // Return all chats sorted by updated_at descending (newest first)
      return new Map([...state.allChats.entries()].sort((a, b) => b[1].updated_at - a[1].updated_at))
    }
  },
  actions: {
    shouldShowAsUnread(chat: Chat): boolean {
      // Only show as unread if:
      // 1. Chat is not archived
      // 2. Last message is NOT from me (fromMe = false means it's from the user)
      return !chat.archived
    },

    clearPlaceholderChats(): void {
      // Remove any placeholder chats that were created during search
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

      // Mark the chat as read (archived) when it becomes active
      this.markChatAsRead(chatId)
    },

    markChatAsRead(chatId: string): void {
      // Update in both chats and allChats maps
      const chat = this.chats.get(chatId)
      const allChat = this.allChats.get(chatId)

      if (chat && !chat.archived) {
        // Create a new object to trigger reactivity
        const updatedChat = { ...chat, archived: true }
        this.chats.set(chatId, updatedChat)
      }

      if (allChat && !allChat.archived) {
        // Create a new object to trigger reactivity
        const updatedAllChat = { ...allChat, archived: true }
        this.allChats.set(chatId, updatedAllChat)
      }
    },

    getChats(wpClientId: string): void {
      ChatRepository.getChats(wpClientId, async (chats) => {
        // Only clear placeholder chats, not all chats
        for (const [chatId, chat] of this.chats.entries()) {
          if (chat.lastMessage.body === 'Buscar conversación...') {
            this.chats.delete(chatId)
            this.messages.delete(chatId)
          }
        }

        for (const chat of Array.from(chats.values())) {
          // Skip chats with DEFAULT_MESSAGE as they are placeholders
          if (chat.lastMessage.body === 'DEFAULT_MESSAGE') {
            continue
          }

          const existingChat = this.chats.get(chat.id)
          const lastMessage = existingChat?.lastMessage

          // Only process if it's a new chat or if the message has changed
          if (!existingChat || (lastMessage && chat.lastMessage.id !== lastMessage.id)) {
            if (lastMessage && chat.lastMessage.id !== lastMessage.id) {
              this.getMessages(wpClientId, chat.id)
              // Only notify if it's not from me (fromMe = false means it's from the user)
              if (!this.firstStart && !chat.lastMessage.fromMe) {
                this.notify(chat)
              }
            }
            this.chats.set(chat.id, chat)
            this.allChats.set(chat.id, chat)
          }
        }
        this.firstStart = false
      })
    },
    filterChat(chatId: string): void {
      if (chatId.length === 0) {
        this.chats = new Map(this.allChats)
        return
      } else if (chatId.length > 10) {
        return
      } else if (/^\d+$/.test(chatId)) {
        this.chats = new Map<string, Chat>(Array.from(this.allChats.entries()).filter(([id]) => id.includes(chatId)))

        // Only create a placeholder chat if no existing chats found and the chatId is valid
        if (this.chats.size === 0 && chatId.length >= 8) {
          const placeholderChat: Chat = {
            id: chatId,
            archived: false, // Changed from true to false so it shows as unread
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
          this.messages.set(chatId, [])
        }
      }
    },
    async getMessages(wpClientId: string, chatId: string): Promise<void> {
      // Don't fetch messages for placeholder chats
      const chat = this.chats.get(chatId)
      if (chat && chat.lastMessage.body === 'Buscar conversación...') {
        return
      }

      await ChatRepository.getMessages(wpClientId, chatId, (messages) => {
        // Convert to array and sort by created_at ascending (oldest first for chat display)
        const sortedMessages = Array.from(messages.values()).sort((a, b) => a.created_at - b.created_at)
        this.messages.set(chatId, sortedMessages)
      })

      // Mark chat as read and update in database
      if (this.activeChat && this.activeChat === chatId) {
        const existingChat = this.chats.get(chatId)
        if (existingChat && existingChat.lastMessage.body !== 'Buscar conversación...') {
          // Update in database
          await ChatRepository.updateChat(wpClientId, chatId, { archived: true })
          // Update in local state
          this.markChatAsRead(chatId)
        }
      }
    },
    notify(chat: Chat): void {
      // Don't notify for messages from me (system/admin messages)
      if (chat.lastMessage.fromMe) {
        return
      }

      if (this.hasPermission && DateHelper.unix() - this.lastNotify > 5) {
        this.lastNotify = DateHelper.unix()
        const notificationSound = new Audio(pingSound)
        notificationSound.play().catch(error => console.log('Error playing the notification sound:', error))
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
        Notification.requestPermission().then(permission => {
          this.hasPermission = permission === 'granted'
        })
      }
    },
  }
})
