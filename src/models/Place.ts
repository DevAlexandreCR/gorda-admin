import {PlaceInterface} from "@/types/PlaceInterface";
import PlaceRepository from '@/repositories/PlaceRepository'

export default class Place implements PlaceInterface {
  key: string|null = null
  name: string
  lat: number
  lng: number

  async delete(): Promise<void> {
    return PlaceRepository.remove(this)
  }
}