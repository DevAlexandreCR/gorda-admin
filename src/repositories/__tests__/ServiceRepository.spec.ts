import ServiceRepository from '@/repositories/ServiceRepository'
import { ServiceInterface } from '@/types/ServiceInterface'
import serverApi from '@/services/gordaApi/server/ServerApi'
import * as Sentry from '@sentry/vue'

// firebase/database is already mocked globally in tests/testSetup.ts.
// push is not in the global mock, so we retrieve the mocked module and
// add push ourselves before each test.
const firebaseDatabaseMock = jest.requireMock('firebase/database') as Record<string, jest.Mock>

// serverApi is a singleton axios instance. jest.mock cannot intercept it after
// ServiceRepository has been evaluated, so we use jest.spyOn on the live instance.
let serverApiGetSpy: jest.SpyInstance

let pushMock: jest.Mock
let setMock: jest.Mock
let removeMock: jest.Mock
let updateMock: jest.Mock

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
	updateMock = jest.fn().mockResolvedValue(null)

	firebaseDatabaseMock.push = pushMock
	firebaseDatabaseMock.set = setMock
	firebaseDatabaseMock.remove = removeMock
	firebaseDatabaseMock.update = updateMock

	serverApiGetSpy = jest.spyOn(serverApi, 'get').mockResolvedValue({
		data: { data: { completedServicesCount: 0 } },
	} as any)
})

afterEach(() => {
	jest.clearAllMocks()
	serverApiGetSpy.mockRestore()
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

	it('hydrates client_completed_services_count from serverApi.get response', async () => {
		serverApiGetSpy.mockResolvedValue({
			data: { data: { completedServicesCount: 7 } },
		} as any)
		const service = buildService({ client_id: '+573001234567' })
		await ServiceRepository.create(service)
		expect(service.client_completed_services_count).toBe(7)
	})

	it('sends the canonicalized id in the serverApi.get request path', async () => {
		serverApiGetSpy.mockResolvedValue({
			data: { data: { completedServicesCount: 3 } },
		} as any)
		const service = buildService({ client_id: '+573001234567@c.us' })
		await ServiceRepository.create(service)
		expect(serverApiGetSpy).toHaveBeenCalledWith('/services/clients/573001234567/completed-count')
	})

	it('falls back to 0 and calls Sentry.captureException when serverApi.get rejects', async () => {
		const thrownError = new Error('network failure')
		serverApiGetSpy.mockRejectedValue(thrownError)
		const sentrySpy = jest.spyOn(Sentry, 'captureException').mockImplementation(() => 'fake-event-id')

		const service = buildService({ client_id: '+573001234567' })
		await ServiceRepository.create(service)

		expect(service.client_completed_services_count).toBe(0)
		expect(sentrySpy).toHaveBeenCalledTimes(1)
		expect(sentrySpy).toHaveBeenCalledWith(thrownError)
	})

	it('does not set client_completed_services_count and does not call serverApi.get when client_id is null', async () => {
		const service = buildService({ client_id: null })
		await ServiceRepository.create(service)

		const payload = setMock.mock.calls[0][1] as ServiceInterface
		expect(payload).not.toHaveProperty('client_completed_services_count')
		expect(serverApiGetSpy).not.toHaveBeenCalled()
	})

	it('does not set client_completed_services_count and does not call serverApi.get when client_id is empty string', async () => {
		const service = buildService({ client_id: '' })
		await ServiceRepository.create(service)

		const payload = setMock.mock.calls[0][1] as ServiceInterface
		expect(payload).not.toHaveProperty('client_completed_services_count')
		expect(serverApiGetSpy).not.toHaveBeenCalled()
	})
})

describe('ServiceRepository.restart', () => {
	it('produces a new service with canonical client_id when source had @c.us', async () => {
		const source = buildService({ id: 'existing-id', client_id: '573001234567@c.us', applicants: null, driver_id: null })

		await ServiceRepository.restart(source)

		// push is called by create() — the second argument is the new service object
		const newServiceArg = pushMock.mock.calls[0][1] as ServiceInterface
		expect(newServiceArg.client_id).toBe('573001234567')
	})

	it('produces a new service with null client_id when source had null', async () => {
		const source = buildService({ id: 'existing-id', client_id: null, applicants: null, driver_id: null })

		await ServiceRepository.restart(source)

		const newServiceArg = pushMock.mock.calls[0][1] as ServiceInterface
		expect(newServiceArg.client_id).toBeNull()
	})

	it('includes client_completed_services_count in the RTDB payload when endpoint returns N', async () => {
		const completedCount = 5
		serverApiGetSpy.mockResolvedValue({
			data: { data: { completedServicesCount: completedCount } },
		} as any)

		const source = buildService({
			id: 'existing-id',
			client_id: '573001234567',
			applicants: null,
			driver_id: null,
		})

		await ServiceRepository.restart(source)

		// set is called by update() inside create() — the second argument is the full service payload
		const rtdbPayload = setMock.mock.calls[0][1] as ServiceInterface
		expect(rtdbPayload.client_completed_services_count).toBe(completedCount)
	})
})

describe('ServiceRepository.assign', () => {
	it('sends driver_id, status, assigned_by, and vehicle: null in the updateDB payload', async () => {
		await ServiceRepository.assign('service-abc', 'driver-xyz')

		// updateDB (imported as `update` from firebase/database) is called first
		expect(updateMock).toHaveBeenCalledTimes(1)
		const updatePayload = updateMock.mock.calls[0][1] as Record<string, unknown>
		expect(updatePayload).toMatchObject({
			driver_id: 'driver-xyz',
			status: 'in_progress',
			vehicle: null,
		})
		// assigned_by comes from AuthService.getCurrentUser() which is set globally in testSetup.ts
		expect(updatePayload).toHaveProperty('assigned_by')
	})

	it('also calls set on drivers_assigned after the updateDB resolves', async () => {
		await ServiceRepository.assign('service-abc', 'driver-xyz')

		expect(setMock).toHaveBeenCalledTimes(1)
		// second argument to set() is the serviceId
		expect(setMock.mock.calls[0][1]).toBe('service-abc')
	})
})

describe('ServiceRepository.release', () => {
	it('sends driver_id: null, status: pending, applicants: null, metadata: null, and vehicle: null in the updateDB payload', async () => {
		await ServiceRepository.release('service-abc')

		expect(updateMock).toHaveBeenCalledTimes(1)
		const updatePayload = updateMock.mock.calls[0][1] as Record<string, unknown>
		expect(updatePayload).toMatchObject({
			driver_id: null,
			status: 'pending',
			applicants: null,
			metadata: null,
			vehicle: null,
		})
	})

	it('does not call set after releasing', async () => {
		await ServiceRepository.release('service-abc')

		expect(setMock).not.toHaveBeenCalled()
	})
})
