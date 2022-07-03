import {defineStore} from 'pinia'
import Client from '@/models/Client'
import ClientRepository from '@/repositories/ClientRepository'

export const useClientsStore = defineStore('clientsStore', {
  state: () => {
    return {
      clients: Array<Client>()
    }
  },
  actions: {
    async getClients() {
      ClientRepository.onAll(async (client) => {
        this.clients.push(client)
      })
    },
    findById(id: string): Client {
      const client = this.clients.find(el => el.id == id)
      return client ?? new Client()
    }
  }
})