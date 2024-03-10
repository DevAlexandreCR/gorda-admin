export default {
  fields: {
    createdAt: 'Created',
    status: 'Status',
    enabled: 'Enabled',
    disabled: 'Disabled',
    name: 'Name',
    email: 'Email Address',
    phone: 'Phone'
  },
  models: {
    users: 'User | Users',
    drivers: 'Driver | Drivers',
    drivers_connected: 'Connected Drivers'
  },
  actions: {
    submit: 'Submit',
    edit: 'Edit',
    close: 'Close',
    create: 'Create',
    delete: 'Delete',
    cancel: 'Cancel',
    release: 'Release',
    assign: 'Assign',
    terminate: 'Terminate',
    filter: 'Filter',
    see: 'See',
    clear_filters: 'Clear Filters',
    items_pages: 'Items per Pages'
  },
  messages: {
    updated: 'Resource updated successfully',
    created: 'Resource created successfully',
    deleted: 'Resource deleted successfully',
    error: 'Something went wrong!',
    waiting: 'Please wait ...',
    forbidden: 'Permission denied'
  },
  placeholders: {
    name: 'Enter name',
    email: 'Enter email',
    phone: 'Enter phone',
    password: 'Password',
    confirm_password: 'Confirm password',
    restore_password: 'Reset Password?',
    address: 'Enter Address',
    comment: 'Enter comment',
    search: 'Search',
    map: 'Map',
    all: 'All',
    device: 'Driver has not device registered',
    cancel_percent: 'Canceled index'
  },
  filters: {
    title: 'Filters',
    from: 'From',
    until: 'Until',
    driver_plate: 'Driver\'s plate',
    number_client: 'Client\'s number'
  },
  forms: {
    select_img: 'Choose image from files'
  },
  chatBot: {
    connected: 'Connected',
    disconnected: 'Disconnected',
    disconnect: 'Disconnect',
    connect: 'Connect',
    reset: 'Reset'
  },
  colors: {
    black: 'Black',
    blue: 'Blue',
    gray: 'Gray',
    green: 'Green',
    purple: 'Purple',
    red: 'Red',
    white: 'White',
    pink: 'Pink',
    orange: 'Orange',
    gold: 'Gold',
    yellow: 'Yellow',
    magenta: 'Magenta',
    cyan: 'Cyan',
    brown: 'Brown',
    maroon: 'Maroon',
    beige: 'Beige',
    silver: 'Silver'
  },
  settings: {
    wpNotifications: 'WhatsApp Confirmations',
    chatBot: 'WhatsApp ChatBot',
    alert_notifications: 'Until confirmations are enabled won\'t send messages',
    alert_chatBot: 'Until chatBot are enabled won\'t create services automatically',
    Ride_Fees: 'Ride Fees',
    price_kilometer: 'price for kilometer',
    price_minute: 'price for minute',
    fees_base: 'base fee',
    fees_additional: 'fee additional',
    fees_minimum: 'fee for minimum',
    fees_night: 'fee of night',
    fees_DxF: 'Sundays and holidays',
    fees_night_DxF: 'Sundays and night holidays'
  }
}