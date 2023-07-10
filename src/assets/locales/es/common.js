export default {
  fields: {
    createdAt: 'Creado',
    status: 'Estado',
    enabled: 'Habilitado',
    disabled: 'Inhabilitado',
    name: 'Nombre',
    email: 'Correo electrónico',
    phone: 'Teléfono'
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
    cancel: 'Cancelar',
    release: 'Liberar',
    assign: 'Asignar',
    terminate: 'Terminar',
    filter: 'Filtrar',
    see: 'Ver',
    clear_filters: 'Limpiar Filtros',
    update: 'Actualizar Mensaje'
  },
  messages: {
    updated: 'Recurso actualizado correctamente',
    created: 'Recurso creado correctamente',
    deleted: 'Recurso eliminado correctamente',
    error: 'Algo salió mal!',
    waiting: 'Por favor espere...',
    forbidden: 'Permiso denegado!',
    update_message: 'Actualiza el mensaje aqui !',
    menssage: 'Mensaje:'
  },
  placeholders: {
    name: 'Ingrese el nombre',
    email: 'Ingrese el email',
    phone: 'Ingrese el teléfono',
    password: 'Contraseña',
    confirm_password: 'Confirmar contraseña',
    address: 'Ingrese la dirección',
    comment: 'Ingrese un comentario (opcional)',
    search: 'Buscar',
    map: 'Mapa',
    all: 'Todos'
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
    alert_notifications: 'No se enviarán mensajes hasta que las confirmaciones estén habilitadas'
  }
}