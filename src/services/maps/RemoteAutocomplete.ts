import {Loader} from '@googlemaps/js-api-loader'
import GoogleLoader from '@/services/maps/GoogleLoader'
import {PlaceInterface} from '@/types/PlaceInterface'

export class RemoteAutocomplete {
  public autocomplete: google.maps.places.Autocomplete
  private readonly options: google.maps.places.AutocompleteOptions
  private loader: Loader
  constructor() {
    this.loader = GoogleLoader.getInstance()
    const center = { lat: 2.4448143, lng: -76.6147395 }
    const defaultBounds = {
      north: center.lat + 0.1,
      south: center.lat - 0.1,
      east: center.lng + 0.1,
      west: center.lng - 0.1,
    }
    this.options = {
      bounds: defaultBounds,
      componentRestrictions: { country: "co" },
      fields: ['geometry', 'address_component', 'name'],
      strictBounds: true,
    }
  }

  public async initPlaces(id: string): Promise<void> {
    const input = document.getElementById(id) as HTMLInputElement
    await this.loader.importLibrary('places').then((places) => {
      this.autocomplete = new places.Autocomplete(input, this.options)
    })
  }

  public onPlaceChanged(fn: (place: PlaceInterface) => void): void {
    this.autocomplete.addListener('place_changed', () => {
      const gPlace = this.autocomplete.getPlace()
      if (gPlace.geometry != undefined) {
        const place: PlaceInterface = {
          key: null,
          name: gPlace.name?? '',
          lat: gPlace.geometry.location?.lat()?? 0,
          lng: gPlace.geometry.location?.lng()?? 0
        }
        console.log(gPlace)
        fn(place)
      }
    })
  }
}