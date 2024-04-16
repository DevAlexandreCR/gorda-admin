<template>
  <!-- Modal -->
  <div id="editMessagesWp" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
     <div class="modal-dialog modal-lg">
       <div class="modal-content">
         <div class="modal-header">
           <h5 class="modal-title">{{ $t('common.titles.titleModal') }}</h5>
           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
         <div class="modal-body row align-items-center">
           <div class="col-md-6">
             <div class="modal-body">
               <div class="mb-3"  v-if="$props.selectedMessage">
                 <label for="message-text" class="col-form-label">{{ $t('common.fields.labelMenssage') }}</label>
                 <textarea ref="textArea" id="editorText" class="form-control" contenteditable="true" @input="updatePreview"
                  v-model="$props.selectedMessage.message"/>
                   <div class="d-flex mt-1">
                     <button class="bold-button btn btn-sm btn-info btn-squared px-4 py-2 active" 
                             @click="letterBold">
                       <b>B</b>
                     </button>
                     <button class="italic-button btn btn-sm btn-info btn-squared px-4 py-2 active ms-1" 
                             @click="letterItalic">
                       <i>c</i>
                     </button>
                     <button class="emoji-button btn btn-sm btn-info btn-squared px-4 py-2 ms-1" @click="toggleEmojiPicker">
                      😀
                     </button>
                   </div>
                   <div v-show="isEmojiPickerOpen" class="emoji-picker">
                     <v-emoji-picker   @emoji-clicked="insertEmoji" />
                   </div>
                   <div class="d-flex align-items-center flex-wrap">
                     <div v-for="(placeholder, index) in placeholders" :key="index">
                       <span class="tooltip-element badge bg-secondary ms-1" data-bs-toggle="tooltip" :title="$t(placeholder.description)" @click="insertPlaceholder(placeholder.value)">
                         {{ placeholder.label }}
                       </span>
                     </div>
                   </div>
               </div>
             </div>
           </div>
           <div class="col-md-6">
             <label for="message-text" class="col-form-label">{{ $t('common.fields.labelPreview') }}</label>
             <div  class="preview-container form-control" v-html="formattedMessage" disabled></div>
             <div class="mb-3" v-if="$props.selectedMessage">
               <label for="description-text" class="col-form-label">{{ $t('common.fields.labelDescription') }}</label>
               <textarea  class="form-control" id="description-text" aria-label="Description"
                         aria-describedby="description-addon" v-model="$props.selectedMessage.description" />
             </div>
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
import { ref, computed, defineProps, defineEmits } from 'vue'
import SettingsRepository from '@/repositories/SettingsRepository'
import ToastService from '@/services/ToastService'
import { useI18n } from "vue-i18n"
import { useLoadingState } from '@/services/stores/LoadingState'
import { SettingsMessageInterface } from '@/types/SettingsMessages'
import { hide } from '@/helpers/ModalHelper'
import i18n from '@/plugins/i18n'
import {VEmojiPicker} from '@imndx/v-emoji-picker-vue3'

const { t } = useI18n()
const { setLoading } = useLoadingState()
const textArea = ref<HTMLTextAreaElement | null>(null)
const isEmojiPickerOpen = ref(false)
const emit = defineEmits(['updateMessages'])
const props = defineProps<{
  selectedMessage: SettingsMessageInterface | null
}>()
const placeholders = [
  { description: `${t('common.placeholders.description.plate')}`, label: `${t('common.placeholders.label.plate')}`, value: '[[plate]]' },
  { description: `${t('common.placeholders.description.vehicleColor')}`, label: `${t('common.placeholders.label.color')}`, value: '[[Vehicle.color.name]]' },
  { description: `${t('common.placeholders.description.username')}`, label: `${t('common.placeholders.label.name')}`, value: '[[name]]' },
  { description: `${t('common.placeholders.description.compayNumber')}`, label: `${t('common.placeholders.label.numberPQR')}`, value: '[[PQR_NUMBER]]' },
  { description: `${t('common.placeholders.description.placeName')}`, label: `${t('common.placeholders.label.placeName')}`, value: '[[placeName]]' },

]

const updatePreview = () => {
  if (props.selectedMessage) {
    let content = props.selectedMessage.message
    content = content.replace(/<u>(.*?)<\/u>/g, '_$1_')
    content = content.replace(/<b>(.*?)<\/b>/g, '*$1*')
    content = content.replace(/<i>(.*?)<\/i>/g, '_$1_')
    return  content
  } else {
    return ''
  }
}

function insertPlaceholder(placeholder: string): void {
  if (placeholder && textArea.value) {
    const startPos = textArea.value.selectionStart ?? 0
    const endPos = textArea.value.selectionEnd ?? 0
    const scrollTop = textArea.value.scrollTop
    const value = textArea.value.value
    textArea.value.value = value.substring(0, startPos) + placeholder + value.substring(endPos, value.length)
    textArea.value.focus()
    textArea.value.setSelectionRange(startPos + placeholder.length, startPos + placeholder.length)
    textArea.value.scrollTop = scrollTop
    updatePreview()
  }
}

function applyStyleToSelection(style: string, text?: string): void {
  if (!textArea.value) return
  updatePreview()
  const startPos = textArea.value.selectionStart ?? 0
  const endPos = textArea.value.selectionEnd ?? 0
  const selectedText = text || (textArea.value.value.substring(startPos, endPos))
  const styledText = style === 'b' ? `*${selectedText}*` : `_${selectedText}_`
  const value = textArea.value.value
  textArea.value.value = value.substring(0, startPos) + styledText + value.substring(endPos, value.length)
  textArea.value.focus()
  setTimeout(updatePreview, 0)
  const newEndPos = startPos + styledText.length - (style === 'b' ? 1 : 2)
  textArea.value.setSelectionRange(newEndPos, newEndPos)
  updatePreview()
}


function applyStyle(style: string): void {
  if (style === 'b' || style === 'i') {
    applyStyleToSelection(style)
  }
}

function insertTextAtCursor(text: string): void {
  applyStyleToSelection('', text)
}

function letterBold(): void {
  applyStyle('b')
}

function letterItalic(): void {
  applyStyle('i')
}

function insertEmoji(emoji: string | undefined): void {
  if (emoji) {
    insertTextAtCursor(emoji)
    toggleEmojiPicker()
  }
}

function toggleEmojiPicker(): void {
  isEmojiPickerOpen.value = !isEmojiPickerOpen.value;
}

function saveChanges(): void {
  if (props.selectedMessage && textArea.value) {
    setLoading(true)
    const updatedMessage = {
      id: props.selectedMessage.id,
      name: props.selectedMessage.name,
      description: props.selectedMessage.description,
      message: textArea.value.value,
      enabled: props.selectedMessage.enabled 
    }
    SettingsRepository.updateMessage(updatedMessage).then(async () => {
      emit('updateMessages')
      setLoading(false)
      hide('editMessagesWp')
      await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
    }).catch(async e => {
      setLoading(false)
      await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
    })
  }
}

const formattedMessage = computed(() => {
  if (props.selectedMessage) {
    let content = props.selectedMessage.message
    content = content.replace(/\*([^*]+)\*/g, '<b>$1</b>')
    content = content.replace(/_([^_]+)_/g, '<i>$1</i>')
    return content
  } else {
    return ''
  }
})
</script>
