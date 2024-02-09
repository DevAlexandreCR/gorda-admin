import {Loader} from '@googlemaps/js-api-loader'

export default class GoogleLoader {

  private static loader: Loader

  public static getInstance(): Loader {
    if (!GoogleLoader.loader) {
      return new Loader({
        apiKey: process.env.VUE_APP_GOOGLE_API_KEY?? '',
        version: "weekly",
        language: 'es',
        region: 'CO'
      })
    }

    return GoogleLoader.loader
  }
}