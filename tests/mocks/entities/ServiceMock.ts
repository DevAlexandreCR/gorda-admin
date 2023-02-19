import dayjs from "dayjs";
import Service from "@/models/Service";
import {ServiceList} from '@/models/ServiceList'
import DriverMock from './DriverMock'
import Driver from '@/models/Driver'

class ServiceMock extends ServiceList {
  id = 'id'
  status = Service.STATUS_PENDING
  start_loc = {name: 'Barrio Berlin', lat: 1.0000, lng: -70.0000}
  end_loc = {name: 'Barrio Berlin', lat: 1.0000, lng: -70.0000}
  phone = '3103103030'
  name = 'Fake user'
  comment = 'With pet'
  amount = 100
  driver_id = 'DriverID'
  client_id = 'ClientID'
	driver = <Driver> DriverMock
  created_at = dayjs().unix()
}

export default new ServiceMock()