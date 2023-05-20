import { defineStore } from 'pinia';
import ServiceRepository from '@/repositories/ServiceRepository';
import { DataSnapshot } from 'firebase/database';
import { Filter } from '@/types/Filter';
import DateHelper from '@/helpers/DateHelper';
import { useLoadingState } from '@/services/stores/LoadingState';
import { ServiceList } from '@/models/ServiceList';
import { useDriversStore } from '@/services/stores/DriversStore';
import { query, where, getDocs } from 'firebase/firestore';
import FSService from '@/services/FSService';

export const useServicesStore = defineStore('servicesStore', {
  state: () => {
    return {
      pendings: Array<ServiceList>(),
      inProgress: Array<ServiceList>(),
      history: Array<ServiceList>(),
      filter: <Filter>{
        from: DateHelper.stringNow(),
        to: DateHelper.stringNow()
      }
    }
  },
  actions: {
    async getPendingServices(): Promise<void> {
      const added = (snapshot: DataSnapshot): void => {
        const service = this.setService(snapshot)
        this.pendings.unshift(service)
      }

      const removed = (snapshot: DataSnapshot): void => {
        const service = this.setService(snapshot)
        const index = this.pendings.findIndex(serv => serv.id === service.id)
        this.pendings.splice(index, 1)
      }

      ServiceRepository.pendingListener(added, removed)
    },

    async getInProgressServices(): Promise<void> {
      const added = (snapshot: DataSnapshot): void => {
        const service = this.setService(snapshot)
        this.inProgress.unshift(service)
      }

      const removed = (snapshot: DataSnapshot): void => {
        const service = this.setService(snapshot)
        const index = this.inProgress.findIndex(serv => serv.id === service.id)
        this.inProgress.splice(index, 1)
      }

      ServiceRepository.inProgressListener(added, removed)
    },

    async getHistoryServices(sync = false): Promise<void> {
      const {setLoading} = useLoadingState()
      const from = DateHelper.getFromDate(this.filter.from , sync? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD')
      const to = DateHelper.getToDate(this.filter.to)
      setLoading(true)
      if (!sync) this.history.splice(0)
       else {
        const filtered = this.history.filter(filter => filter.created_at > from)
        filtered.forEach(filter => {
          const index = this.history.indexOf(filter)
          if (index > 0) this.history.splice(index, 1)
        })
      }
      const servicesQuery = query(FSService.servicesCollection(),where('created_at', '>=', from),where('created_at', '<=', to));
      const querySnapshot = await getDocs(servicesQuery);

      querySnapshot.forEach(documentData => {
        const service = this.setService(documentData)
        if (service.isEnd()) this.history.unshift(service);
      })
      setLoading(false);
    },

		setService(snapshot?: DataSnapshot): ServiceList {
			const {findById} = useDriversStore()
			const service = new ServiceList()
			Object.assign(service, snapshot?.val())
			if (service.driver_id != null) {
				const driver = findById(service.driver_id)
				service.driver = driver?? null
			}
			service.id = snapshot?.key as string
			return  service
		}
  }
})