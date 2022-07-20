window.google = {
  maps: {
    places: {
      Autocomplete: class {}
    },
    LatLng: class {
      latitude
      longitude
      constructor(lat, lng) {
        this.latitude = lat
        this.longitude = lng
      }
      lat = () => { return this.latitude}
      lng = () => { return this.longitude}
    }
  }
}