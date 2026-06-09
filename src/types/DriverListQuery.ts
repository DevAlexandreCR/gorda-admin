export interface DriverListQuery {
  search?: string
  status?: 'enabled' | 'disabled'
  paymentMode?: 'monthly' | 'percentage'
  inactiveDays?: number
  sort?: string
  page?: number
  perPage?: number
}
