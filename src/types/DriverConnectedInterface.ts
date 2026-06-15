export interface DriverConnectedInterface {
  id: string
  vehicle_id?: string
  vehicle_plate?: string
  location: {
    lat: number,
    lng: number
  }
  last_seen_at?: number
  session_id?: string
}
