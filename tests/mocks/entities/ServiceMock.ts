import dayjs from "dayjs";
import Service from "@/models/Service";

class ServiceMock extends Service {
  id = 'id'
  status = Service.STATUS_PENDING
  start_loc = {name: 'Barrio Berlin', lat: 1.0000, long: -70.0000}
  end_loc = {name: 'Barrio Berlin', lat: 1.0000, long: -70.0000}
  phone = '3103103030'
  name = 'Fake user'
  comment = 'With pet'
  amount = 100
  driver_id = 'DriverID'
  client_id = 'ClientID'
  created_at = dayjs().unix()
}

export default new ServiceMock()