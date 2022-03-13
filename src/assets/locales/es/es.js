import users from './users'
import common from './common'
import validations from '@/assets/locales/es/validations'
import services from '@/assets/locales/es/services'

export default {
  routes: {
    dashboard: 'Dashboard',
    users: 'Usuarios',
    drivers: 'Conductores'
  },
  users: users,
  common: common,
  validations: validations,
  services: services
}