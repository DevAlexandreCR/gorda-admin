export interface DriverListQuery {
  search?: string
  status?: 'enabled' | 'disabled'
  paymentMode?: 'monthly' | 'percentage'
  paymentStatus?: 'paid' | 'pending'
  period?: string
  inactiveDays?: number
  sort?: string
  page?: number
  perPage?: number
}
