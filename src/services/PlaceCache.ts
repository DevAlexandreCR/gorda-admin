import { PlaceInterface } from '@/types/PlaceInterface'

const DB_NAME = process.env.VUE_APP_PLACE_CACHE_DB_NAME || 'places-cache'
const DB_VERSION = 2
const PLACE_STORE = 'places'

type CachedPlaceRecord = PlaceInterface & {
  key: string
  cityId: string
  nameLower: string
}

class PlaceCache {
  private dbPromise: Promise<IDBDatabase | null> | null = null

  private buildKey(cityId: string, placeId: string): string {
    return `${cityId}-${placeId}`
  }

  private normalize(place: PlaceInterface, cityId: string): CachedPlaceRecord {
    return {
      ...place,
      key: this.buildKey(cityId, place.id),
      cityId,
      nameLower: place.name.toLowerCase()
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
        let store: IDBObjectStore
        if (!db.objectStoreNames.contains(PLACE_STORE)) {
          store = db.createObjectStore(PLACE_STORE, { keyPath: 'key' })
        } else {
          store = request.transaction?.objectStore(PLACE_STORE) as IDBObjectStore
        }
        if (!store.indexNames.contains('byCity')) {
          store.createIndex('byCity', 'cityId', { unique: false })
        }
        if (!store.indexNames.contains('byCityName')) {
          store.createIndex('byCityName', ['cityId', 'nameLower'], { unique: false })
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

  async replacePlacesForCity(cityId: string, places: PlaceInterface[]): Promise<void> {
    const db = await this.getDb()
    if (!db) return

    await this.clearCity(db, cityId)

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
          const { key, cityId: _, nameLower, ...place } = cursor.value as CachedPlaceRecord
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
            const { key, cityId: _, nameLower, ...place } = record
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
