import { mount } from '@vue/test-utils'
import ClientCompletedBadge from '@/components/services/ClientCompletedBadge.vue'

describe('ClientCompletedBadge.vue', () => {
  it('renders the badge span when count is 5', () => {
    const wrapper = mount(ClientCompletedBadge, { props: { count: 5 } })
    const badge = wrapper.find('span.badge')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('5')
  })

  it('does not render the badge span when count is 0', () => {
    const wrapper = mount(ClientCompletedBadge, { props: { count: 0 } })
    expect(wrapper.find('span.badge').exists()).toBe(false)
  })

  it('does not render the badge span when count is null', () => {
    const wrapper = mount(ClientCompletedBadge, { props: { count: null } })
    expect(wrapper.find('span.badge').exists()).toBe(false)
  })

  it('does not render the badge span when count is undefined', () => {
    const wrapper = mount(ClientCompletedBadge, {})
    expect(wrapper.find('span.badge').exists()).toBe(false)
  })
})
