export interface ActiveFilters {
  status?: 'enabled' | 'disabled'
  paymentMode?: 'monthly' | 'percentage'
  inactiveDays?: number
  needsVehicle?: boolean
}
