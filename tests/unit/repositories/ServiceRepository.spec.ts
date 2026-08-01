import ServiceRepository from '@/repositories/ServiceRepository'
import Service from '@/models/Service'

describe('ServiceRepository.create', () => {
  const firebaseDatabaseMock = jest.requireMock('firebase/database') as Record<string, jest.Mock>

  beforeEach(() => {
    firebaseDatabaseMock.push = jest.fn().mockResolvedValue({ key: 'new-service-id' })
    firebaseDatabaseMock.set.mockClear().mockResolvedValue(null)
  })

  it('persists origin = test and keeps directed_to through the push + update cycle when pre-set', async () => {
    const service = new Service()
    service.origin = Service.ORIGIN_TEST
    service.directed_to = 'driver-1'

    await ServiceRepository.create(service)

    expect(firebaseDatabaseMock.set).toHaveBeenCalledTimes(1)
    const persisted = firebaseDatabaseMock.set.mock.calls[0][1]
    expect(persisted.origin).toBe(Service.ORIGIN_TEST)
    expect(persisted.directed_to).toBe('driver-1')
  })

  it('defaults origin to admin when unset (no regression)', async () => {
    const service = new Service()

    await ServiceRepository.create(service)

    expect(firebaseDatabaseMock.set).toHaveBeenCalledTimes(1)
    const persisted = firebaseDatabaseMock.set.mock.calls[0][1]
    expect(persisted.origin).toBe(Service.ORIGIN_ADMIN)
  })
})

describe('ServiceRepository.release', () => {
  const firebaseDatabaseMock = jest.requireMock('firebase/database') as Record<string, jest.Mock>

  beforeEach(() => {
    firebaseDatabaseMock.update = jest.fn().mockResolvedValue(null)
  })

  it('does not strip directed_to or origin (top-level fields untouched)', async () => {
    await ServiceRepository.release('service-1')

    expect(firebaseDatabaseMock.update).toHaveBeenCalledTimes(1)
    const payload = firebaseDatabaseMock.update.mock.calls[0][1]
    expect(payload).not.toHaveProperty('directed_to')
    expect(payload).not.toHaveProperty('origin')
  })
})

describe('ServiceRepository.restart', () => {
  const firebaseDatabaseMock = jest.requireMock('firebase/database') as Record<string, jest.Mock>

  beforeEach(() => {
    firebaseDatabaseMock.remove = jest.fn().mockResolvedValue(null)
  })

  it('carries directed_to and origin onto the recreated service', async () => {
    const createSpy = jest.spyOn(ServiceRepository, 'create').mockResolvedValue(undefined)
    const service = new Service()
    service.id = 'service-1'
    service.origin = Service.ORIGIN_TEST
    service.directed_to = 'driver-1'
    service.driver_id = null
    service.applicants = null

    await ServiceRepository.restart(service)

    expect(createSpy).toHaveBeenCalledTimes(1)
    const recreated = createSpy.mock.calls[0][0]
    expect(recreated.origin).toBe(Service.ORIGIN_TEST)
    expect(recreated.directed_to).toBe('driver-1')

    createSpy.mockRestore()
  })
})
