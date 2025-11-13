import { defineStore } from 'pinia'
import PlaceRepository from '@/repositories/PlaceRepository'
import Place from '@/models/Place'
import { useSettingsStore } from './SettingsStore'

export const usePlacesStore = defineStore('placesStore', {
  state: () => {

    return {
      places: Array<Place>()
    }
  },
  actions: {
    findByName(name: string): Place {
      const place = this.places.find(el => el.name == name)
      return place ?? new Place()
    },
    async getPlaces() {
      const { branchSelected } = useSettingsStore()
      if (branchSelected === null) {
        this.places = []
        return
      }
      this.places = []
      const places = await PlaceRepository.getAll(branchSelected.city.id)
      this.places.push(...places.map(place => {
        const placeTmp = new Place()
        Object.assign(placeTmp, {
          key: place.id,
          name: place.name,
          lat: place.lat,
          lng: place.lng,
          id: place.id,
        })
        return placeTmp
      }))
    },
    remove(place: Place): void {
      const placeIndex = this.places.findIndex(placeST => placeST.id == place.id)
      this.places.splice(placeIndex, 1)
    }
  }
})