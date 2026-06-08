import ServiceRepository from '@/repositories/ServiceRepository'
import { ServiceInterface } from '@/types/ServiceInterface'

// firebase/database is already mocked globally in tests/testSetup.ts.
// push is not in the global mock, so we retrieve the mocked module and
// add push ourselves before each test.
const firebaseDatabaseMock = jest.requireMock('firebase/database') as Record<string, jest.Mock>

let pushMock: jest.Mock
let setMock: jest.Mock
let removeMock: jest.Mock

function buildService(overrides: Partial<ServiceInterface> = {}): ServiceInterface {
	return {
		id: null,
		status: 'pending',
		start_loc: { name: 'Start', lat: 1.0, lng: -70.0, country: 'colombia', city: 'popayan' },
		end_loc: null,
		applicants: null,
		phone: '+573001234567',
		name: 'Test User',
		comment: null,
		amount: null,
		metadata: null,
		wp_client_id: 'wpClient',
		driver_id: null,
		client_id: null,
		created_at: 1000000,
		created_by: null,
		assigned_by: null,
		canceled_by: null,
		terminated_by: null,
		...overrides,
	}
}

beforeEach(() => {
	pushMock = jest.fn().mockResolvedValue({ key: 'new-key-123' })
	setMock = jest.fn().mockResolvedValue(undefined)
	removeMock = jest.fn().mockResolvedValue(null)

	firebaseDatabaseMock.push = pushMock
	firebaseDatabaseMock.set = setMock
	firebaseDatabaseMock.remove = removeMock
})

afterEach(() => {
	jest.clearAllMocks()
})

describe('ServiceRepository.create', () => {
	it('canonicalizes client_id from +digits to digits-only', async () => {
		const service = buildService({ client_id: '+573001234567' })
		await ServiceRepository.create(service)
		expect(service.client_id).toBe('573001234567')
	})

	it('canonicalizes client_id from digits@c.us to digits-only', async () => {
		const service = buildService({ client_id: '573001234567@c.us' })
		await ServiceRepository.create(service)
		expect(service.client_id).toBe('573001234567')
	})

	it('passes through null client_id without throwing', async () => {
		const service = buildService({ client_id: null })
		await expect(ServiceRepository.create(service)).resolves.toBeUndefined()
		expect(service.client_id).toBeNull()
	})

	it('preserves the phone field in its original form', async () => {
		const service = buildService({ client_id: '+573001234567', phone: '+573001234567' })
		await ServiceRepository.create(service)
		expect(service.phone).toBe('+573001234567')
	})
})

describe('ServiceRepository.restart', () => {
	it('produces a new service with canonical client_id when source had @c.us', async () => {
		const source = buildService({ id: 'existing-id', client_id: '573001234567@c.us', applicants: null, driver_id: null })

		await ServiceRepository.restart(source)

		// push is called twice: once for the new service push, and the second arg is the new service object
		// The first call to push is from create(newService) with the newService as second argument
		const newServiceArg = pushMock.mock.calls[0][1] as ServiceInterface
		expect(newServiceArg.client_id).toBe('573001234567')
	})

	it('produces a new service with null client_id when source had null', async () => {
		const source = buildService({ id: 'existing-id', client_id: null, applicants: null, driver_id: null })

		await ServiceRepository.restart(source)

		const newServiceArg = pushMock.mock.calls[0][1] as ServiceInterface
		expect(newServiceArg.client_id).toBeNull()
	})
})
