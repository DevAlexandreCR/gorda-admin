export default {
  actions: {
    create: 'Crear nuevo cliente',
    add: 'Agregar',
    add_item: 'Agregar Elemento',
    add_phone_number: 'Agregar Número WhatsApp',
    remove: 'Eliminar',
    enable_interactive: 'Habilitar modo interactivo',
    disable_interactive: 'Deshabilitar modo interactivo',
    share_location: '📍 Compartir ubicación',
  },
  fields: {
    id: 'Teléfono',
    alias: 'Alias',
    buttons: 'Botones',
    button: 'Botón',
    button_text: 'Texto del Botón',
    list: 'Lista',
    list_items: 'Elementos de Lista',
    location_request: 'Solicitud de ubicación',
    characters: 'caracteres',
  },
  placeholders: {
    delete: 'El cliente se eliminará, ¿desea continuar?',
    default: 'Cliente por defecto para las confirmaciones',
    select_default: 'Selecccionar como cliente por defecto',
    select_wp_api: 'Conectar a Whatsapp API',
    restart: 'El cliente se reiniciará, ¿desea continuar?',
    message_type: 'Seleccionar tipo de mensaje',
    button_text: 'Ingrese texto del botón',
    item_id: 'ID del Elemento',
    item_title: 'Título del Elemento',
    item_description: 'Descripción del Elemento (opcional)',
  },
  validations: {
    button_text_max_length: 'El texto del botón debe tener 20 caracteres o menos',
    button_title_max_length: 'Los títulos de botones deben tener 20 caracteres o menos',
    list_items_max_length: 'Títulos máx 24 chars, descripciones máx 72 chars',
  },
  titles: {
    confirmations_messages: 'Mensajes de Confirmación',
    chatbot_messages: 'Chatbot Mensajes',
    interactive_message: 'Editar Mensaje Interactivo',
  },
  errors: {
    facebook_sdk_not_loaded: 'El SDK de Facebook no se ha cargado correctamente',
    failed_to_connect_phone: 'Error al conectar el número de teléfono',
  },
  success: {
    phone_number_connected: 'Número de teléfono conectado exitosamente',
  },
  info: {
    signup_cancelled: 'Proceso de registro cancelado',
    processing: 'Procesando...',
    connecting_phone_number: 'Conectando número de teléfono, por favor espere',
  }
}