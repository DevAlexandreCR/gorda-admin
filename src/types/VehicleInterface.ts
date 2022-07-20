export interface VehicleInterface {
  brand: string
  model: string
  photoUrl: string|null
  plate: string
  color: {
    name: string,
    hex: string
  }
  soat_exp: number
  tec_exp: number
}