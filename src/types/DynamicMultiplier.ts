export type DynamicMultiplier = {
    name: string
    multiplier: number
    timeRanges: {
        start: string // HH:mm format
        end: string // HH:mm format
    }
}