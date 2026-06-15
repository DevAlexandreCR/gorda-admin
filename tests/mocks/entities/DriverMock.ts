import dayjs from "dayjs";
import Vehicle from "@/models/Vehicle";
import {DriverInterface} from "@/types/DriverInterface";
import {DeviceType} from '@/types/DeviceType'
import { DriverPaymentMode } from "@/constants/DriverPaymentMode";

class DriverMock implements DriverInterface{
  id = 'DriverID'
  name = 'Admin 1'
  email = 'admin@admin.com'
	password = '123456'
  phone = '310374656'
  phone2 = null;
  photoUrl = 'https://fakeUrl.com'
  created_at =  dayjs().unix()
  last_connection = 0
  enabled_at = 0
  docType = 'CC'
  document = '1000000000'
  paymentMode = DriverPaymentMode.MONTHLY;
  vehicle: Vehicle =  {
    brand: 'Mazda',
    model: 'Cx30',
    plate: 'HEM390',
    color: {name: 'white', hex: '#ffffff'},
    soat_exp: 0,
    tec_exp: 0,
    photoUrl: 'https://fakeUrl.com'
  }
  selected_vehicle = null
  selected_vehicle_id = null
  roster = []
  active_vehicle_id = null

  balance = 0

	device: DeviceType = {
		id: '1234567890',
		name: 'Iphone XS'
	}

  isEnabled(): boolean {
    return !!this.enabled_at
  }
}

export default new DriverMock()