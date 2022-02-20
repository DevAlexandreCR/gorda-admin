export default {
  fields: {
    status: 'Estado',
    enabled: 'Habilitado',
    disabled: 'Inhabilitado'
  },
  models: {
    users: 'Usuario | Usuarios'
  },
  actions: {
    submit: 'Enviar',
    edit: 'Editar',
    close: 'Cerrar',
    create: 'Crear'
  },
  messages: {
    updated: 'Recurso actualizado correctamente',
    created: 'Recurso creado correctamente',
    deleted: 'Recurso eliminado correctamente',
    error: 'Algo salió mal!'
  },
  placeholders: {
    name: 'Ingrese el nombre',
    email: 'Ingrese el email',
    phone: 'Ingrese el teléfono',
    password: 'Contraseña',
    confirm_password: 'Confirmar contraseña',
    address: 'Ingrese la dirección',
    comment: 'Ingrese un comentario (opcional)'
  }
}