import dayjs from "dayjs";
import Vehicle from "@/models/Vehicle";
import {DriverInterface} from "@/types/DriverInterface";

class DriverMock implements DriverInterface{
  id = 'DriverID'
  name = 'Admin 1'
  email = 'admin@admin.com'
  phone = '310374656'
  photoUrl = 'https://fakeUrl.com'
  created_at =  dayjs().unix()
  enabled_at = 0
  docType = 'CC'
  document = '1000000000'
  vehicle: Vehicle =  {
    brand: 'Mazda',
    model: 'Cx30',
    plate: 'HEM390',
    color: '#ffffff',
    soat_exp: 0,
    tec_exp: 0,
    photoUrl: 'https://fakeUrl.com'
  }
}

export default new DriverMock()