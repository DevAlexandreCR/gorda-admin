<template>
    <div>
        <label for="message-text" class="col-form-label">{{ $t('common.fields.label_message') }}</label>
        <textarea rows="5" ref="textArea" id="editorText" class="form-control text-area-Message" contenteditable="true"  @input="updateTextareaMessage"
        v-model="newMessage" />
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
        <div v-show="isEmojiPickerOpen" class="emoji-picker position-absolute z-index-1">
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
</template>
<script lang="ts" setup>
import {ref, defineProps, defineEmits, Ref, onMounted, watch} from 'vue'
import EmojiPicker, {EmojiExt} from 'vue3-emoji-picker'

const textArea = ref<HTMLTextAreaElement | null>(null)
const isEmojiPickerOpen = ref(false)
const emit = defineEmits(['messageUpdated', 'contentUpdated'])
const props = defineProps<{ selectedMessage: string}>()
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
  newMessage.value = props.selectedMessage
  emit('messageUpdated', newMessage.value)
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

watch(newMessage, (newValue) => {
    let content = newValue
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

    emit('contentUpdated', content)
    emit('messageUpdated', newMessage.value)
})

watch(() => props.selectedMessage, (newValue) => {
    newMessage.value = newValue
    if (textArea.value) {
        textArea.value.value = newValue
        updateTextareaMessage()
    }
    emit('messageUpdated', newMessage.value)
})
</script>