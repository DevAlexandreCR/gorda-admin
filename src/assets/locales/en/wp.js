export default {
  actions: {
    create: 'Create new Client',
    add: 'Add',
    add_item: 'Add Item',
    add_phone_number: 'Add WhatsApp Number',
    remove: 'Remove',
    enable_interactive: 'Enable Interactive Mode',
    disable_interactive: 'Disable Interactive Mode',
    share_location: '📍 Share your location',
  },
  fields: {
    id: 'Phone',
    alias: 'Alias',
    buttons: 'Buttons',
    button: 'Button',
    button_text: 'Button Text',
    list: 'List',
    list_items: 'List Items',
    location_request: 'Location Request',
    characters: 'chars',
  },
  placeholders: {
    delete: 'The client will be removed, do ypu want to continue?',
    default: 'Default client to confirmations',
    select_default: 'Select default',
    select_wp_api: 'Connect to Whatsapp API',
    restart: 'The client will be restarted, do you want to continue?',
    message_type: 'Select message type',
    button_text: 'Enter button text',
    item_id: 'Item ID',
    item_title: 'Item Title',
    item_description: 'Item Description (optional)',
  },
  validations: {
    button_text_max_length: 'Button text must be 20 characters or less',
    button_title_max_length: 'Button titles must be 20 characters or less',
    list_items_max_length: 'Item titles max 24 chars, descriptions max 72 chars',
  },
  titles: {
    confirmations_messages: 'Confirmations Messages',
    chatbot_messages: 'Chatbot Messages',
    interactive_message: 'Edit Interactive Message',
  },
  errors: {
    facebook_sdk_not_loaded: 'Facebook SDK has not loaded correctly',
  },
  success: {
    phone_number_connected: 'Phone number connected successfully',
  },
  info: {
    signup_cancelled: 'Signup process cancelled',
  }
}