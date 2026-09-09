import { ServiceList } from '@/models/ServiceList'
import Service from '@/models/Service'

export default class ServiceHelper {
	static vehiclePlate(service: ServiceList): string {
		return service.vehicle?.plate ?? service.driver?.selected_vehicle?.plate ?? ''
	}

	static isSelfServiceStartLoc(name?: string | null): boolean {
		return name === Service.SELF_SERVICE_START_LOC_NAME
	}
}
