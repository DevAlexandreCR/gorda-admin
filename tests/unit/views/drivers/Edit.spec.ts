import {VueWrapper, mount} from '@vue/test-utils'
import Edit from "@/views/drivers/Edit.vue"
import {Field, Form, ErrorMessage} from 'vee-validate'
import i18n from '@/plugins/i18n'
import ImageLoader from '@/components/ImageLoader.vue'
import router from '@/router'


describe('Edit.vue', () => {
    let wrapper: VueWrapper<any>
    
    beforeEach(() => {
      wrapper = mount(Edit, {
        attachTo: '#root',
        components: {
          Field, 
          Form,
          ErrorMessage,
          ImageLoader
        },
        global: {
            plugins: [router, i18n]
          },
      })
    })
    it('A user can input', () => {
        const field = wrapper.findAllComponents(Field)
        const form = wrapper.findComponent(Form)
        const error = wrapper.findAllComponents(ErrorMessage)
        const imageLoader = wrapper.findAllComponents(ImageLoader)
        expect(field.length).toBe(10)
        expect(form.exists()).toBeTruthy()
        expect(error.length).toBe(11)
        expect(imageLoader.length).toBe(2)
    })
})