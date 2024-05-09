import {MessagesEnum} from '@/constants/MessagesEnum'

export class Constants {
  static readonly DOC_TYPE_CC = 'CC'
  static readonly DOC_TYPE_CE = 'CE'
  static readonly DEFAULT_CLIENT = 'default-client'

  static readonly DOC_TYPES = [
    Constants.DOC_TYPE_CC,
    Constants.DOC_TYPE_CE
  ]
  
  static readonly COLORS = [
    {name: 'black', hex: '#000000'},
    {name: 'blue', hex: '#0000FF'},
    {name: 'gray', hex: '#808080'},
    {name: 'green', hex: '#008000'},
    {name: 'purple', hex: '#800080'},
    {name: 'red', hex: '#FF0000'},
    {name: 'white', hex: '#FFFFFF'},
    {name: 'pink', hex: '#FFC0CB'},
    {name: 'orange', hex: '#FFA500'},
    {name: 'gold', hex: '#FFD700'},
    {name: 'yellow', hex: '#FFFF00'},
    {name: 'magenta', hex: '#FF00FF'},
    {name: 'cyan', hex: '#00FFFF'},
    {name: 'brown', hex: '#A52A2A'},
    {name: 'maroon', hex: '#800000'},
    {name: 'beige', hex: '#F5F5DC'},
    {name: 'silver', hex: '#C0C0C0'},
  ]

  static readonly CONFIRMATIONS = [
    MessagesEnum.SERVICE_CREATED,
    MessagesEnum.SERVICE_ASSIGNED,
    MessagesEnum.DRIVER_ARRIVED,
    MessagesEnum.CANCELED,
    MessagesEnum.SERVICE_COMPLETED
  ]
}