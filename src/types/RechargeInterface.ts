export interface RechargeInterface {
  id: string
  driverId: string
  amount: number
  balanceBefore: number
  balanceAfter: number
  createdByUid: string
  createdByName: string
  note: string | null
  created_at: number
}
