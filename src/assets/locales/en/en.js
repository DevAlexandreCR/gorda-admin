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
    vehicles: 'Vehicles',
    places: 'Places',
    metrics: 'Metrics',
    settings: 'Settings'
  },
  vehicles: {
    fields: {
      plate: 'Plate',
      brand: 'Brand',
      model: 'Model',
      color: 'Color',
      photo_url: 'Photo URL',
      soat_exp: 'SOAT Expiry',
      tec_exp: 'Technical inspection expiry',
      enabled: 'Enabled',
      linked_drivers: 'Linked Drivers',
      selectable: 'Selectable',
      currently_driven_by: 'Currently driven by',
    },
    forms: {
      detail: 'Vehicle Detail',
      edit: 'Edit Vehicle',
      create: 'Create Vehicle',
    },
    actions: {
      force_disconnect: 'Disconnect & Disable',
      add_vehicle: 'Add vehicle',
    },
    messages: {
      no_linked_drivers: 'No linked drivers',
      disable_confirm_title: 'Vehicle in use',
      disable_confirm_body: 'This vehicle is currently in use by {name}. Disabling it will force-disconnect them. Do you want to continue?',
      disable_selectable_confirm: '{name} has this vehicle active. Do you want to remove their selection permission?',
    },
    placeholders: {
      photo_url: 'https://...',
    },
    lookup: {
      found: 'Vehicle found',
      not_found: 'No vehicle found with this plate',
      linked_to_drivers: 'Linked to drivers',
      linked_to_n_drivers: 'Linked to {n} drivers',
      currently_driven_by: 'Currently driven by',
      currently_driven_by_x: 'Currently driven by {name}',
      different_plate: 'Use different plate',
      link_this_vehicle: 'Link this vehicle',
      create_vehicle: 'Create vehicle',
    },
    validations: {
      brand_required: 'Brand is required',
      model_required: 'Model is required',
      color_required: 'Color is required',
    },
  },
  users: users,
  common: common,
  validations: validations,
  services: services,
  drivers: drivers,
  wp: wp,
  settings: settings
}