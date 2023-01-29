import {defineStore} from 'pinia'
import Service from '@/models/Service'
import ServiceRepository from '@/repositories/ServiceRepository'
import {DataSnapshot} from 'firebase/database'

export const useServicesStore = defineStore('servicesStore', {
  state: () => {
    return {
      pendings: Array<Service>(),
      inProgress: Array<Service>(),
    }
  },
  actions: {
    async getPendingServices() {
      const added = (snapshot: DataSnapshot): void => {
        const service = new Service()
        Object.assign(service, snapshot.val())
        service.id = snapshot.key as string
        this.pendings.unshift(service)
      }

      const removed = (snapshot: DataSnapshot): void => {
        const service = new Service()
        Object.assign(service, snapshot.val())
        service.id = snapshot.key as string
        const index = this.pendings.findIndex(serv => serv.id === service.id)
        this.pendings.splice(index, 1)
      }

      ServiceRepository.pendingListener(added, removed)
    },

    async getInProgressServices() {
      const added = (snapshot: DataSnapshot): void => {
        const service = new Service()
        Object.assign(service, snapshot.val())
        service.id = snapshot.key as string
        this.inProgress.unshift(service)
      }

      const removed = (snapshot: DataSnapshot): void => {
        const service = new Service()
        Object.assign(service, snapshot.val())
        service.id = snapshot.key as string
        const index = this.inProgress.findIndex(serv => serv.id === service.id)
        this.inProgress.splice(index, 1)
      }

      ServiceRepository.inProgressListener(added, removed)
    }
  }
})