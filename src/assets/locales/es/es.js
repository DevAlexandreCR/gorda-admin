import users from './users'
import common from './common'
import validations from '@/assets/locales/es/validations'
import services from '@/assets/locales/es/services'
import drivers from "@/assets/locales/es/drivers";
import wp from "@/assets/locales/es/wp";
import settings from "@/assets/locales/es/settings";

export default {
  routes: {
    dashboard: 'Dashboard',
    users: 'Usuarios',
    drivers: 'Conductores',
    places: 'Lugares',
    metrics: 'Métricas',
    settings: 'Ajustes'
  },
  users: users,
  common: common,
  validations: validations,
  services: services,
  drivers: drivers,
  wp: wp,
  settings: settings
}