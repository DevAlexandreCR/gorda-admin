import { mount, VueWrapper } from '@vue/test-utils'
import DBPaginator from '@/components/DBPaginator.vue'
import { Pagination } from '@/types/Pagination'

describe('DBPaginator.vue', () => {
  let wrapper: VueWrapper<any>

  const createWrapper = (pagination: Pagination) => {
    wrapper = mount(DBPaginator, {
      props: {
        pagination,
      },
    })
  }

  beforeEach(() => {
    const pagination: Pagination = {
      totalCount: 50,
      perPage: 10,
      currentPage: 1,
      cursor: {
        id: '',
        created: 0,
      },
    }
    createWrapper(pagination)
  })

  it('renders the correct number of pagination links', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.pagination').exists()).toBe(true)
    expect(wrapper.find('.page-link').exists()).toBe(true)
  })
  const clickNextPage = async () => {
    const nextPageButton = wrapper.find('.fa-angle-right')
    await nextPageButton.trigger('click')
  }

  it('emits paginatedData event when clicking next', async () => {
    createWrapper({
      totalCount: 100,
      perPage: 10,
      currentPage: 2,
      cursor: {
        id: '',
        created: 0,
      },
    })
    await clickNextPage()
    expect(wrapper.find('.page-item.active').text()).toBe('3 (current)')
  })

  const clickPreviousPage = async () => {
    const previousPageButton = wrapper.find('.fa-angle-left')
    await previousPageButton.trigger('click')
  }

  it('emits paginatedData event when clicking back', async () => {
    createWrapper({
      totalCount: 100,
      perPage: 10,
      currentPage: 5,
      cursor: {
        id: '',
        created: 0,
      },
    })
    await clickPreviousPage()
    expect(wrapper.find('.page-item.active').text()).toBe('4 (current)')
  })
})
