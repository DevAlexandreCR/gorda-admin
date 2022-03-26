export default {
  fields: {
    status: 'Status',
    enabled: 'Enabled',
    disabled: 'Disabled',
    name: 'Name',
    email: 'Email Address',
    phone: 'Phone'
  },
  models: {
    users: 'User | Users',
    drivers: 'Driver | Drivers'
  },
  actions: {
    submit: 'Submit',
    edit: 'Edit',
    close: 'Close',
    create: 'Create',
    cancel: 'Cancel',
    release: 'Release',
    assign: 'Assign',
    terminate: 'Terminate'
  },
  messages: {
    updated: 'Resource updated successfully',
    created: 'Resource created successfully',
    deleted: 'Resource deleted successfully',
    error: 'Something went wrong!'
  },
  placeholders: {
    name: 'Enter name',
    email: 'Enter email',
    phone: 'Enter phone',
    password: 'Password',
    confirm_password: 'Confirm password',
    address: 'Enter Address',
    comment: 'Enter comment',
    map: 'Map'
  },
  forms: {
    select_img: 'Choose image from files'
  },
  chatBot: {
    connected: 'Connected',
    disconnected: 'Disconnected'
  }
}