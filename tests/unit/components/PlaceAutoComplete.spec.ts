import {VueWrapper, mount} from '@vue/test-utils'
import PlaceAutocomplete from '@/components/maps/PlaceAutocomplete.vue'

describe('PlaceAutocomplete.vue', () => {
  let wrapper: VueWrapper<any>
  const search = 'sear'

  beforeEach(() => {
    wrapper = mount(PlaceAutocomplete, {
      attachTo: '#root',
      props: {
        placeholder: 'placeholder autocomplete',
        fieldName: 'fieldName',
        idField: 'field',
        search: search
      }
    })
  })

  it('emit on-change when write input', async () => {
    await wrapper.vm.$nextTick()
		const input = wrapper.find('input[name="fieldName"]')
		await input.setValue('san')
    await input.trigger('input')
  
    expect(wrapper.emitted()).toHaveProperty('on-change')
  })
})