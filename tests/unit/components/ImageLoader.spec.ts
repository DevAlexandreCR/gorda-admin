import {flushPromises, shallowMount} from '@vue/test-utils'
import ImageLoader from "@/components/ImageLoader.vue"
import {Field, Form, ErrorMessage} from 'vee-validate'
import StorageService from "@/services/StorageService";
import router from "@/router";
import i18n from "@/plugins/i18n";

describe('ImageLoader', () => {
  
  it('it must emit event when click submit', async () => {
    StorageService.uploadFile = jest.fn().mockResolvedValue('urlFake.com')
    const wrapper = shallowMount(ImageLoader, {
      attachTo: '#root',
      props: {
        id: 'id',
        event: 'event',
        path: 'path',
        resourceId: 'resource-id'
      },
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
    
    await flushPromises()
    await wrapper.vm.uploadImg()
    
    expect(wrapper.emitted().event).toEqual([['urlFake.com']])
  })
})