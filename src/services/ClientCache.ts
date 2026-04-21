import { ClientInterface } from '@/types/ClientInterface'

const DB_NAME = process.env.VUE_APP_CLIENT_CACHE_DB_NAME || 'clients-cache'
const DB_VERSION = 2
const CLIENT_STORE = 'clients'
const META_STORE = 'meta'
const READY_META_KEY = 'clients-ready'
const LAST_SYNC_META_KEY = 'clients-last-synced-at'
const WRITE_BATCH_SIZE = 500

type CachedClientRecord = ClientInterface & {
  key: string
  nameLower: string
  phoneNormalized: string
}

type CachedMetaRecord = {
  key: string
  value: boolean | number
}

type HydrationState = {
  isReady: boolean
  lastSyncedAt: number | null
}

class ClientCache {
  private dbPromise: Promise<IDBDatabase | null> | null = null

  private buildKey(clientId: string): string {
    return clientId
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '')
  }

  private normalize(client: ClientInterface): CachedClientRecord {
    return {
      ...client,
      key: this.buildKey(client.id),
      nameLower: client.name.toLowerCase(),
      phoneNormalized: this.normalizePhone(client.phone),
    }
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
        let clientStore: IDBObjectStore
        if (!db.objectStoreNames.contains(CLIENT_STORE)) {
          clientStore = db.createObjectStore(CLIENT_STORE, { keyPath: 'key' })
        } else {
          clientStore = request.transaction?.objectStore(CLIENT_STORE) as IDBObjectStore
        }
        if (!clientStore.indexNames.contains('byName')) {
          clientStore.createIndex('byName', 'nameLower', { unique: false })
        }
        if (!clientStore.indexNames.contains('byPhone')) {
          clientStore.createIndex('byPhone', 'phoneNormalized', { unique: false })
        }

        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE, { keyPath: 'key' })
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => resolve(null)
    })

    return this.dbPromise
  }

  private async clearAll(db: IDBDatabase): Promise<void> {
    await new Promise<void>((resolve) => {
      const tx = db.transaction(CLIENT_STORE, 'readwrite')
      tx.objectStore(CLIENT_STORE).clear()
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
  }

  private async yieldToUi(): Promise<void> {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 0)
    })
  }

  private async writeBatch(db: IDBDatabase, clients: ClientInterface[]): Promise<void> {
    await new Promise<void>((resolve) => {
      const tx = db.transaction(CLIENT_STORE, 'readwrite')
      const store = tx.objectStore(CLIENT_STORE)
      clients.forEach((client) => store.put(this.normalize(client)))
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
  }

  private async setMetaValue(key: string, value: boolean | number): Promise<void> {
    const db = await this.getDb()
    if (!db) return

    await new Promise<void>((resolve) => {
      const tx = db.transaction(META_STORE, 'readwrite')
      tx.objectStore(META_STORE).put({ key, value } as CachedMetaRecord)
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
  }

  private async getMetaValue<T extends boolean | number>(key: string): Promise<T | null> {
    const db = await this.getDb()
    if (!db) return null

    return new Promise((resolve) => {
      const tx = db.transaction(META_STORE, 'readonly')
      const request = tx.objectStore(META_STORE).get(key)
      request.onsuccess = () => {
        const record = request.result as CachedMetaRecord | undefined
        resolve((record?.value as T | undefined) ?? null)
      }
      request.onerror = () => resolve(null)
    })
  }

  async replaceAll(clients: ClientInterface[]): Promise<void> {
    const db = await this.getDb()
    if (!db) return

    await this.clearAll(db)

    for (let start = 0; start < clients.length; start += WRITE_BATCH_SIZE) {
      const batch = clients.slice(start, start + WRITE_BATCH_SIZE)
      await this.writeBatch(db, batch)
      await this.yieldToUi()
    }

    const syncedAt = Date.now()
    await this.setMetaValue(READY_META_KEY, true)
    await this.setMetaValue(LAST_SYNC_META_KEY, syncedAt)
  }

  async getHydrationState(): Promise<HydrationState> {
    const [isReady, lastSyncedAt] = await Promise.all([
      this.getMetaValue<boolean>(READY_META_KEY),
      this.getMetaValue<number>(LAST_SYNC_META_KEY),
    ])

    return {
      isReady: isReady ?? false,
      lastSyncedAt,
    }
  }

  async upsert(client: ClientInterface): Promise<void> {
    const db = await this.getDb()
    if (!db) return

    await new Promise<void>((resolve) => {
      const tx = db.transaction(CLIENT_STORE, 'readwrite')
      tx.objectStore(CLIENT_STORE).put(this.normalize(client))
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
  }

  async getById(id: string): Promise<ClientInterface | null> {
    const db = await this.getDb()
    if (!db) return null

    return new Promise((resolve) => {
      const tx = db.transaction(CLIENT_STORE, 'readonly')
      const request = tx.objectStore(CLIENT_STORE).get(this.buildKey(id))
      request.onsuccess = () => {
        const record = request.result as CachedClientRecord | undefined
        if (!record) {
          resolve(null)
          return
        }
        const { key, nameLower, phoneNormalized, ...client } = record
        resolve(client as ClientInterface)
      }
      request.onerror = () => resolve(null)
    })
  }

  async search(term: string, limit = 100): Promise<ClientInterface[]> {
    const db = await this.getDb()
    if (!db) return []

    const normalizedTerm = term.toLowerCase()
    const numericTerm = term.replace(/\D/g, '')

    return new Promise((resolve) => {
      const results: ClientInterface[] = []
      const tx = db.transaction(CLIENT_STORE, 'readonly')
      const store = tx.objectStore(CLIENT_STORE)
      store.openCursor().onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result
        if (cursor?.value) {
          const record = cursor.value as CachedClientRecord
          const matchesName = normalizedTerm ? record.nameLower.includes(normalizedTerm) : true
          const matchesPhone = numericTerm ? record.phoneNormalized.includes(numericTerm) : true

          if (matchesName || matchesPhone) {
            const { key, nameLower, phoneNormalized, ...client } = record
            results.push(client as ClientInterface)
          }
          if (results.length >= limit) {
            tx.abort()
            resolve(results)
            return
          }
          cursor.continue()
        }
      }
      tx.oncomplete = () => resolve(results)
      tx.onabort = () => resolve(results)
      tx.onerror = () => resolve(results)
    })
  }
}

export default new ClientCache()
