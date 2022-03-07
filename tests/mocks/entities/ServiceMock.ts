import dayjs from "dayjs";
import Service from "@/models/Service";

class ServiceMock {
  id = 'id'
  status = Service.STATUS_PENDING
  start_address = 'Barrio Berlin'
  end_address = null
  phone = '3103103030'
  name = 'Fake user'
  comment = 'With pet'
  amount = 100
  driver_id = 'DriverID'
  client_id = 'ClientID'
  created_at = dayjs().unix()
}

export default new ServiceMock()