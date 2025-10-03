// Example usage of the Interactive type with list support

import type { Interactive } from '@/types/Interactive'

// Button message example
const buttonMessage: Interactive = {
  type: 'button',
  body: { text: 'Please select an option:' },
  action: {
    buttons: [
      {
        type: 'reply',
        reply: {
          id: 'option1',
          title: 'Option 1'
        }
      },
      {
        type: 'reply',
        reply: {
          id: 'option2',
          title: 'Option 2'
        }
      }
    ]
  },
  header: {
    type: 'text',
    text: 'Menu Options'
  },
  footer: {
    text: 'Choose wisely!'
  }
}

// List message example (matches WhatsApp API structure with sections)
const listMessage: Interactive = {
  type: 'list',
  body: { text: 'Choose from our menu:' },
  action: {
    button: 'View Menu',
    sections: [
      {
        rows: [
          {
            id: 'main1',
            title: 'Grilled Chicken',
            description: 'Tender grilled chicken with herbs'
          },
          {
            id: 'main2',
            title: 'Beef Steak',
            description: 'Premium beef steak cooked to perfection'
          },
          {
            id: 'dessert1',
            title: 'Chocolate Cake',
            description: 'Rich chocolate cake with cream'
          },
          {
            id: 'dessert2',
            title: 'Ice Cream',
            description: 'Vanilla ice cream with toppings'
          }
        ]
      }
    ]
  },
  header: {
    type: 'text',
    text: 'Restaurant Menu'
  },
  footer: {
    text: 'All items freshly prepared'
  }
}

// Location request message example
const locationMessage: Interactive = {
  type: 'location_request_message',
  body: { text: 'Please share your location so we can assist you better.' },
  action: {},
  header: {
    type: 'text',
    text: 'Location Required'
  }
}

export { buttonMessage, listMessage, locationMessage }