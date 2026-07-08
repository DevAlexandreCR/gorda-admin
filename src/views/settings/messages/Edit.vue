<template>
  <!-- Modal -->
  <div :id="selectedMessage.id" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
     <div class="modal-dialog modal-xl">
       <div class="modal-content wa-msg-modal">
         <div class="modal-header wa-modal__header">
           <div class="wa-modal__header-info">
             <div class="wa-modal__icon-chip">
               <em class="fa-brands fa-whatsapp"></em>
             </div>
             <div>
               <h5 class="modal-title wa-modal__title">{{ $t('wp.modal.title') }}</h5>
               <div class="wa-modal__subtitle">
                 {{ $t('wp.modal.subtitle') }} · <span class="wa-modal__subtitle-name">{{ $props.selectedMessage.name || '—' }}</span>
               </div>
             </div>
           </div>
           <button type="button" class="wa-modal__close-btn" data-bs-dismiss="modal" aria-label="Close">
             <em class="fas fa-xmark"></em>
           </button>
         </div>
         <div class="modal-body wa-modal__body">
          <div class="wa-modal__card">
            <div class="row">
              <div class="col-md-6 wa-modal__col">
                <div class="mb-3">
                  <label for="message-name" class="col-form-label wa-modal__label">{{ $t('common.fields.name') }}</label>
                  <input ref="inputName" name="message-name" class="wa-modal__input"
                         v-model="$props.selectedMessage.name"/>
                </div>
                <TextEditor :selectedMessage="$props.selectedMessage.message" @messageUpdated="updateMessage" @contentUpdated="updateFormattedMessage" />
              </div>
              <div class="col-md-6 wa-modal__col">
                <div class="mb-3">
                  <label for="message-text" class="col-form-label wa-modal__label">{{ $t('common.fields.label_preview') }}</label>
                  <WhatsAppPhonePreview :formatted-message="formattedMessage" />
                </div>
                <div class="mb-0" v-if="$props.selectedMessage">
                  <label for="description-text" class="col-form-label wa-modal__label">{{ $t('common.fields.label_description') }}</label>
                  <textarea class="text-area-Description wa-modal__input wa-modal__textarea" id="description-text" aria-label="Description"
                            aria-describedby="description-addon" v-model="$props.selectedMessage.description" rows="5" @input="updateTextareaDescription" />
                </div>
              </div>
            </div>
          </div>

          <button type="button" class="wa-modal__toggle" :class="{ 'wa-modal__toggle--on': isInteractiveMessage }" @click="toggleInteractiveMessage">
            <span class="wa-modal__toggle-icon">
              <em class="fas fa-bolt"></em>
            </span>
            <span class="wa-modal__toggle-text">
              <span class="wa-modal__toggle-title">
                {{ isInteractiveMessage ? $t('wp.modal.interactive_enabled_title') : $t('wp.modal.interactive_disabled_title') }}
              </span>
              <span class="wa-modal__toggle-hint">
                {{ isInteractiveMessage ? $t('wp.modal.interactive_enabled_hint') : $t('wp.modal.interactive_disabled_hint') }}
              </span>
            </span>
            <span class="wa-modal__switch">
              <span class="wa-modal__switch-knob"></span>
            </span>
          </button>

          <InteractiveMessageBuilder @interactive-updated="updateInteractiveMessage" :selectedInteractive="$props.selectedMessage.interactive" v-if="isInteractiveMessage"/>
         </div>
         <div class="modal-footer wa-modal__footer">
           <div class="wa-modal__footer-hint">
             <em class="fas fa-circle-info"></em>
             {{ $t('wp.modal.footer_hint') }}
           </div>
           <div class="wa-modal__footer-actions">
             <button type="button" class="wa-modal__btn-close-text" data-bs-dismiss="modal">
               {{ $t('common.actions.close') }}
             </button>
             <button type="button" class="wa-modal__btn-submit" @click="saveChanges" :disabled="submitting">
               <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
               <em v-else class="fas fa-paper-plane me-2"></em>
               {{ $t('wp.modal.save') }}
             </button>
           </div>
         </div>
       </div>
     </div>
   </div>
 </template>

