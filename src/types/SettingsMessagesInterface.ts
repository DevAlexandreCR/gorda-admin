import {MessagesEnum} from '@/constants/MessagesEnum'
import { Interactive } from './Interactive'

export interface SettingsMessageInterface {
    id: MessagesEnum
    name: string
    description: string
    message: string
    enabled: boolean
    interactive?: Interactive
}
