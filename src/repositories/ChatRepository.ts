import { Chat } from '@/types/Chat'
import FSService from '@/services/FSService'
import { orderBy, query, onSnapshot, getDocs, doc, updateDoc, limit } from 'firebase/firestore'
import { Message } from '@/types/Message'

class ChatRepository {
  getChats(wpClientId: string, listener: (chats: Map<string, Chat>) => void): void {
    const chatCollection = FSService.chatsCollection(wpClientId)
    const chats = new Map<string, Chat>()
    const queryChats = query(chatCollection, orderBy('updated_at', 'desc'), limit(100))

    onSnapshot(queryChats, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const chat = change.doc.data() as Chat
          chats.set(chat.id, chat)
        }
      })
      listener(chats)
    }, (error) => {
      console.log(error.message)
    })
  }

  async updateChat(wpClientId: string, chatId: string, data: Partial<Chat>): Promise<void> {
    const chatCollection = FSService.chatsCollection(wpClientId)
    await updateDoc(doc(chatCollection, chatId), data).catch(error => {
      console.log(error.message)
    })
  }

  async getMessages(wpClientId: string, chatId: string, listener: (messages: Map<string, Message>) => void): Promise<void> {
    const messageCollection = FSService.wpMessagesCollection(wpClientId, chatId)
    const messages = new Map<string, Message>()
    // Get last 50 messages in ascending order, then we'll reverse them
    const queryMessages = query(messageCollection, orderBy('created_at', 'desc'), limit(50))

    await getDocs(queryMessages).then((snapshot) => {
      snapshot.forEach((doc) => {
        const message = doc.data() as Message
        message.from = message.fromMe ? wpClientId : chatId
        messages.set(message.id, message)
      })
      listener(messages)
    }).catch(error => {
      console.log(error.message)
    })
  }
}

export default new ChatRepository()