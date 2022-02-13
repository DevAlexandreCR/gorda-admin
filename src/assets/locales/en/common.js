export default {
  fields: {
    status: 'Status',
    enabled: 'Enabled',
    disabled: 'Disabled'
  },
  models: {
    users: 'User | Users'
  },
  actions: {
    submit: 'Submit',
    edit: 'Edit',
    close: 'Close',
    create: 'Create'
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
    confirm_password: 'Confirm password'
  }
}