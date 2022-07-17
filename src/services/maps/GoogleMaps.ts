import {Loader} from '@googlemaps/js-api-loader'
import {PlaceInterface} from '@/types/PlaceInterface'

export class GoogleMaps {
  
  loader: Loader
  map: google.maps.Map
  
  constructor() {
    this.loader = new Loader({
      apiKey: process.env.VUE_APP_GOOGLE_API_KEY?? '',
      version: "weekly"
    })
  }
  
  /* istanbul ignore next */
  async initMap(id: string): Promise<google.maps.Map> {
    await this.loader.load().then((google)=> {
      this.map = new google.maps.Map(document.getElementById(id) as HTMLElement, {
        center: { lat: 2.4448143, lng: -76.6147395 },
        zoom: 15
      })
    }).catch(error => console.error(error))
    
    return Promise.resolve(this.map)
  }
  /* istanbul ignore next */
  addMarker(place: PlaceInterface): void {
    new google.maps.Marker({
      position: {
        lat: place.lat,
        lng: place.lng
      },
      map: this.map,
      title: place.name
    });
  }
}