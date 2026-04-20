import { Chat } from '@/types/Chat'
import { Message } from '@/types/Message'
import serverApi, { ApiResponse } from '@/services/gordaApi/server/ServerApi'

class ChatRepository {
  async getChats(wpClientId: string): Promise<Map<string, Chat>> {
    const response = await serverApi.get<ApiResponse<{ chats: Chat[] }>>(
      `/whatsapp/clients/${wpClientId}/chats`
    )
    const chats = new Map<string, Chat>()

    for (const chat of response.data.data.chats ?? []) {
      chats.set(chat.id, chat)
    }

    return chats
  }

  async updateChat(wpClientId: string, chatId: string, data: Partial<Chat>): Promise<Chat | null> {
    const response = await serverApi.patch<ApiResponse<{ chat: Chat }>>(
      `/whatsapp/clients/${wpClientId}/chats/${chatId}`,
      data
    )

    return response.data.data.chat ?? null
  }

  async getMessages(wpClientId: string, chatId: string): Promise<Map<string, Message>> {
    const response = await serverApi.get<ApiResponse<{ messages: Message[] }>>(
      `/whatsapp/clients/${wpClientId}/chats/${chatId}/messages`
    )
    const messages = new Map<string, Message>()

    for (const message of response.data.data.messages ?? []) {
      messages.set(message.id, {
        ...message,
        from: message.fromMe ? wpClientId : chatId
      })
    }

    return messages
  }

  mergeMessages(messages: Message[]): Message[] {
    return Array.from(
      messages.reduce((mergedMessages, message) => {
        mergedMessages.set(message.id, message)
        return mergedMessages
      }, new Map<string, Message>()).values()
    ).sort((a, b) => a.created_at - b.created_at)
  }
}

export default new ChatRepository()
