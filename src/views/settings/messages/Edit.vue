<template>
  <!-- Modal -->
  <div :id="selectedMessage.id" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
     <div class="modal-dialog modal-lg">
       <div class="modal-content">
         <div class="modal-header">
           <h5 class="modal-title">{{ $t('common.titles.title_modal') }}</h5>
           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
         <div class="modal-body">
          <div class="row">
            <div class="col-md-6">
             <label for="message-name" class="col-form-label">{{ $t('common.fields.name') }}</label>
             <input ref="inputName" name="message-name" class="form-control"
                    v-model="$props.selectedMessage.name"/>
            <TextEditor :selectedMessage="$props.selectedMessage.message" @messageUpdated="updateMessage" @contentUpdated="updateFormattedMessage" />
           </div>
           <div class="col-md-6">
             <label for="message-text" class="col-form-label">{{ $t('common.fields.label_preview') }}</label>
             <div class="whatsapp-container">
              <div class="whatsapp-message">
                <div class="preview-container" v-html="formattedMessage" disabled></div>
              </div>
            </div>
             <div class="mb-3" v-if="$props.selectedMessage">
               <label for="description-text" class="col-form-label">{{ $t('common.fields.label_description') }}</label>
               <textarea  class="form-control text-area-Description" id="description-text" aria-label="Description"
                         aria-describedby="description-addon" v-model="$props.selectedMessage.description" rows="5" @input="updateTextareaDescription" />
             </div>
           </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-md-12">
              <button type="button" class="btn btn-outline-primary" @click="toggleInteractiveMessage">
                {{ isInteractiveMessage ? $t('common.actions.disable_interactive') : $t('common.actions.enable_interactive') }}
              </button>
            </div>
            <InteractiveMessageBuilder @interactive-updated="updateInteractiveMessage" :selectedInteractive="$props.selectedMessage.interactive" v-if="isInteractiveMessage"/>
          </div>

         </div>
         <div class="modal-footer">
           <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">
             {{ $t('common.actions.close') }}
           </button>
           <button type="submit" class="btn bg-gradient-primary" @click="saveChanges">{{ $t('common.actions.submit') }}</button>
         </div>
       </div>
     </div>
   </div>
 </template>

<script setup lang="ts">
import {ref, defineProps, defineEmits, Ref, onMounted} from 'vue'
import SettingsRepository from '@/repositories/SettingsRepository'
import ToastService from '@/services/ToastService'
import { useLoadingState } from '@/services/stores/LoadingState'
import { SettingsMessageInterface } from '@/types/SettingsMessagesInterface'
import { hide } from '@/helpers/ModalHelper'
import i18n from '@/plugins/i18n'
import InteractiveMessageBuilder from '@/components/InteractiveMessageBuilder.vue'
import TextEditor from '@/components/TextEditor.vue'
import { Interactive } from '@/types/Interactive'

const { setLoading } = useLoadingState()
const textArea = ref<HTMLTextAreaElement | null>(null)
const text = ref<string>('')
const formattedMessage = ref<string>('')
const emit = defineEmits(['updateMessages'])
const props = defineProps<{ selectedMessage: SettingsMessageInterface}>()
const isInteractiveMessage = ref<boolean>(false)
const interactiveMessage = ref<Interactive|undefined>(undefined)

function updateFormattedMessage(text: string): void{
  formattedMessage.value = text
}

function updateMessage(content: string): void{
  text.value = content
}

function updateInteractiveMessage(message: Interactive|undefined): void {
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
  if (isInteractiveMessage.value) {
    props.selectedMessage.interactive = interactiveMessage.value
  } else {
    props.selectedMessage.interactive = undefined
    interactiveMessage.value = undefined
  }
}

function saveChanges(): void {
  if (props.selectedMessage && text.value) {
    setLoading(true)
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
      setLoading(false)
      hide(updatedMessage.id)
      await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
    }).catch(async e => {
      setLoading(false)
      await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
    })
  }
}

onMounted(() => {
  isInteractiveMessage.value = props.selectedMessage.interactive != undefined
})
</script>
