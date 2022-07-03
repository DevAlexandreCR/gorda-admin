import {defineStore} from 'pinia'
import PlaceRepository from '@/repositories/PlaceRepository'
import Place from '@/models/Place'

export const usePlacesStore = defineStore('placesStore', {
  state: () => {

    return {
      places: Array<Place>()
    }
  },
  actions: {
    async getPlaces() {
      const places: Array<Place> = []
      PlaceRepository.onAll(async (place) => {
        places.push(place)
      })
      this.places = places
    },
    findByName(name: string): Place {
      const place = this.places.find(el => el.name == name)
      return place ?? new Place()
    }
  }
})