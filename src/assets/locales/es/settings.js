export default {
  fees: {
    actions: {
      add_multiplier: 'Agregar multiplicador',
      remove_multiplier: 'Eliminar multiplicador',
    },
    fields: {
      multiplier: 'Multiplicador',
      time_range: 'Rango de tiempo',
      start_time: 'Hora de inicio',
      end_time: 'Hora de finalización',
    }
  },
  messages: {
    select_city: 'Por favor seleccione una ciudad.'
  },
  monthly_payments: {
    tab_label: 'Mensualidades',
    panel_title: 'Configuración de Mensualidad',
    panel_subtitle: 'Configure la ejecución automática para conductores con plan mensual.',
    field_suggested_amount: 'Monto sugerido',
    field_cutoff_day: 'Día de corte',
    hint_cutoff_day: 'Día del mes (1–28) en que se inhabilitan los conductores mensuales impagos.',
    field_reminder_offsets: 'Anticipación de recordatorios (días antes del corte)',
    hint_reminder_offsets: 'Separado por comas. Ejemplo: 3, 1 → recordatorios en corte−3 y corte−1.',
    warn_unreachable_offsets: 'El offset(s) {offsets} caería en día ≤ 0 para el corte actual y será ignorado.',
    field_auto_disable: 'Inhabilitar automáticamente conductores impagos en el día de corte',
    hint_auto_disable: 'Desactivar esto detiene la ejecución futura pero NO rehabilita conductores ya inhabilitados.',
  },
}