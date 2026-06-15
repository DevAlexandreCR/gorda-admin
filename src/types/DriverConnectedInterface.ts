export interface DriverConnectedInterface {
  id: string
  location: {
    lat: number,
    lng: number
  }
  last_seen_at?: number
  session_id?: string
}
