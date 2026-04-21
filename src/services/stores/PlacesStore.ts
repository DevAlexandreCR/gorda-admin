import { defineStore } from 'pinia'
import PlaceRepository from '@/repositories/PlaceRepository'
import Place from '@/models/Place'
import { useSettingsStore } from './SettingsStore'
import PlaceCache from '@/services/PlaceCache'
import { PlaceInterface } from '@/types/PlaceInterface'

interface PlacesState {
  places: Array<Place>
  results: Array<Place>
  currentCityId: string | null
  currentSearch: string
  isHydrating: boolean
  isReady: boolean
  lastSyncedAt: number | null
}

const hydrationPromises = new Map<string, Promise<void>>()

export const usePlacesStore = defineStore('placesStore', {
  state: (): PlacesState => {
    return {
      places: Array<Place>(),
      results: Array<Place>(),
      currentCityId: null,
      currentSearch: '',
      isHydrating: false,
      isReady: false,
      lastSyncedAt: null,
    }
  },
  actions: {
    buildPlace(place: PlaceInterface): Place {
      const placeTmp = new Place()
      Object.assign(placeTmp, {
        key: place.key ?? place.id,
        name: place.name,
        lat: place.lat,
        lng: place.lng,
        id: place.id,
        color: place.color,
      })
      return placeTmp
    },
    resolveCityId(cityId?: string): string | null {
      if (cityId) {
        return cityId
      }

      const { branchSelected } = useSettingsStore()
      return branchSelected?.city?.id ?? null
    },
    resetScope(cityId: string | null): void {
      this.currentCityId = cityId
      this.currentSearch = ''
      this.results = []
      this.places = []
      this.isReady = false
      this.lastSyncedAt = null
    },
    async syncHydrationState(cityId: string): Promise<void> {
      const { isReady, lastSyncedAt } = await PlaceCache.getHydrationState(cityId)
      if (this.currentCityId !== cityId) {
        return
      }
      this.isReady = isReady
      this.lastSyncedAt = lastSyncedAt
    },
    async findByName(name: string): Promise<Place | null> {
      const cityId = this.resolveCityId()
      if (!cityId) {
        return null
      }

      if (!this.isReady && this.places.length > 0) {
        const exactFallback = this.places.find((place) => place.name.toLowerCase() === name.toLowerCase())
        if (exactFallback) {
          return exactFallback
        }
        const partialFallback = this.places.find((place) => place.name.toLowerCase().includes(name.toLowerCase()))
        return partialFallback ?? null
      }

      const matches = await PlaceCache.searchPlaces(cityId, name)
      const exact = matches.find((place) => place.name.toLowerCase() === name.toLowerCase())
      if (exact) {
        return this.buildPlace(exact)
      }
      if (matches[0]) {
        return this.buildPlace(matches[0])
      }
      return null
    },
    async hydratePlacesInBackground(cityId?: string): Promise<void> {
      const resolvedCityId = this.resolveCityId(cityId)
      if (!resolvedCityId) {
        this.resetScope(null)
        return
      }

      if (this.currentCityId !== resolvedCityId) {
        this.resetScope(resolvedCityId)
      }

      await this.syncHydrationState(resolvedCityId)

      const existingPromise = hydrationPromises.get(resolvedCityId)
      if (existingPromise) {
        return existingPromise
      }

      this.isHydrating = true
      const hydrationPromise = (async () => {
        try {
          const places = await PlaceRepository.getAll(resolvedCityId)
          await PlaceCache.replacePlacesForCity(resolvedCityId, places)
          await this.syncHydrationState(resolvedCityId)
          if (this.currentCityId === resolvedCityId) {
            await this.searchPlaces(this.currentSearch, Math.max(this.results.length, 100), resolvedCityId)
          }
        } finally {
          if (this.currentCityId === resolvedCityId) {
            this.isHydrating = false
          }
          hydrationPromises.delete(resolvedCityId)
        }
      })()

      hydrationPromises.set(resolvedCityId, hydrationPromise)
      return hydrationPromise
    },
    async getPlaces(): Promise<void> {
      await this.hydratePlacesInBackground()
    },
    async searchPlaces(term: string, limit = 100, cityId?: string): Promise<Array<Place>> {
      const resolvedCityId = this.resolveCityId(cityId)
      if (!resolvedCityId) {
        this.resetScope(null)
        return this.results
      }

      if (this.currentCityId !== resolvedCityId) {
        this.resetScope(resolvedCityId)
      }

      this.currentSearch = term
      await this.syncHydrationState(resolvedCityId)
      if (!this.isReady && this.places.length > 0) {
        const normalizedTerm = term.toLowerCase()
        const fallbackResults = this.places.filter((place) => {
          return !normalizedTerm || place.name.toLowerCase().includes(normalizedTerm)
        }).slice(0, limit)
        this.results = [...fallbackResults]
        return this.results
      }
      const cachedPlaces = await PlaceCache.searchPlaces(resolvedCityId, term, limit)
      const results = cachedPlaces.map((place) => this.buildPlace(place))

      if (this.currentCityId === resolvedCityId) {
        this.results = results
        this.places = results
      }

      return results
    },
    remove(place: Place): void {
      const targetId = place.id || place.key
      const placeIndex = this.results.findIndex((placeST) => (placeST.id || placeST.key) === targetId)
      if (placeIndex >= 0) {
        this.results.splice(placeIndex, 1)
        this.results = [...this.results]
        this.places = this.results
      }
      const currentCityId = this.currentCityId
      const placeId = place.id || place.key
      if (currentCityId && placeId) {
        PlaceCache.removePlace(currentCityId, placeId).catch(() => {
          // Ignore cache errors
        })
      }
    },
  },
})
