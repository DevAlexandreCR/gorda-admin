import { ServiceList } from '@/models/ServiceList'

export default class ServiceHelper {
	static vehiclePlate(service: ServiceList): string {
		return service.vehicle?.plate ?? service.driver?.selected_vehicle?.plate ?? ''
	}
}
