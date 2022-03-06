import {ClientInterface} from '@/entities/ClientInterface'

export default class Client implements ClientInterface {
  id: string
  name: string
  email: string|null
  phone: string
  created_at: number
}