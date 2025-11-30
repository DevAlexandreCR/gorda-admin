import { defineStore } from 'pinia'
import PlaceRepository from '@/repositories/PlaceRepository'
import Place from '@/models/Place'
import { useSettingsStore } from './SettingsStore'
import PlaceCache from '@/services/PlaceCache'
import { PlaceInterface } from '@/types/PlaceInterface'

export const usePlacesStore = defineStore('placesStore', {
  state: () => {

    return {
      places: Array<Place>(),
      currentCityId: null as string | null
    }
  },
  actions: {
    buildPlace(place: PlaceInterface): Place {
      const placeTmp = new Place()
      Object.assign(placeTmp, {
        key: place.id,
        name: place.name,
        lat: place.lat,
        lng: place.lng,
        id: place.id,
        color: place.color
      })
      return placeTmp
    },
    async findByName(name: string): Promise<Place | null> {
      const { branchSelected } = useSettingsStore()
      if (!branchSelected?.city) {
        return null
      }
      const cityId = branchSelected.city.id
      const matches = await PlaceCache.searchPlaces(cityId, name)
      const exact = matches.find(place => place.name.toLowerCase() === name.toLowerCase())
      if (exact) {
        return this.buildPlace(exact)
      }
      if (matches[0]) {
        return this.buildPlace(matches[0])
      }
      return null
    },
    async getPlaces() {
      const { branchSelected } = useSettingsStore()
      if (branchSelected === null) {
        this.places = []
        this.currentCityId = null
        return
      }
      const cityId = branchSelected.city.id
      this.currentCityId = cityId
      this.places = []

      await this.searchPlaces('')

      // Luego solicitar al API y refrescar cache
      const places = await PlaceRepository.getAll(cityId)
      if (this.currentCityId !== cityId) {
        return
      }
      await PlaceCache.replacePlacesForCity(cityId, places).catch(() => {
        // Evitar que errores de cache rompan el flujo principal
      })
      await this.searchPlaces('')
    },
    async searchPlaces(term: string): Promise<Array<Place>> {
      const { branchSelected } = useSettingsStore()
      if (!branchSelected?.city) {
        this.places = []
        return this.places
      }
      const cityId = branchSelected.city.id
      this.currentCityId = cityId
      const cachedPlaces = await PlaceCache.searchPlaces(cityId, term)
      this.places = cachedPlaces.map(place => this.buildPlace(place))
      return this.places
    },
    remove(place: Place): void {
      const placeIndex = this.places.findIndex(placeST => placeST.id == place.id)
      if (placeIndex >= 0) {
        this.places.splice(placeIndex, 1)
      }
      const { branchSelected } = useSettingsStore()
      if (branchSelected && branchSelected.city?.id === this.currentCityId) {
        PlaceCache.removePlace(branchSelected.city.id, place.id).catch(() => {
          // Silenciar errores de cache
        })
      }
    }
  }
})
