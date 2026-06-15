import users from './users'
import common from './common'
import validations from '@/assets/locales/en/validations'
import services from '@/assets/locales/en/services'
import drivers from "@/assets/locales/en/drivers";
import wp from "@/assets/locales/en/wp";
import settings from "@/assets/locales/en/settings";

export default {
  routes: {
    dashboard: 'Dashboard',
    users: 'Users',
    drivers: 'Drivers',
    places: 'Places',
    metrics: 'Metrics',
    settings: 'Settings'
  },
  users: users,
  common: common,
  validations: validations,
  services: services,
  drivers: drivers,
  wp: wp,
  settings: settings
}