import { DynamicMultiplier } from "./DynamicMultiplier"

export interface RideFeeInterface {
    price_kilometer: number
    price_minute: number
    fees_base: number
    fees_additional: number
    fees_minimum: number
    fees_night: number
    fees_DxF: number
    fees_night_DxF: number
    fees_min_day: number
    fees_min_nigth: number
    fees_min_festive_day: number
    fees_min_festive_nigth: number
    fee_multiplier: number
    dynamic_multipliers: DynamicMultiplier[]
  }