import {VueWrapper, mount} from '@vue/test-utils'
import AutoComplete from "@/components/AutoComplete.vue"
import {Field} from 'vee-validate'
import locations from '@/assets/location/neighborhoods.json'

describe('AutoComplete.vue', () => {
  const neighborhoods: Array<any> = []
  let wrapper: VueWrapper<any>
  const div = document.createElement('div')
  div.id = 'root'
  document.body.appendChild(div)
  locations.forEach(loc => {
    neighborhoods.push(loc.name)
  })
  
  beforeEach(() => {
    wrapper = mount(AutoComplete, {
      attachTo: '#root',
      components: {
        Field
      },
      props: {
        elements: neighborhoods,
        placeholder: 'placeholder autocomplete',
        fieldName: 'fieldName'
      }
    })
  })
  
  it('an user can show input and can not show list', () => {
    const input = wrapper.findComponent(Field)
    const list = wrapper.find('ul')
    expect(input.exists()).toBeTruthy()
    expect(input.html()).toContain('placeholder autocomplete')
    expect(input.html()).toContain('fieldName')
    expect(list.exists()).toBeFalsy()
  })
  
  it('an user can show the list when write more than twice', async () => {
    await wrapper.vm.$nextTick()
    const input = wrapper.findComponent(Field)
    input.setValue('san')
    await input.trigger('keyup', {
      keyCode: 72
    })
    const list = wrapper.find('ul')
    expect(list.exists()).toBeTruthy()
    expect(wrapper.vm.foundElements.length).toBe(5)
  })
  
  it('emit on-change when write input', async () => {
    await wrapper.vm.$nextTick()
    const input = wrapper.findComponent(Field)
    await input.setValue('san')
    await input.trigger('input')
  
    expect(wrapper.emitted()).toHaveProperty('on-change')
  })
  
  it('an user can select a item from list and set the selectedElement', async () => {
    await wrapper.vm.$nextTick()
    const input = wrapper.findComponent(Field)
    await input.setValue('san')
    await input.trigger('keyup', {
      keyCode: 72
    })
    const items = wrapper.findAll('li')
    expect(items.length).toBe(5)
    
    await items.at(0)?.trigger('click')
    expect(wrapper.vm.selectedElement.toLowerCase()).toContain('san')
    expect(wrapper.vm.foundElements.length).toBe(0)
  })

  it('the user after seeing the list deletes what it contains inside it will return 0', async () => {
    await wrapper.vm.$nextTick()
    const input = wrapper.findComponent(Field)
    input.setValue('sa')
    await input.trigger('keyup', {
      keyCode: 72
    })
    expect(wrapper.vm.foundElements).toStrictEqual([])
  })

})