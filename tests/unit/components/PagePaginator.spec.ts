import { mount, VueWrapper } from '@vue/test-utils'
import PagePaginator from '@/components/PagePaginator.vue'
import i18n from '@/plugins/i18n'
import { nextTick } from 'vue'

describe('PagePaginator.vue', () => {
  const createWrapper = (props: Record<string, any>): VueWrapper<any> => {
    return mount(PagePaginator, {
      global: {
        plugins: [i18n],
      },
      props: {
        total: 100,
        page: 1,
        perPage: 10,
        ...props,
      },
    })
  }

  // ── Truncation logic ────────────────────────────────────────────────────────

  it('renders all pages without ellipses when totalPages <= 7', () => {
    const wrapper = createWrapper({ total: 50, page: 1, perPage: 10 })
    // 50/10 = 5 pages — all should be visible, no ellipsis
    const pageButtons = wrapper.findAll('.page-link')
    const texts = pageButtons.map(b => b.text())
    expect(texts).toContain('1')
    expect(texts).toContain('5')
    expect(texts).not.toContain('…')
  })

  it('renders leading window [1] 2 3 … N for page 1 of many', () => {
    // 10 pages, page 1 — triggers the p <= 3 branch
    const wrapper = createWrapper({ total: 100, page: 1, perPage: 10 })
    const pageButtons = wrapper.findAll('.page-link')
    const texts = pageButtons.map(b => b.text())
    expect(texts).toContain('1')
    expect(texts).toContain('2')
    expect(texts).toContain('3')
    expect(texts).toContain('…')
    expect(texts).toContain('10')
    // Page 4 should NOT appear (window is 1 2 3 … N)
    expect(texts).not.toContain('4')
  })

  it('renders trailing window 1 … N-2 N-1 [N] for page N of N', () => {
    // 10 pages, page 10 — triggers the p >= n - 2 branch
    const wrapper = createWrapper({ total: 100, page: 10, perPage: 10 })
    const pageButtons = wrapper.findAll('.page-link')
    const texts = pageButtons.map(b => b.text())
    expect(texts).toContain('1')
    expect(texts).toContain('…')
    expect(texts).toContain('8')
    expect(texts).toContain('9')
    expect(texts).toContain('10')
    // Page 2 should NOT appear (trailing window)
    expect(texts).not.toContain('2')
  })

  it('renders middle window 1 … p-1 [p] p+1 … N for a middle page', () => {
    // 20 pages, page 10 — middle case
    const wrapper = createWrapper({ total: 200, page: 10, perPage: 10 })
    const pageButtons = wrapper.findAll('.page-link')
    const texts = pageButtons.map(b => b.text())
    expect(texts).toContain('1')
    expect(texts).toContain('9')
    expect(texts).toContain('10')
    expect(texts).toContain('11')
    expect(texts).toContain('20')
    // Should have two ellipses
    const ellipses = texts.filter(t => t === '…')
    expect(ellipses).toHaveLength(2)
  })

  // ── update:page emission ────────────────────────────────────────────────────

  it('emits update:page when a page button is clicked', async () => {
    const wrapper = createWrapper({ total: 50, page: 1, perPage: 10 })
    // Click page 3 button
    const pageButtons = wrapper.findAll('button.page-link')
    const page3 = pageButtons.find(b => b.text() === '3')
    await page3?.trigger('click')
    const emitted = wrapper.emitted('update:page')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]).toEqual([3])
  })

  // ── Jump input ──────────────────────────────────────────────────────────────

  it('jump input: valid value emits update:page on Enter', async () => {
    const wrapper = createWrapper({ total: 100, page: 1, perPage: 10 })
    const input = wrapper.find('input[type="number"]')
    await input.setValue(5)
    await input.trigger('keydown.enter')
    const emitted = wrapper.emitted('update:page')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]).toEqual([5])
  })

  it('jump input: out-of-range value reverts and does not emit update:page', async () => {
    const wrapper = createWrapper({ total: 100, page: 3, perPage: 10 })
    const input = wrapper.find('input[type="number"]')
    // Set value beyond totalPages (10)
    await input.setValue(999)
    await input.trigger('keydown.enter')
    // Should not emit
    expect(wrapper.emitted('update:page')).toBeFalsy()
    // Input should revert to current page (3)
    expect((input.element as HTMLInputElement).value).toBe('3')
  })

  it('jump input: zero value reverts and does not emit update:page', async () => {
    const wrapper = createWrapper({ total: 100, page: 2, perPage: 10 })
    const input = wrapper.find('input[type="number"]')
    await input.setValue(0)
    await input.trigger('keydown.enter')
    expect(wrapper.emitted('update:page')).toBeFalsy()
    expect((input.element as HTMLInputElement).value).toBe('2')
  })

  // ── update:perPage emission ─────────────────────────────────────────────────

  it('emits update:perPage when select changes', async () => {
    const wrapper = createWrapper({ total: 100, page: 1, perPage: 20 })
    const select = wrapper.find('select.form-select')
    await select.setValue(50)
    const emitted = wrapper.emitted('update:perPage')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]).toEqual([50])
  })

  // ── Empty state ─────────────────────────────────────────────────────────────

  it('shows empty-state message when total === 0', () => {
    const wrapper = createWrapper({ total: 0, page: 1, perPage: 10 })
    // The empty-state span renders with the fst-italic class
    const emptySpan = wrapper.find('span.fst-italic')
    expect(emptySpan.exists()).toBe(true)
    expect(emptySpan.text().length).toBeGreaterThan(0)
  })

  it('disables page buttons when total === 0', () => {
    const wrapper = createWrapper({ total: 0, page: 1, perPage: 10 })
    const pageButtons = wrapper.findAll('button.page-link')
    // All number buttons should be disabled
    pageButtons.forEach(btn => {
      expect(btn.attributes('disabled')).toBeDefined()
    })
  })

  it('disables the jump input when total === 0', () => {
    const wrapper = createWrapper({ total: 0, page: 1, perPage: 10 })
    const input = wrapper.find('input[type="number"]')
    expect(input.attributes('disabled')).toBeDefined()
  })
})
