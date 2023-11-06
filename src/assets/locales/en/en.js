import users from './users'
import common from './common'
import validations from '@/assets/locales/en/validations'
import services from '@/assets/locales/en/services'
import drivers from "@/assets/locales/en/drivers";

export default {
  routes: {
    dashboard: 'Dashboard',
    users: 'Users',
    drivers: 'Drivers',
    places: 'Places',
    metrics: 'Metrics',
    clients: 'Settings'
  },
  users: users,
  common: common,
  validations: validations,
  services: services,
  drivers: drivers
}