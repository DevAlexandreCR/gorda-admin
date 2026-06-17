export default {
  fees: {
    actions: {
      add_multiplier: 'Add Multiplier',
      remove_multiplier: 'Remove Multiplier',
    },
    fields: {
      multiplier: 'Multiplier',
      time_range: 'Time Range',
      start_time: 'Start Time',
      end_time: 'End Time',
    }
  },
  messages: {
    select_city: 'Please select a city to create a place.'
  },
  monthly_payments: {
    tab_label: 'Monthly Payments',
    panel_title: 'Monthly Payment Settings',
    panel_subtitle: 'Configure automatic enforcement for drivers on the monthly payment plan.',
    field_suggested_amount: 'Suggested Amount',
    field_cutoff_day: 'Cutoff Day',
    hint_cutoff_day: 'Day of the month (1–28) on which unpaid monthly drivers are disabled.',
    field_reminder_offsets: 'Reminder Offsets (days before cutoff)',
    hint_reminder_offsets: 'Comma-separated. Example: 3, 1 → reminders on cutoff−3 and cutoff−1.',
    warn_unreachable_offsets: 'Offset(s) {offsets} would fall on day ≤ 0 for the current cutoff and will be ignored.',
    field_auto_disable: 'Auto-disable unpaid drivers on cutoff day',
    hint_auto_disable: 'Disabling this stops future enforcement but does NOT re-enable already-disabled drivers.',
  },
}