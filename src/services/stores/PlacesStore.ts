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
    findByName(name: string): Place {
      const place = this.places.find(el => el.name == name)
      return place ?? new Place()
    },
    async getPlaces() {
      PlaceRepository.onAll(async (place) => {
        this.places.push(place)
      })
    },
    remove(place: Place): void {
      let placeIndex = this.places.findIndex(placeST => placeST.key == place.key)
      this.places.splice(placeIndex, 1)
    }
  }
})