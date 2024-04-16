import { shallowMount, VueWrapper } from '@vue/test-utils'
import i18n from '@/plugins/i18n'
import IndexVue from '@/views/settings/messages/Index.vue'
import router from '@/router'
import { nextTick } from 'vue'
import SettingsRepository from '@/repositories/SettingsRepository'

describe('Index.vue', () => {
  let wrapper: VueWrapper<any>
 SettingsRepository.updateMessage = jest.fn().mockResolvedValue('updateMessages')
 SettingsRepository.getMessages = jest.fn().mockResolvedValue([
  { id: '1', name: 'Test Name 1', description: 'Test Description 1', message: 'Test Message 1', enabled: true },
  { id: '2', name: 'Test Name 2', description: 'Test Description 2', message: 'Test Message 2', enabled: false }
]),

  beforeEach(async () => {
    wrapper = shallowMount(IndexVue, {
      attachTo: '#root',
      global: {
        plugins: [router, i18n],
      },
    })
    await nextTick()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render the card title correctly', () => {
    const submitButton = wrapper.find('.btn')
    const checkbox = wrapper.find('input[type="checkbox"]')
    expect(checkbox.exists()).toBe(true)
    expect(submitButton.exists()).toBe(true)
    expect(wrapper.find('.card-header h6').text()).toBe('WhatsApp Message Table')

  })

  it('should render the table with correct columns', () => {
    const tableHeaders = wrapper.findAll('th')
    expect(tableHeaders.length).toBe(5)
    expect(tableHeaders[0].text()).toBe('Name')
    expect(tableHeaders[1].text()).toBe('Comment')
    expect(tableHeaders[2].text()).toBe('Messages')
    expect(tableHeaders[3].text()).toBe('Status')
    expect(tableHeaders[4].text()).toBe('Actions')
  })

  it('should render each row with correct message data', async () => {
    await nextTick()
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
    expect(rows[0].text()).toContain('Test Name 1')
    expect(rows[0].text()).toContain('Test Description 1')
    expect(rows[0].text()).toContain('Test Message 1')
    expect(rows[1].text()).toContain('Test Name 2')
    expect(rows[1].text()).toContain('Test Description 2')
    expect(rows[1].text()).toContain('Test Message 2')
  })

  it('should set selected message when edit button is clicked', async () => {
    wrapper.vm.$emit('editMessage', { id: '1', name: 'Test Name 1', description: 'Test Description 1', message: 'Test Message 1', enabled: true })
    await wrapper.vm.$nextTick()
  })

  it('should toggle message status when checkbox is clicked', async () => {
    await nextTick()
    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.trigger('click')
    expect(SettingsRepository.updateMessage).toHaveBeenCalled()
  })
})

