export default {
  statuses: {
    canceled: 'Cancelado',
    pending: 'Pendientes',
    in_progress: 'En curso',
    terminated: 'Completado',
  },
  fields: {
    hour: 'Hora',
    status: 'Estado',
    start_address: 'Dir inicial',
    end_address: 'Dir final',
    phone: 'Teléfono',
    name: 'Nombre',
    driver: 'Conductor',
    driver_name: 'Nombre Conductor',
    lat: 'Latitud',
    lng: 'Longitud',
    comment: 'Comentario',
    time: 'Tiempo',
    fee: 'Valor',
    fee_multiplier: 'Multiplicador de tarifa',
    distance: 'Distancia',
    WpMessages: 'Mensajes',
    WpActions: 'Acciones'
  },
  placeholders: {
    end_address_optional: 'Ingresa dirección de destino (opcional)'
  },
  history: 'Historial',
  total: 'Total',
  title: 'Servicio | Servicios',
  messages: {
    new_client: 'El cliente no existe, por lo que se ha creado uno nuevo',
    no_start_loc: 'Debe seleccionar un lugar!',
    driver_assigned: 'El servicio tiene un conductor asignado',
    has_applicants: 'No se puede reiniciar el servicio porque tiene conductores postulados en el momento'
  }
}
