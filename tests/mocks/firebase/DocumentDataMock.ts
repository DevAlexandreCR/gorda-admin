import {DocumentData} from 'firebase/firestore'
import ServiceMock from '../entities/ServiceMock'

class DocumentDataMock implements DocumentData {
	data = () => {
		return new ServiceMock
	}
}

export default new DocumentDataMock()