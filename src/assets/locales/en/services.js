export default {
  statuses: {
    pending: 'Pending',
    canceled: 'Canceled',
    in_progress: 'In progress',
    terminated: 'Completed',
  },
  fields: {
    hour: 'Hour',
    status: 'Status',
    start_address: 'Start address',
    end_address: 'End address',
    phone: 'Phone',
    name: 'Name',
    driver: 'Driver',
    driver_name: 'Driver name',
    lat: 'Latitude',
    lng: 'Longitude',
    WpMessages: 'Messages',
    WpActions: 'Actions',
    comment: 'Comment',
    time: 'Time',
    fee: 'Fee',
    fee_multiplier: 'Fee Multiplier',
    distance: 'Distance',
  },
  edit_start_address: 'Edit pickup address',
  current_start_address: 'Current pickup address',
  edit_comment: 'Edit comment',
  current_comment: 'Current comment',
  placeholders: {
    end_address_optional: 'Enter destination address (optional)'
  },
  history: 'History',
  total: 'Total',
  title: 'Service | Services',
  messages: {
    new_client: 'Client does nor exists, therefor has been created a new one',
    no_start_loc: 'No place selected!',
    driver_assigned: 'Service has a driver assigned',
    has_applicants: 'Cannot restart the service because drivers are currently applied',
    start_address_updated: 'Pickup address updated',
    branch_required: 'Select a branch to update the pickup address',
    comment_updated: 'Comment updated'
  }
}
