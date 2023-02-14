import {defineStore} from 'pinia'
import Service from '@/models/Service'
import ServiceRepository from '@/repositories/ServiceRepository'
import {DataSnapshot} from 'firebase/database'
import {Filter} from '@/types/Filter'
import DateHelper from '@/helpers/DateHelper'
import {useLoadingState} from '@/services/stores/LoadingState'

const setService = (snapshot?: DataSnapshot): Service => {
  const service = new Service()
  Object.assign(service, snapshot?.val())
  service.id = snapshot?.key as string
  return  service
}

export const useServicesStore = defineStore('servicesStore', {
  state: () => {
    return {
      pendings: Array<Service>(),
      inProgress: Array<Service>(),
      history: Array<Service>(),
      filter: <Filter>{
        from: DateHelper.stringNow(),
        to: DateHelper.stringNow()
      }
    }
  },
  actions: {
    async getPendingServices(): Promise<void> {
      const added = (snapshot: DataSnapshot): void => {
        const service = setService(snapshot)
        this.pendings.unshift(service)
      }

      const removed = (snapshot: DataSnapshot): void => {
        const service = setService(snapshot)
        const index = this.pendings.findIndex(serv => serv.id === service.id)
        this.pendings.splice(index, 1)
      }

      ServiceRepository.pendingListener(added, removed)
    },

    async getInProgressServices(): Promise<void> {
      const added = (snapshot: DataSnapshot): void => {
        const service = setService(snapshot)
        this.inProgress.unshift(service)
      }

      const removed = (snapshot: DataSnapshot): void => {
        const service = setService(snapshot)
        const index = this.inProgress.findIndex(serv => serv.id === service.id)
        this.inProgress.splice(index, 1)
      }

      ServiceRepository.inProgressListener(added, removed)
    },

    getHistoryServices(sync = false): void {
      const {setLoading} = useLoadingState()
      const from = DateHelper.getFromDate(this.filter.from , sync? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD')
      const to = DateHelper.getToDate(this.filter.to)
      setLoading(true)
      ServiceRepository.getHistory(from, to).then(snapshot => {
        if (!sync) this.history.splice(0)
        snapshot.forEach(dataSnapshot => {
          const service = setService(dataSnapshot)
          if (service.isEnd()) this.history.unshift(service)
        })
      }).finally(() => setLoading(false))
    },
  }
})