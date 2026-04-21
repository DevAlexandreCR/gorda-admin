import { PlaceInterface } from '@/types/PlaceInterface'

const DB_NAME = process.env.VUE_APP_PLACE_CACHE_DB_NAME || 'places-cache'
const DB_VERSION = 3
const PLACE_STORE = 'places'
const META_STORE = 'meta'
const WRITE_BATCH_SIZE = 300

type CachedPlaceRecord = PlaceInterface & {
  key: string
  cityId: string
  nameLower: string
}

type CachedMetaRecord = {
  key: string
  value: boolean | number
}

type HydrationState = {
  isReady: boolean
  lastSyncedAt: number | null
}

class PlaceCache {
  private dbPromise: Promise<IDBDatabase | null> | null = null

  private buildKey(cityId: string, placeId: string): string {
    return `${cityId}-${placeId}`
  }

  private buildReadyMetaKey(cityId: string): string {
    return `places-ready-${cityId}`
  }

  private buildLastSyncedMetaKey(cityId: string): string {
    return `places-last-synced-at-${cityId}`
  }

  private normalize(place: PlaceInterface, cityId: string): CachedPlaceRecord {
    return {
      ...place,
      key: this.buildKey(cityId, place.id),
      cityId,
      nameLower: place.name.toLowerCase(),
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
        let placeStore: IDBObjectStore
        if (!db.objectStoreNames.contains(PLACE_STORE)) {
          placeStore = db.createObjectStore(PLACE_STORE, { keyPath: 'key' })
        } else {
          placeStore = request.transaction?.objectStore(PLACE_STORE) as IDBObjectStore
        }
        if (!placeStore.indexNames.contains('byCity')) {
          placeStore.createIndex('byCity', 'cityId', { unique: false })
        }
        if (!placeStore.indexNames.contains('byCityName')) {
          placeStore.createIndex('byCityName', ['cityId', 'nameLower'], { unique: false })
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

  private async clearCity(db: IDBDatabase, cityId: string): Promise<void> {
    await new Promise<void>((resolve) => {
      const tx = db.transaction(PLACE_STORE, 'readwrite')
      const index = tx.objectStore(PLACE_STORE).index('byCity')
      const range = IDBKeyRange.only(cityId)
      index.openCursor(range).onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        }
      }
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
  }

  private async yieldToUi(): Promise<void> {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 0)
    })
  }

  private async writeBatch(db: IDBDatabase, cityId: string, places: PlaceInterface[]): Promise<void> {
    await new Promise<void>((resolve) => {
      const tx = db.transaction(PLACE_STORE, 'readwrite')
      const store = tx.objectStore(PLACE_STORE)
      places.forEach((place) => {
        store.put(this.normalize(place, cityId))
      })
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

  async replacePlacesForCity(cityId: string, places: PlaceInterface[]): Promise<void> {
    const db = await this.getDb()
    if (!db) return

    await this.clearCity(db, cityId)

    for (let start = 0; start < places.length; start += WRITE_BATCH_SIZE) {
      const batch = places.slice(start, start + WRITE_BATCH_SIZE)
      await this.writeBatch(db, cityId, batch)
      await this.yieldToUi()
    }

    const syncedAt = Date.now()
    await this.setMetaValue(this.buildReadyMetaKey(cityId), true)
    await this.setMetaValue(this.buildLastSyncedMetaKey(cityId), syncedAt)
  }

  async getHydrationState(cityId: string): Promise<HydrationState> {
    const [isReady, lastSyncedAt] = await Promise.all([
      this.getMetaValue<boolean>(this.buildReadyMetaKey(cityId)),
      this.getMetaValue<number>(this.buildLastSyncedMetaKey(cityId)),
    ])

    return {
      isReady: isReady ?? false,
      lastSyncedAt,
    }
  }

  async getPlaces(cityId: string): Promise<PlaceInterface[]> {
    const db = await this.getDb()
    if (!db) return []

    return new Promise((resolve) => {
      const results: PlaceInterface[] = []
      const tx = db.transaction(PLACE_STORE, 'readonly')
      const index = tx.objectStore(PLACE_STORE).index('byCity')
      const range = IDBKeyRange.only(cityId)
      index.openCursor(range).onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result
        if (cursor?.value) {
          const { cityId: _, nameLower, ...place } = cursor.value as CachedPlaceRecord
          results.push(place as PlaceInterface)
          cursor.continue()
        }
      }
      tx.oncomplete = () => resolve(results)
      tx.onerror = () => resolve([])
    })
  }

  async searchPlaces(cityId: string, term: string, limit = 50): Promise<PlaceInterface[]> {
    const db = await this.getDb()
    if (!db) return []

    const termLower = term.toLowerCase()
    return new Promise((resolve) => {
      const results: PlaceInterface[] = []
      const tx = db.transaction(PLACE_STORE, 'readonly')
      const index = tx.objectStore(PLACE_STORE).index('byCity')
      const range = IDBKeyRange.only(cityId)
      index.openCursor(range).onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result
        if (cursor?.value) {
          const record = cursor.value as CachedPlaceRecord
          if (!termLower || record.nameLower.includes(termLower)) {
            const { cityId: _, nameLower, ...place } = record
            results.push(place as PlaceInterface)
            if (results.length >= limit) {
              tx.abort()
              resolve(results)
              return
            }
          }
          cursor.continue()
        }
      }
      tx.oncomplete = () => resolve(results)
      tx.onabort = () => resolve(results)
      tx.onerror = () => resolve([])
    })
  }

  async removePlace(cityId: string, placeId: string): Promise<void> {
    const db = await this.getDb()
    if (!db) return

    await new Promise<void>((resolve) => {
      const tx = db.transaction(PLACE_STORE, 'readwrite')
      tx.objectStore(PLACE_STORE).delete(this.buildKey(cityId, placeId))
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
  }
}

export default new PlaceCache()
