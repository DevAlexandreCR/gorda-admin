import { PlaceInterface } from '@/types/PlaceInterface'
import { AxiosResponse } from 'axios'
import serverApi, { ApiResponse } from './ServerApi'

export default {
  async index(cityId: string): Promise<AxiosResponse<ApiResponse<{ places: PlaceInterface[] }>>> {
    return serverApi.get<ApiResponse<{ places: PlaceInterface[] }>>('/places', {
      params: {
        cityId: cityId,
      }
    })
  },

  async store(place: PlaceInterface, cityId: string): Promise<AxiosResponse<ApiResponse<{ place: PlaceInterface }>>> {
    return serverApi.post<ApiResponse<{ place: PlaceInterface }>>('/places', {
      name: place.name,
      cityId: cityId,
      lat: place.lat,
      lng: place.lng,
    })
  },

  async delete(placeId: string): Promise<AxiosResponse<ApiResponse>> {
    return serverApi.delete<ApiResponse>(`/places/${placeId}`)
  },
} 
