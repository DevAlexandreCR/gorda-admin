import { mount, VueWrapper } from '@vue/test-utils'
import i18n from '@/plugins/i18n'
import Edit from '@/views/settings/messages/Edit.vue'
import router from '@/router'
import { nextTick } from 'vue'
import SettingsRepository from '@/repositories/SettingsRepository'
import Swal from 'sweetalert2'

describe('Edit.vue', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    SettingsRepository.updateMessage = jest.fn().mockResolvedValue('updateMessages')
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
    expect(labels.length).toBe(4)
  })

  it('should open and close emoji picker when emoji button is clicked', async () => {
    const emojiButton = wrapper.find('.emoji-button')
    await emojiButton.trigger('click')
    expect(wrapper.vm.isEmojiPickerOpen).toBe(true)
    await emojiButton.trigger('click')
    expect(wrapper.vm.isEmojiPickerOpen).toBe(false)
  });

  it('should allow you to edit the message and description', async () => {
    const newMessage = 'Test Message Content'
    const newDescription = 'Nueva descripción de prueba'
    const messageTextarea = wrapper.find('textarea#editorText')
    await messageTextarea.setValue(newMessage)
    const descriptionTextarea = wrapper.find('textarea#description-text')
    await descriptionTextarea.setValue(newDescription)
    await nextTick()
    expect(wrapper.vm.$props.selectedMessage.message).toBe(newMessage)
    expect(wrapper.vm.$props.selectedMessage.description).toBe(newDescription)
  })

  it('should update message when the submit button is clicked', async () => {
    const newMessage = 'Nuevo mensaje de prueba'
    const messageTextarea = wrapper.find('textarea#editorText')
    await messageTextarea.setValue(newMessage)
    const submitButton = wrapper.find('button[type="submit"]')
    await submitButton.trigger('click')
    await nextTick()
    expect(SettingsRepository.updateMessage).toHaveBeenCalled()
  })

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

  it('should apply bold style to selected text when bold button is clicked', async () => {
    const boldButton = wrapper.find('.bold-button')
    const messageTextarea = wrapper.find('textarea#editorText')
    await messageTextarea.setValue('This is a test message.')
    await nextTick()
    const textarea = messageTextarea.element as HTMLTextAreaElement
    const startPos = 5
    const endPos = 7
    textarea.setSelectionRange(startPos, endPos)
    await boldButton.trigger('click')
    await nextTick()
    expect(textarea.value).toBe('This *is* a test message.')
  })

  it('should apply italic style to selected text when italic button is clicked', async () => {
    const italicButton = wrapper.find('.italic-button')
    const messageTextarea = wrapper.find('textarea#editorText')
    await messageTextarea.setValue('This is a test message.')
    await nextTick()
    const textarea = messageTextarea.element as HTMLTextAreaElement
    const startPos = 5
    const endPos = 7
    textarea.setSelectionRange(startPos, endPos)
    await italicButton.trigger('click')
    await nextTick()
    expect(textarea.value).toBe('This _is_ a test message.')
  })

  it('should insert placeholder text at cursor position when a placeholder is clicked', async () => {
    const placeholderButton = wrapper.find('.tooltip-element')
    const messageTextarea = wrapper.find('textarea#editorText')
    await messageTextarea.setValue('This is a test message.')
    await nextTick()
    const textarea = messageTextarea.element as HTMLTextAreaElement
    const startPos = 5
    const endPos = 5
    textarea.setSelectionRange(startPos, endPos)
    await placeholderButton.trigger('click')
    await nextTick()
    expect(textarea.value).toBe('This [[PLATE]]is a test message.')
  })

})
