export interface VehicleColor {
  name: string
  hex?: string
}

export interface Vehicle {
  id: string
  plate: string
  brand: string | null
  model: string | null
  color: VehicleColor | null
  photoUrl: string | null
  soat_exp: string | null
  tec_exp: string | null
  enabled: boolean
  created_at?: string | null
  linked_drivers?: LinkedDriverEntry[]
  currently_driven_by?: { id: string; name: string } | null
}

export interface LinkedDriverEntry {
  driver_id: string
  driver_name: string
  selectable: boolean
}

export interface DriverVehicleLink {
  id: string
  driver_id: string
  vehicle_id: string
  selectable: boolean
  added_at: string
  updated_at: string
  vehicle: Vehicle
  is_selected: boolean
  is_active: boolean
}
