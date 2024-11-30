import {City} from "@/types/City";

export type BranchSelected = {
    id: string
    calling_code: string
    country: string
    currency_code: string
    city: City
}