import { mount, VueWrapper } from '@vue/test-utils'
import i18n from '@/plugins/i18n'
import Edit from '@/views/settings/messages/Edit.vue'
import router from '@/router'
import { nextTick } from 'vue'
import SettingsRepository from '@/repositories/SettingsRepository'
import ToastService from '@/services/ToastService'
import TextEditor from '@/components/TextEditor.vue'

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
    const submitButton = wrapper.find('.btn.bg-gradient-primary')
    expect(wrapper.find('.modal-title').text()).toBe(i18n.global.t('common.titles.title_modal'))
    expect(wrapper.find('.modal-body').exists()).toBe(true) 
    expect(wrapper.findComponent(TextEditor).exists()).toBe(true)
    expect(wrapper.find('textarea#description-text').exists()).toBe(true)
    expect(submitButton.exists()).toBe(true)
    expect(labels.length).toBe(4)
  })

  it('should toggle the interactive message builder', async () => {
    const toggleButton = wrapper.find('.btn.btn-outline-primary')
    await toggleButton.trigger('click')
    expect(wrapper.vm.isInteractiveMessage).toBe(true)
    await toggleButton.trigger('click')
    expect(wrapper.vm.isInteractiveMessage).toBe(false)
  })

  it('should allow you to edit the message and description', async () => {
    const newMessage = 'Nuevo mensaje'
    const newDescription = 'Nueva descripción de prueba'
    wrapper.findComponent(TextEditor).vm.$emit('messageUpdated', newMessage)
    const descriptionTextarea = wrapper.find('textarea#description-text')
    await descriptionTextarea.setValue(newDescription)
    await nextTick()
    expect(wrapper.vm.text).toBe(newMessage)
    expect(wrapper.vm.$props.selectedMessage.description).toBe(newDescription)
  })

  it('should update message when the submit button is clicked', async () => {
    const newMessage = 'Nuevo mensaje de prueba'
    wrapper.findComponent(TextEditor).vm.$emit('messageUpdated', newMessage)
    const submitButton = wrapper.find('.btn.bg-gradient-primary')
    await submitButton.trigger('click')
    await nextTick()
    expect(SettingsRepository.updateMessage).toHaveBeenCalled()
  })

  it('should display success message after successfully saving changes', async () => {
    const toast = jest.spyOn(ToastService, 'toast')
    const submitButton = wrapper.find('.btn.bg-gradient-primary')
    await submitButton.trigger('click')
    await nextTick()
    expect(SettingsRepository.updateMessage).toHaveBeenCalled()
    expect(toast).toHaveBeenCalledWith('success', i18n.global.t('common.messages.updated'))
  })

  it('should display error message when saving changes fails', async () => {
    SettingsRepository.updateMessage = jest.fn().mockRejectedValue(new Error('Failed to save changes'))
    const toast = jest.spyOn(ToastService, 'toast')
    const submitButton = wrapper.find('.btn.bg-gradient-primary')
    await submitButton.trigger('click')
    await nextTick()
    expect(SettingsRepository.updateMessage).toHaveBeenCalled()
    expect(toast).toHaveBeenCalledWith('error', i18n.global.t('common.messages.error'), 'Failed to save changes')
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
