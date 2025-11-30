import { Message } from '@/types/Message'

const DB_NAME = process.env.VUE_APP_CHAT_CACHE_DB_NAME || 'wp-chat-cache'
const DB_VERSION = 1
const MESSAGE_STORE = 'chatMessages'

type CachedChatMessages = {
  key: string
  wpClientId: string
  chatId: string
  messages: Message[]
  updatedAt: number
}

class ChatCache {
  private dbPromise: Promise<IDBDatabase | null> | null = null

  private buildKey(wpClientId: string, chatId: string): string {
    return `${wpClientId}-${chatId}`
  }

  private async getDb(): Promise<IDBDatabase | null> {
    if (typeof indexedDB === 'undefined') {
      return null
    }

    if (this.dbPromise) {
      return this.dbPromise
    }

    this.dbPromise = new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(MESSAGE_STORE)) {
          db.createObjectStore(MESSAGE_STORE, { keyPath: 'key' })
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => resolve(null)
    })

    return this.dbPromise
  }

  async cacheMessages(wpClientId: string, chatId: string, messages: Message[]): Promise<void> {
    const db = await this.getDb()
    if (!db) return

    const payload: CachedChatMessages = {
      key: this.buildKey(wpClientId, chatId),
      wpClientId,
      chatId,
      messages,
      updatedAt: Date.now()
    }

    await new Promise<void>((resolve) => {
      const tx = db.transaction(MESSAGE_STORE, 'readwrite')
      tx.objectStore(MESSAGE_STORE).put(payload)
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
  }

  async getMessages(wpClientId: string, chatId: string): Promise<Message[]> {
    const db = await this.getDb()
    if (!db) return []

    return new Promise((resolve) => {
      const tx = db.transaction(MESSAGE_STORE, 'readonly')
      const request = tx.objectStore(MESSAGE_STORE).get(this.buildKey(wpClientId, chatId))
      request.onsuccess = () => resolve((request.result as CachedChatMessages | undefined)?.messages || [])
      request.onerror = () => resolve([])
    })
  }

  async deleteChatMessages(wpClientId: string, chatId: string): Promise<void> {
    const db = await this.getDb()
    if (!db) return

    await new Promise<void>((resolve) => {
      const tx = db.transaction(MESSAGE_STORE, 'readwrite')
      tx.objectStore(MESSAGE_STORE).delete(this.buildKey(wpClientId, chatId))
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
  }
}

export default new ChatCache()
