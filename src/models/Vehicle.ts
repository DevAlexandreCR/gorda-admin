import {VehicleInterface} from "@/types/VehicleInterface";

export default class Vehicle implements VehicleInterface {
  brand: string
  model: string
  photoUrl: string|null
  plate: string
  color: string
  soat_exp: number
  tec_exp: number
  
  constructor() {
    this.photoUrl = null
  }
}