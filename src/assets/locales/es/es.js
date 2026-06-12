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
    vehicles: 'Vehículos',
    places: 'Lugares',
    metrics: 'Métricas',
    settings: 'Ajustes'
  },
  vehicles: {
    fields: {
      plate: 'Placa',
      brand: 'Marca',
      model: 'Modelo',
      color: 'Color',
      photo_url: 'URL de Foto',
      soat_exp: 'Venc. SOAT',
      tec_exp: 'Venc. Tec-Mec',
      enabled: 'Habilitado',
      linked_drivers: 'Conductores Vinculados',
      selectable: 'Seleccionable',
      currently_driven_by: 'En uso por',
    },
    forms: {
      detail: 'Detalle del Vehículo',
      edit: 'Editar Vehículo',
      create: 'Crear Vehículo',
    },
    actions: {
      force_disconnect: 'Desconectar y Deshabilitar',
      add_vehicle: 'Agregar vehículo',
    },
    messages: {
      no_linked_drivers: 'Sin conductores vinculados',
      disable_confirm_title: 'Vehículo en uso',
      disable_confirm_body: 'El vehículo está siendo usado por {name}. Deshabilitarlo lo desconectará forzosamente. ¿Desea continuar?',
      disable_selectable_confirm: '{name} tiene este vehículo activo. ¿Desea quitar el permiso de selección?',
      cannot_enable_incomplete: 'No se puede habilitar: faltan campos obligatorios: {fields}',
    },
    placeholders: {
      photo_url: 'https://...',
    },
    lookup: {
      found: 'Vehículo encontrado',
      not_found: 'No se encontró ningún vehículo con esta placa',
      linked_to_drivers: 'Vinculado a conductores',
      linked_to_n_drivers: 'Vinculado a {n} conductores',
      currently_driven_by: 'En uso por',
      currently_driven_by_x: 'En uso actualmente por {name}',
      different_plate: 'Usar placa diferente',
      link_this_vehicle: 'Vincular este vehículo',
      create_vehicle: 'Crear vehículo',
    },
    validations: {
      brand_required: 'La marca es obligatoria',
      model_required: 'El modelo es obligatorio',
      color_required: 'El color es obligatorio',
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