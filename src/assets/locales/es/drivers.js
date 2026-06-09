export default {
  fields: {
    name: 'Nombre',
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirm_password: 'Confirme su contraseña',
    phone: 'Teléfono',
    status: 'Estado',
    doc_type: 'Tipo doc',
    document: 'Documento',
    vehicle: 'Vehículo',
    plate: 'Placa',
    color: 'Color',
    soat_exp: 'Soat',
    tec_exp: 'Tecno-mecánica',
    balance: 'Saldo',
    payment_mode: 'Modo de pago'
  },
  actions: {
    send_message_to_all: 'Enviar mensaje a todos los conductores',
    send_message_to: 'Enviar mensaje a {name}',
    sent_success: 'Mensaje enviado correctamente'
  },
  forms: {
    edit: 'Editar información del conductor',
    create: 'Formulario de creación del conductor',
    create_vehicle: 'Información del vehículo',
    create_driver: 'Información del conductor',
    upload: 'Cargar foto de perfil',
    upload_vehicle: 'Cargar foto del vehículo',
    current_balance: 'Saldo actual',
    add_balance: 'Agregar saldo',
    manage_balance: 'Administrar'
  },
  vehicle: {
    brand: 'Marca',
    model: 'Modelo',
    plate: 'Placas',
    color: 'Color',
    soat_exp: 'Soat',
    tec_exp: 'Tecno-mecánica'
  },
  placeholders: {
    docType: 'Tipo de documento',
    document: 'ingrese número de documento',
    brand: 'Ingrese marca del vehículo',
    model: 'Ingrese modelo del vehículo',
    plate: 'ingrese el número de placa',
    photo: 'Seleccione foto de perfil',
    photo_vehicle: 'Seleccione foto del vehículo',
    color: 'Seleccione el color del vehículo',
    soat_exp: 'Seleccione vencimiento del soat',
    tec_exp: 'Seleccione vencimiento de la tecno-mecánica'
  },
  filters: {
    add_filter: '+ Agregar filtro',
    filter_status: 'Estado',
    filter_payment: 'Pago',
    filter_inactive: 'Inactividad',
    chip_status: 'Estado: {value}',
    chip_payment: 'Pago: {value}',
    chip_inactive: 'Inactivo > {days}d',
    inactive_none: 'Ninguno',
    inactive_days: '{days}d',
    custom: 'Personalizado',
    custom_placeholder: 'Días',
    status_values: {
      enabled: 'Habilitado',
      disabled: 'Inhabilitado',
    },
    payment_values: {
      monthly: 'Mensualidad',
      percentage: 'Porcentaje',
    },
  },
  bulk: {
    selected: 'seleccionados',
    disable_confirm: '¿Inhabilitar {count} conductor(es)? Esta acción revocará su acceso.',
    enable_result: '{processed} habilitados · {failed} fallidos',
    disable_result: '{processed} inhabilitados · {failed} fallidos',
    send_result: '{processed} enviados · {failed} fallidos',
  }
}