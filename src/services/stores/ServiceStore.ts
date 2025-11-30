import {defineStore} from 'pinia'
import ServiceRepository from '@/repositories/ServiceRepository'
import {DataSnapshot} from 'firebase/database'
import {Filter} from '@/types/Filter'
import DateHelper from '@/helpers/DateHelper'
import {useLoadingState} from '@/services/stores/LoadingState'
import {ServiceList} from '@/models/ServiceList'
import {useDriversStore} from '@/services/stores/DriversStore'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import {Pagination} from '@/types/Pagination'
import Service from '@/models/Service'
import {ServiceCursor} from '@/types/ServiceCursor'
import { log } from 'console'


export const useServicesStore = defineStore('servicesStore', {
  state: () => {
    return {
      pendings: Array<ServiceList>(),
      inProgress: Array<ServiceList>(),
      history: Array<ServiceList>(),
      currentCursor: <ServiceCursor>{
        id: '',
        created: DateHelper.endOfDayUnix()
      },
      pagination: <Pagination>{
        currentPage: 1,
        perPage: 20,
        totalCount: 0,
        cursor: {
          id: '',
          created: DateHelper.endOfDayUnix()
        }
      },
      canceled: 0,
      completed: 0,
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

      const changed = (snapshot: DataSnapshot): void => {
        const service = this.setServiceFromDB(snapshot)
        const index = this.pendings.findIndex(serv => serv.id === service.id)
        if (index !== -1) {
          this.pendings.splice(index, 1, service)
        } else {
          this.pendings.unshift(service)
        }
      }

      ServiceRepository.pendingListener(added, removed, changed)
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

    async getHistoryServices(next = true, contain = false): Promise<void> {
      const { setLoading } = useLoadingState();
      const from = DateHelper.getFromDate(this.filter.from)
      const to = DateHelper.getToDate(this.filter.to);
      setLoading(true);

      if (this.pagination.currentPage === 1 && contain) {
        this.resetCursor()
      }

      const options = {
        from: from,
        to: to,
        driverId: this.filter.driverId,
        clientId: this.filter.clientId,
        perPage: this.pagination.perPage,
        cursor: this.pagination.cursor,
        next: next
      }

      this.pagination.totalCount = await ServiceRepository.getCount(options.from, options.to, options.clientId, options.driverId)
      this.completed = await ServiceRepository.getCount(options.from, options.to, options.clientId, options.driverId, Service.STATUS_TERMINATED)
      this.canceled = await ServiceRepository.getCount(options.from, options.to, options.clientId, options.driverId, Service.STATUS_CANCELED)

      await ServiceRepository.getPaginated(options, contain)
        .then((dbServices) => {
          this.history.splice(0)
          dbServices.forEach((dbService) => {
            const service = this.setServiceFromFS(dbService);
            this.history.push(service)
          })
          this.currentCursor.id = this.history[0]?.id
          this.currentCursor.created = this.history[0]?.created_at
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
	
		setServiceFromFS(dbService: Service): ServiceList {
			const {findById} = useDriversStore()
      const service = Object.assign(new ServiceList(), dbService)
			if (service.driver_id != null) {
				const driver = findById(service.driver_id)
				service.driver = driver?? null
			}
			return  service
		},

		setServiceFromDB(snapshot?: DataSnapshot): ServiceList {
			const {findById} = useDriversStore()
			const service = Object.assign(new ServiceList(), snapshot?.val())
			if (service.driver_id != null) {
				const driver = findById(service.driver_id)
				service.driver = driver?? null
			}
			service.id = snapshot?.key as string
			return  service
		},

    resetCursor(): void {
      const defaultCursor = <ServiceCursor> {
        id: '',
        created: DateHelper.endOfDayUnix()
      }
      this.pagination.cursor = defaultCursor
      this.currentCursor = defaultCursor
    }
  }
})
