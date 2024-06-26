<template>
  <!-- Modal -->
  <div :id="selectedMessage.id" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
     <div class="modal-dialog modal-lg">
       <div class="modal-content">
         <div class="modal-header">
           <h5 class="modal-title">{{ $t('common.titles.title_modal') }}</h5>
           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
         <div class="modal-body row">
           <div class="col-md-6">
             <label for="message-name" class="col-form-label">{{ $t('common.fields.name') }}</label>
             <input ref="textArea" name="message-name" class="form-control"
                    v-model="$props.selectedMessage.name"/>
             <label for="message-text" class="col-form-label">{{ $t('common.fields.label_message') }}</label>
             <textarea rows="5" ref="textArea" id="editorText" class="form-control text-area-Message" contenteditable="true"  @input="updateTextareaMessage"
              v-model="newMessage"/>
             <div class="d-flex mt-1">
               <button class="bold-button btn btn-sm btn-info btn-squared px-4 py-2 active"
                       @click="letterBold">
                 <b>B</b>
               </button>
               <button class="italic-button btn btn-sm btn-info btn-squared px-4 py-2 active ms-1"
                       @click="letterItalic">
                       <span class="fs-6">I</span><i></i>
               </button>
               <button class="emoji-button btn btn-sm btn-info btn-squared px-4 py-2 ms-1" @click="toggleEmojiPicker">
                😀
               </button>
             </div>
             <div v-show="isEmojiPickerOpen" class="emoji-picker position-absolute">
               <EmojiPicker @select="insertEmoji" />
             </div>
             <div class="d-flex align-items-center flex-wrap">
               <div v-for="(placeholder, index) in placeholders" :key="index">
                 <span class="tooltip-element badge bg-secondary ms-1" data-bs-toggle="tooltip" :title="$t(placeholder.description)" @click="insertPlaceholder(placeholder.value)">
                   {{ $t(placeholder.label) }}
                 </span>
               </div>
             </div>
           </div>
           <div class="col-md-6">
             <label for="message-text" class="col-form-label">{{ $t('common.fields.label_preview') }}</label>
             <div class="preview-container form-control" v-html="formattedMessage" disabled></div>
             <div class="mb-3" v-if="$props.selectedMessage">
               <label for="description-text" class="col-form-label">{{ $t('common.fields.label_description') }}</label>
               <textarea  class="form-control text-area-Description" id="description-text" aria-label="Description"
                         aria-describedby="description-addon" v-model="$props.selectedMessage.description" rows="5" @input="updateTextareaMessage" />
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
import {ref, computed, defineProps, defineEmits, Ref, onMounted} from 'vue'
import SettingsRepository from '@/repositories/SettingsRepository'
import ToastService from '@/services/ToastService'
import { useLoadingState } from '@/services/stores/LoadingState'
import { SettingsMessageInterface } from '@/types/SettingsMessagesInterface'
import { hide } from '@/helpers/ModalHelper'
import i18n from '@/plugins/i18n'
import EmojiPicker, {EmojiExt} from 'vue3-emoji-picker'

const { setLoading } = useLoadingState()
const textArea = ref<HTMLTextAreaElement | null>(null)
const isEmojiPickerOpen = ref(false)
const emit = defineEmits(['updateMessages'])
const props = defineProps<{ selectedMessage: SettingsMessageInterface}>()
const newMessage: Ref<string> = ref('')

const placeholders = [
  { description: 'common.placeholders.description.plate', label: 'common.placeholders.label.plate', value: '[[PLATE]]' },
  { description: 'common.placeholders.description.vehicle_color', label: 'common.placeholders.label.color', value: '[[COLOR]]' },
  { description: 'common.placeholders.description.username', label: 'common.placeholders.label.name', value: '[[USERNAME]]' },
  { description: 'common.placeholders.description.company_number', label: 'common.placeholders.label.number_pqr', value: '[[PQR-NUMBER]]' },
  { description: 'common.placeholders.description.place_name', label: 'common.placeholders.label.place_name', value: '[[PLACE]]' },
  { description: 'common.placeholders.description.company_name', label: 'common.placeholders.label.company_name', value: '[[COMPANY]]' },
]

onMounted(async() => {
  newMessage.value = props.selectedMessage.message?? ''
})

function updateTextareaMessage() {
  const textarea = textArea.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
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
  }
}

function applyStyleToSelection(style: string, text?: string): void {
  if (!textArea.value) return
  const startPos = textArea.value.selectionStart ?? 0
  const endPos = textArea.value.selectionEnd ?? 0
  const selectedText = text || (textArea.value.value.substring(startPos, endPos))
  const styledText = style === 'b' ? `*${selectedText}*` : `_${selectedText}_`
  const value = textArea.value.value
  textArea.value.value = value.substring(0, startPos) + styledText + value.substring(endPos, value.length)
  textArea.value.focus()
  const newEndPos = startPos + styledText.length - 1
  textArea.value.setSelectionRange(newEndPos, newEndPos)
}

function applyStyle(style: string): void {
  if (style === 'b' || style === 'i') {
    applyStyleToSelection(style)
  }
}

function insertTextAtCursor(text: string): void {
  newMessage.value += text
  if (textArea.value) {
    textArea.value.focus()
  }
}

function letterBold(): void {
  applyStyle('b')
}

function letterItalic(): void {
  applyStyle('i')
}

function insertEmoji(emoji: EmojiExt): void {
  if (emoji.i) {
    insertTextAtCursor(emoji.i)
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
      hide(updatedMessage.id)
      await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
    }).catch(async e => {
      setLoading(false)
      await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
    })
  }
}

const formattedMessage = computed(() => {
  let content = newMessage.value
  const tabs = content.match(/\t/g) || []
  const newLines = content.match(/\n/g) || []

  content = content
  .replace(/\*([^*]+)\*/g, '<b>$1</b>')
  .replace(/_([^_]+)_/g, '<i>$1</i>')

  for (let i = 0; i < tabs.length; i++) {
    content = content.replace(/\t/, '&#9;')
  }

  for (let i = 0; i < newLines.length; i++) {
    content = content.replace(/\n/, '<br>')
  }

  return content;
})
</script>
