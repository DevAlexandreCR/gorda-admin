export interface DriverInterface {
  id: string
  name: string
  email: string
  phone: string
  docType: string
  document: string
  photoUrl: string|null
  vehicle: {
    brand: string
    model: string
    photoUrl: string
  }
  enabled_at: string|null
  created_at: string
}