import {ClientInterface} from '@/entities/ClientInterface'

export default class Client {
  id: string
  name: string
  email: string|null
  phone: string
  created_at?: string

  constructor(client: ClientInterface) {
    this.id = client.id
    this.name = client.name
    this.email = client.email?? ''
    this.phone = client.phone
    this.created_at = client.created_at
  }
}