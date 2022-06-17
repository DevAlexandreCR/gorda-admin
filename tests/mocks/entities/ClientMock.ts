import {ClientInterface} from '@/types/ClientInterface'

class ClientMock implements ClientInterface{
  id = 'id'
  name = 'Admin 1'
  public phone = '3103100000'
}

export default new ClientMock()