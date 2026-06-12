export interface DriverListQuery {
  search?: string
  status?: 'enabled' | 'disabled'
  paymentMode?: 'monthly' | 'percentage'
  inactiveDays?: number
  needsVehicle?: boolean
  sort?: string
  page?: number
  perPage?: number
}
