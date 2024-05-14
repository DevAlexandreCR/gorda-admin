import {MessagesEnum} from '@/constants/MessagesEnum'

export interface SettingsMessageInterface {
    id: MessagesEnum
    name: string
    description: string
    message: string
    enabled: boolean
}
