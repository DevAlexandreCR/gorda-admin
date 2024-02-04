import {mount, VueWrapper} from '@vue/test-utils'
import DBPaginator from '@/components/DBPaginator.vue'
import {Pagination} from '@/types/Pagination'
import i18n from '@/plugins/i18n'
import {useServicesStore} from '@/services/stores/ServiceStore'
import {nextTick} from 'vue'

describe('DBPaginator.vue', () => {
  let wrapper: VueWrapper<any>
  const createWrapper = (pagination: Pagination) => {
    wrapper = mount(DBPaginator, {
      global: {
        plugins: [i18n],
        provide: {
          'appName': 'test',
        },
      },
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

  it('emits paginatedData event when clicking next', async () => {
    const {pagination} = useServicesStore()
    pagination.currentPage = 2
    createWrapper({
      totalCount: 100,
      perPage: 10,
      currentPage: 2,
      cursor: {
        id: '',
        created: 0,
      },
    })
    await nextTick()
    const nextPageButton = wrapper.find('.fa-angle-right')
    await nextPageButton.trigger('click')
    await nextTick()
    expect(wrapper.find('.page-item.active').text()).toBe('3 (current)')
  })


  it('emits paginatedData event when clicking back', async () => {
    const {pagination} = useServicesStore()
    pagination.currentPage = 5
    createWrapper({
      totalCount: 100,
      perPage: 10,
      currentPage: 5,
      cursor: {
        id: '',
        created: 0,
      },
    })
    await nextTick()
    const previousPageButton = wrapper.find('.fa-angle-left')
    await previousPageButton.trigger('click')
    expect(wrapper.find('.page-item.active').text()).toBe('4 (current)')
  })
})
