export interface MonthlyPaymentSettingsInterface {
  suggested_amount: number
  auto_disable: boolean
  cutoff_day: number
  reminder_offsets: number[]
}
