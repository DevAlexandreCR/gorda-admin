export interface MonthlyPaymentInterface {
  id: string
  driverId: string
  period: string
  amount: number
  createdByUid: string
  createdByName: string
  note: string | null
  created_at: number
}