<script setup lang="ts">
import {ref, defineProps, defineEmits, Ref, onMounted, watch} from 'vue'
import SettingsRepository from '@/repositories/SettingsRepository'
import ToastService from '@/services/ToastService'
import { SettingsMessageInterface } from '@/types/SettingsMessagesInterface'
import { hide } from '@/helpers/ModalHelper'
import i18n from '@/plugins/i18n'
import InteractiveMessageBuilder from '@/components/InteractiveMessageBuilder.vue'
import TextEditor from '@/components/TextEditor.vue'
import WhatsAppPhonePreview from '@/components/WhatsAppPhonePreview.vue'
import { Interactive } from '@/types/Interactive'

const props = defineProps<{ selectedMessage: SettingsMessageInterface}>()
const textArea = ref<HTMLTextAreaElement | null>(null)
const text = ref<string>('')
const formattedMessage = ref<string>('')
const emit = defineEmits(['updateMessages'])
const isInteractiveMessage = ref<boolean>(false)
const interactiveMessage = ref<Interactive|null>(null)
const submitting = ref(false)

function updateFormattedMessage(text: string): void{
  formattedMessage.value = text
}

function updateMessage(content: string): void {
  text.value = content
}

function updateInteractiveMessage(message: Interactive|null): void {
  interactiveMessage.value = message
}

function updateTextareaDescription() {
  const textarea = textArea.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }
}

function toggleInteractiveMessage(): void {
  isInteractiveMessage.value = !isInteractiveMessage.value
  if (!isInteractiveMessage.value) {
    interactiveMessage.value = null
  } else {
    interactiveMessage.value = {
      type: 'button',
      body: { text: text.value },
      action: {
        buttons: [],
      },
    }
  }
}

function saveChanges(): void {
  if (!props.selectedMessage.message && text.value == '') return
  submitting.value = true
  const updatedMessage = {
    id: props.selectedMessage.id,
    name: props.selectedMessage.name,
    description: props.selectedMessage.description,
    message: text.value,
    enabled: props.selectedMessage.enabled,
    interactive: interactiveMessage.value,
  }

  SettingsRepository.updateMessage(updatedMessage).then(async () => {
    emit('updateMessages')
    submitting.value = false
    hide(updatedMessage.id)
    await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
  }).catch(async e => {
    submitting.value = false
    await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

onMounted(() => {
  isInteractiveMessage.value = props.selectedMessage.interactive != undefined
  text.value = props.selectedMessage.message
})
</script>
<style scoped lang="scss">
.wa-msg-modal {
  --wamodal-card-bg: var(--surface-card);
  --wamodal-card-shadow: var(--shadow-card);
  --wamodal-input-bg: var(--surface-input);
  --wamodal-input-border: var(--border-color);
  --wamodal-border-subtle: var(--border-subtle);
  --wamodal-heading: var(--text-heading);
  --wamodal-body: var(--text-body);
  --wamodal-muted: var(--text-muted);
  --wamodal-success-bg: var(--badge-success-bg);
  --wamodal-success-fg: var(--badge-success-fg);
  --wamodal-success-border: var(--success);
  --wamodal-shadow-btn: var(--shadow-btn);
  background-color: var(--body-bg);
}

body.dark-version .wa-msg-modal {
  --wamodal-card-bg: var(--surface-card);
  --wamodal-card-shadow: var(--shadow-card);
  --wamodal-input-bg: var(--surface-input);
  --wamodal-input-border: var(--border-color);
  --wamodal-border-subtle: var(--border-subtle);
  --wamodal-heading: var(--text-heading);
  --wamodal-body: var(--text-body);
  --wamodal-muted: var(--text-muted);
  --wamodal-success-bg: var(--badge-success-bg);
  --wamodal-success-fg: var(--badge-success-fg);
  --wamodal-success-border: var(--success);
  --wamodal-shadow-btn: var(--shadow-btn);
  background-color: var(--body-bg);
}

.wa-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-bottom: 1px solid var(--wamodal-border-subtle);
}

.wa-modal__header-info {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
}

.wa-modal__icon-chip {
  width: 38px;
  height: 38px;
  border-radius: 0.65rem;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(310deg, #128c7e, #25d366);
  box-shadow: 0 4px 14px rgba(37, 211, 102, 0.3);
}

.wa-modal__icon-chip em {
  color: #ffffff;
  font-size: 1.1rem;
}

.wa-modal__title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--wamodal-heading);
  line-height: 1.2;
  margin: 0;
}

.wa-modal__subtitle {
  font-size: 0.72rem;
  color: var(--wamodal-muted);
  margin-top: 0.1rem;
}

.wa-modal__subtitle-name {
  color: var(--wamodal-body);
  font-weight: 600;
}

.wa-modal__close-btn {
  width: 30px;
  height: 30px;
  border-radius: 0.4rem;
  border: none;
  background-color: var(--wamodal-input-bg);
  color: var(--wamodal-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  flex: none;
}

.wa-modal__body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wa-modal__card {
  background-color: var(--wamodal-card-bg);
  border-radius: 0.875rem;
  box-shadow: var(--wamodal-card-shadow);
  padding: 1.25rem;
}

.wa-modal__col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wa-modal__col + .wa-modal__col {
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .wa-modal__col + .wa-modal__col {
    margin-top: 0;
  }
}

.wa-modal__label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--wamodal-heading);
  margin-bottom: 0.4rem;
}

