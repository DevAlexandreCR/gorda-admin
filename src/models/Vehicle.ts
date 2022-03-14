import {VehicleInterface} from "@/entities/VehicleInterface";

export default class Vehicle implements VehicleInterface {
  brand: string
  model: string
  photoUrl: string|null
  
  constructor() {
    this.photoUrl = null
  }
}