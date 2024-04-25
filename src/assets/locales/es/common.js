export default {
  fields: {
    createdAt: 'Creado',
    status: 'Estado',
    enabled: 'Habilitado',
    disabled: 'Inhabilitado',
    name: 'Nombre',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    label_message: 'Mensajes: ',
    label_description: 'Descripcion: ',
    label_preview: 'Vista Previa: '
  },
  models: {
    users: 'Usuario | Usuarios',
    drivers: 'Conductor | Conductores',
    drivers_connected: 'Conductores Conectados'
  },
  actions: {
    submit: 'Enviar',
    edit: 'Editar',
    close: 'Cerrar',
    create: 'Crear',
    delete: 'Eliminar',
    cancel: 'Cancelar',
    release: 'Liberar',
    assign: 'Asignar',
    terminate: 'Terminar',
    filter: 'Filtrar',
    see: 'Ver',
    clear_filters: 'Limpiar Filtros',
    items_pages: 'Elementos Por Pagina'
  },
  messages: {
    updated: 'Recurso actualizado correctamente',
    created: 'Recurso creado correctamente',
    deleted: 'Recurso eliminado correctamente',
    error: 'Algo salió mal!',
    waiting: 'Por favor espere...',
    forbidden: 'Permiso denegado!',
    error_chatBot: 'El chatBot y las notificaciones de WhatsApp no pueden estar habilitadas al mismo tiempo!',
    error_assistant: 'El chatBot y el asistente no pueden estar habilitados al mismo tiempo!',
  },
  placeholders: {
    name: 'Ingrese el nombre',
    email: 'Ingrese el email',
    phone: 'Ingrese el teléfono',
    password: 'Contraseña',
    confirm_password: 'Confirmar contraseña',
    restore_password: '¿Restablecer Contraseña?',
    address: 'Ingrese la dirección',
    comment: 'Ingrese un comentario (opcional)',
    search: 'Buscar',
    map: 'Mapa',
    all: 'Todos',
    device: 'No tiene dispositivo registrado',
    cancel_percent: 'Índice de cancelación',
    service_info: 'Información del servicio',
    route_info: 'Información de la ruta y conductor',
    description: {
      plate: 'Placa del veviculo',
      vehicleColor: 'Color de vehiculo',
      username: 'Nombre',
      companyNumber: 'Numero de Empresa',
      placeName: 'Lugar'
    },
    label: {
      plate: 'Placa',
      color: 'Color',
      name: 'Nombre',
      numberPQR: 'PQR',
      placeName: 'Lugar'
    }
  },
  forms: {
    select_img: 'Choose image from files'
  },
  filters: {
    title: 'Filtros',
    from: 'Desde',
    until: 'Hasta',
    driver_plate: 'Placa conductor',
    number_client: 'Número del cliente'
  },
  chatBot: {
    connected: 'Conectado',
    disconnected: 'Desconectado',
    disconnect: 'Desconectar',
    connect: 'Conectar',
    reset: 'Reiniciar'
  },
  colors: {
    black: 'Negro',
    blue: 'Azul',
    gray: 'Gris',
    green: 'Verde',
    purple: 'Purpura',
    red: 'Rojo',
    white: 'Blanco',
    pink: 'Rosado',
    orange: 'Naranja',
    gold: 'Dorado',
    yellow: 'Amarillo',
    magenta: 'Magenta',
    cyan: 'Cyan',
    brown: 'Café',
    maroon: 'Marrón',
    beige: 'Beige',
    silver: 'Plateado'
  },
  settings: {
    wpNotifications: 'Confirmaciones de WhatsApp',
    alert_notifications: 'No se enviarán mensajes hasta que las confirmaciones estén habilitadas',
    chatBot: 'WhatsApp ChatBot',
    assistant: 'Asistente Bot',
    alert_chatBot: 'Habilita el chatBot para que gestione completamente los servicios',
    alert_assistant: 'Habilita el asistente para crear servicios cuando el cliente envía la ubicación',
    Ride_Fees: 'Tarifas',
    Messages: 'Mensajes',
    price_kilometer: 'Precio por kilómetro',
    price_minute: 'Precio por Minuto',
    fees_base: 'Tarifa Base',
    fees_additional: 'Tarifas Adicionales',
    fees_minimum: 'Tarifa Mínima',
    fees_night: 'Nocturno',
    fees_DxF: 'Domingos y Festivos',
    fees_night_DxF: 'Domingos y Festivos Nocturnos'
  },
  titles: {
    title_modal: 'Editar Mensajes de WhatsApp',
    title_card: 'Tabla de Mensajes WhatsApp'
  }
}