import { remove } from "firebase/database";

export default {
    actions: {
        create: 'Create new Client',
        add: 'Add',
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
        location_request: 'Location Request',
    },
    placeholders: {
        delete: 'The client will be removed, do ypu want to continue?',
        default: 'Default client to confirmations',
        select_default: 'Select default',
        select_wp_api: 'Connect to Whatsapp API',
        restart: 'The client will be restarted, do you want to continue?',
        message_type: 'Select message type',
    },
    titles: {
        confirmations_messages: 'Confirmations Messages',
        chatbot_messages: 'Chatbot Messages',
        interactive_message: 'Edit Interactive Message',
    }
}