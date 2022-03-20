import {VueWrapper, mount} from '@vue/test-utils'
import Create from "@/views/drivers/create.vue"
import {Field, Form, ErrorMessage} from 'vee-validate'
import i18n from '@/plugins/i18n'

describe('Create.vue', () => {
    let wrapper: VueWrapper<any>
    const div = document.createElement('div')
    div.id = 'root'
    document.body.appendChild(div)
    
    beforeEach(() => {
      wrapper = mount(Create, {
        attachTo: '#root',
        components: {
          Field, 
          Form,
          ErrorMessage
        },
        global: {
            plugins: [i18n]
          },
      })
    })
    it('A user can input', () => {
        const field = wrapper.findAllComponents(Field)
        const form = wrapper.findComponent(Form)
        const error = wrapper.findAllComponents(ErrorMessage)
        expect(field.length).toBe(10)
        expect(form.exists()).toBeTruthy()
        expect(error.length).toBe(11)
    })
})
    