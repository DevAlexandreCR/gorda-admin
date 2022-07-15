import {VehicleInterface} from "@/types/VehicleInterface";
import {Constants} from '@/constants/Constants'

export default class Vehicle implements VehicleInterface {
  brand: string
  model: string
  photoUrl: string|null
  plate: string
  soat_exp: number
  tec_exp: number
  color: { name: string; hex: string }
  
  constructor() {
    this.photoUrl = null
    this.color = Constants.COLORS[0]
  }
}