.wa-modal__input {
  display: block;
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: 1.5px solid var(--wamodal-input-border);
  border-radius: 0.5rem;
  background-color: var(--wamodal-input-bg);
  color: var(--wamodal-heading);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s ease;
}

.wa-modal__input:focus {
  border-color: var(--primary);
}

.wa-modal__textarea {
  resize: vertical;
  line-height: 1.6;
}

.wa-modal__toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.1rem;
  width: 100%;
  text-align: left;
  background-color: var(--wamodal-card-bg);
  border: 1.5px solid var(--wamodal-border-subtle);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.wa-modal__toggle--on {
  background-color: var(--wamodal-success-bg);
  border-color: var(--wamodal-success-border);
}

.wa-modal__toggle-icon {
  width: 34px;
  height: 34px;
  border-radius: 0.5rem;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--wamodal-input-bg);
  color: var(--wamodal-muted);
  font-size: 0.85rem;
  transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.wa-modal__toggle--on .wa-modal__toggle-icon {
  background: linear-gradient(310deg, #17ad37, #98ec2d);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(130, 214, 22, 0.3);
}

.wa-modal__toggle-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.wa-modal__toggle-title {
  font-size: 0.83rem;
  font-weight: 700;
  color: var(--wamodal-heading);
}

.wa-modal__toggle--on .wa-modal__toggle-title {
  color: var(--wamodal-success-fg);
}

.wa-modal__toggle-hint {
  font-size: 0.72rem;
  color: var(--wamodal-muted);
  margin-top: 0.1rem;
}

.wa-modal__switch {
  width: 40px;
  height: 22px;
  border-radius: 50rem;
  flex: none;
  position: relative;
  background-color: var(--wamodal-input-border);
  transition: background-color 0.2s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.12);
}

.wa-modal__toggle--on .wa-modal__switch {
  background-color: var(--wamodal-success-border);
}

.wa-modal__switch-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #ffffff;
  transition: left 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.wa-modal__toggle--on .wa-modal__switch-knob {
  left: 20px;
}

.wa-modal__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--wamodal-card-bg);
  border-top: 1px solid var(--wamodal-border-subtle);
}

.wa-modal__footer-hint {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  color: var(--wamodal-muted);
}

.wa-modal__footer-actions {
  display: flex;
  gap: 0.6rem;
}

.wa-modal__btn-close-text,
.wa-modal__btn-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1.5;
  text-transform: none;
  cursor: pointer;
}

.wa-modal__btn-close-text {
  padding: 0.45rem 1.1rem;
  border-radius: 0.5rem;
  border: 1.5px solid var(--wamodal-input-border);
  background-color: var(--wamodal-input-bg);
  color: var(--wamodal-body);
  font-size: 0.8rem;
  font-weight: 600;
}

.wa-modal__btn-submit {
  padding: 0.45rem 1.25rem;
  border-radius: 0.5rem;
  border: none;
  background-color: var(--primary);
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: var(--wamodal-shadow-btn);
}

.wa-modal__btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>
