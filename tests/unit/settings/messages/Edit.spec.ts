import { mount, VueWrapper } from '@vue/test-utils'
import i18n from '@/plugins/i18n'
import Edit from '@/views/settings/messages/Edit.vue'
import router from '@/router'
import { nextTick } from 'vue'
import SettingsRepository from '@/repositories/SettingsRepository'
import Swal from 'sweetalert2'

describe('Edit.vue', () => {
  let wrapper: VueWrapper<any>;
  SettingsRepository.updateMessage = jest.fn().mockResolvedValue('updateMessages')
  beforeEach(async () => {
    wrapper = mount(Edit, {
      attachTo: '#root',
      global: {
        plugins: [router, i18n],
      },
      props: {
        selectedMessage: {
          id: 'Welcome',
          name: 'Test Message',
          description: 'Test Description',
          message: 'Test Message Content',
          enabled: true
        }
      }
    })
    await nextTick()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render the modal title and form elements', () => {
    const labels = wrapper.findAll('.col-form-label')
    const submitButton = wrapper.find('.btn')
    expect(wrapper.find('.modal-title').text()).toBe('Edit WhatsApp Messages')
    expect(wrapper.find('.modal-body').exists()).toBe(true) 
    expect(wrapper.find('textarea#editorText').exists()).toBe(true)
    expect(wrapper.find('textarea#description-text').exists()).toBe(true)
    expect(submitButton.exists()).toBe(true)
    expect(labels.length).toBe(3)
  })

  it('should render correctly with null selectedMessage', async () => {
    wrapper.setProps({ selectedMessage: null });
    await nextTick();
  });

  it('should open and close emoji picker when emoji button is clicked', async () => {
    const emojiButton = wrapper.find('.emoji-button');
    await emojiButton.trigger('click');
    expect(wrapper.vm.isEmojiPickerOpen).toBe(true);
  });

  it('debería permitir editar el mensaje y la descripción', async () => {
    const newMessage = 'Nuevo mensaje de prueba'
    const newDescription = 'Nueva descripción de prueba'
    wrapper.vm.$props.selectedMessage.message = newMessage
    wrapper.vm.$props.selectedMessage.description = newDescription
    expect(wrapper.vm.$props.selectedMessage.message).toBe(newMessage)
    expect(wrapper.vm.$props.selectedMessage.description).toBe(newDescription)
  })
  
  

  it('should save changes when the submit button is clicked', async () => {
    const newMessage = 'Nuevo mensaje de prueba';
    const newDescription = 'Nueva descripción de prueba';
    const messageTextarea = wrapper.find('textarea#editorText');
    const descriptionTextarea = wrapper.find('textarea#description-text');
    await messageTextarea.setValue(newMessage);
    await descriptionTextarea.setValue(newDescription);

    const submitButton = wrapper.find('button[type="submit"]');
    await submitButton.trigger('click');
    await nextTick();
    expect(SettingsRepository.updateMessage).toHaveBeenCalled();
  });
  
  it('should display success message after successfully saving changes', async () => {
    const swal = jest.spyOn(Swal, 'fire')

    const submitButton = wrapper.find('button[type="submit"]')
    await submitButton.trigger('click')
    await nextTick()

    expect(SettingsRepository.updateMessage).toHaveBeenCalled()
    expect(swal).toHaveBeenCalledWith({
      icon: 'success',
      position: 'top-right',
      title: 'Resource updated successfully',
      showConfirmButton: false,
      timer: 3000,
      toast: true,
    })
  })

  it('should display error message when saving changes fails', async () => {
    SettingsRepository.updateMessage = jest.fn().mockRejectedValue(new Error('Failed to save changes'))
    const swal = jest.spyOn(Swal, 'fire')

    const submitButton = wrapper.find('button[type="submit"]')
    await submitButton.trigger('click')
    await nextTick()

    expect(SettingsRepository.updateMessage).toHaveBeenCalled()
    expect(swal).toHaveBeenCalledWith({
      icon: 'error',
      position: 'top-right',
      title: 'Something went wrong!',
      text: 'Failed to save changes',
      showConfirmButton: false,
      timer: 3000,
      toast: true,
    })    
  })
}) 
