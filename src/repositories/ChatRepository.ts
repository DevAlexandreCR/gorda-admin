import {Chat} from '@/types/Chat'
import FSService from '@/services/FSService'
import {limitToLast, orderBy, query, onSnapshot} from 'firebase/firestore'
import {Message} from '@/types/Message'

class ChatRepository {
  getChats(wpClientId: string, listener: (chats: Map<string, Chat>) => void): void {
    const chatCollection = FSService.chatsCollection(wpClientId)
    const chats = new Map<string, Chat>()
    const queryChats = query(chatCollection, orderBy('updated_at', 'desc'), limitToLast(100))

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

  getMessages(wpClientId: string, chatId: string, listener: (messages: Map<string, Message>) => void): void {
    const messageCollection = FSService.wpMessagesCollection(wpClientId, chatId)
    const messages = new Map<string, Message>()
    const queryMessages = query(messageCollection, orderBy('created_at'), limitToLast(10))

    onSnapshot(queryMessages, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const message = change.doc.data() as Message
          message.from = message.fromMe ? wpClientId : chatId
          messages.set(message.id, message)
        }
      })
      listener(messages)
    }, (error) => {
      console.log(error.message)
    })
  }
}

export default new ChatRepository()