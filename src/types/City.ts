export type City = {
    id: string
    name: string
    rate_management: boolean
    location: {
        lat: number
        lng: number
    }
}