export interface ActiveFilters {
  status?: 'enabled' | 'disabled'
  paymentMode?: 'monthly' | 'percentage'
  paymentStatus?: 'paid' | 'pending'
  period?: string
  inactiveDays?: number
}
