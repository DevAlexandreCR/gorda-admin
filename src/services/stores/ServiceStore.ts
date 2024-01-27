import {defineStore} from 'pinia';
import ServiceRepository from '@/repositories/ServiceRepository';
import {DataSnapshot} from 'firebase/database';
import {Filter} from '@/types/Filter';
import DateHelper from '@/helpers/DateHelper';
import {useLoadingState} from '@/services/stores/LoadingState';
import {ServiceList} from '@/models/ServiceList';
import {useDriversStore} from '@/services/stores/DriversStore';
import {DocumentData} from 'firebase/firestore';
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import {Pagination} from '@/types/Pagination'


export const useServicesStore = defineStore('servicesStore', {
  state: () => {
    return {
      pendings: Array<ServiceList>(),
      inProgress: Array<ServiceList>(),
      history: Array<ServiceList>(),
      pagination: <Pagination>{
        currentPage: 1,
        perPage: 2,
        totalCount: 0,
        limit: 20
      },
      filter: <Filter>{
        from: DateHelper.stringNow(),
        to: DateHelper.stringNow(),
				clientId: null,
				driverId: null
      }
    }
  },
  actions: {
    async getPendingServices(): Promise<void> {
      const added = (snapshot: DataSnapshot): void => {
        const service = this.setServiceFromDB(snapshot)
        this.pendings.unshift(service)
      }

      const removed = (snapshot: DataSnapshot): void => {
        const service = this.setServiceFromDB(snapshot)
        const index = this.pendings.findIndex(serv => serv.id === service.id)
        this.pendings.splice(index, 1)
      }

      ServiceRepository.pendingListener(added, removed)
    },

    async getInProgressServices(): Promise<void> {
			const {setOccupiedDriver} = useDriversStore()
			const {removeOccupiedDriver} = useDriversStore()
      const added = (snapshot: DataSnapshot): void => {
        const service = this.setServiceFromDB(snapshot)
        this.inProgress.unshift(service)
				if (service.driver_id !== null) {
					setOccupiedDriver(service.driver_id)
				}
      }

      const removed = (snapshot: DataSnapshot): void => {
        const service = this.setServiceFromDB(snapshot)
        const index = this.inProgress.findIndex(serv => serv.id === service.id)
        this.inProgress.splice(index, 1)
				if (service.driver_id) removeOccupiedDriver(service.driver_id)
      }

      ServiceRepository.inProgressListener(added, removed)
    },

    async getHistoryServices(): Promise<void> {
      const { setLoading } = useLoadingState();
      const from = DateHelper.getFromDate(this.filter.from, 'YYYY-MM-DD')
      const to = DateHelper.getToDate(this.filter.to);
      setLoading(true);
    
      const options = {
        from: from,
        to: to,
        driverId: this.filter.driverId,
        clientId: this.filter.clientId,
        perPage: this.pagination.limit,
        startAfterCursor: this.pagination.currentPage
      }

      this.pagination.totalCount = await ServiceRepository.getCount(options.from, options.to, options.clientId, options.driverId)
      console.log(this.pagination.totalCount)

          setLoading(false);
      ServiceRepository.getAll(options)
        .then((snapshot) => {
          snapshot.forEach((documentData) => {
            const service = this.setServiceFromFS(documentData);
            this.history.unshift(service);
          });
        })
        .catch(async (e) => {
          await ToastService.toast(
            ToastService.ERROR,
            i18n.global.t('common.messages.error'),
            e.message
          );
        })
        .finally(() => {
          setLoading(false);
        });
    },
		
		filterInProgressServices(search: string): Array<ServiceList> {
			return this.inProgress.filter(service => {
				if (service.driver)
					return service.driver.vehicle.plate.toLowerCase().includes(search.toLowerCase()) ||
						service.phone.toLowerCase().includes(search.toLowerCase())
			})
		},
	
		setServiceFromFS(snapshot: DocumentData): ServiceList {
			const {findById} = useDriversStore()
			const service = new ServiceList()
			Object.assign(service, snapshot.data())
			if (service.driver_id != null) {
				const driver = findById(service.driver_id)
				service.driver = driver?? null
			}
			service.id = snapshot?.key as string
			return  service
		},

		setServiceFromDB(snapshot?: DataSnapshot): ServiceList {
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