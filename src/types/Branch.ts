import {City} from "@/types/City";

export type Branch = {
    calling_code: string
    country: string
    currency_code: string
    cities: City[]
}