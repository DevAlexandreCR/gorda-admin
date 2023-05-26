import { mount, VueWrapper } from '@vue/test-utils'
import History from '@/components/services/History.vue'
import router from '@/router'
import i18n from '@/plugins/i18n'
import {Field, Form} from 'vee-validate'
import {Tables} from '@/constants/Tables'
import ServiceRepository from '@/repositories/ServiceRepository'
import { useServicesStore } from '@/services/stores/ServiceStore'
import ServicesTable from '@/components/services/ServicesTable.vue'


describe('History.vue', () => {
    let wrapper: VueWrapper<any>
    const options = {
        attachTo: '#root',
        props: {
          table: Tables.history
        },
        global: {
          plugins: [router, i18n],
          provide: {
            'appName': 'test'
          }
        },
      }
    beforeEach(async () => {
        jest.useFakeTimers()
        ServiceRepository.getAll = jest.fn().mockResolvedValue(options.props.table)
        const serviceStore = useServicesStore()
        await serviceStore.getHistoryServices()
        wrapper = mount(History, options)
        await router.isReady()
    })

    it('A user can see inputs to History services', async () => {
        const field = wrapper.findAllComponents(Field)
        const form = wrapper.findComponent(Form)
        const label = wrapper.findAll('.form-control-label')
        expect(field.length).toBe(4)
        expect(form.exists()).toBeTruthy()
        expect(label.length).toBe(5)
    })

})