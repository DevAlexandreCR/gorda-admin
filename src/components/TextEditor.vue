<template>
    <div class="wpedit-editor">
        <label for="editorText" class="col-form-label wpedit-editor__label">{{ $t('common.fields.label_message') }}</label>
        <div class="wpedit-editor__block">
            <div class="wpedit-editor__toolbar">
                <button class="bold-button wpedit-editor__tool-btn wpedit-editor__tool-btn--bold" @click="letterBold">
                    <b>B</b>
                </button>
                <button class="italic-button wpedit-editor__tool-btn wpedit-editor__tool-btn--italic" @click="letterItalic">
                    <span class="fs-6">I</span><i></i>
                </button>
                <button class="emoji-button wpedit-editor__tool-btn wpedit-editor__tool-btn--emoji" @click="toggleEmojiPicker">
                    😀
                </button>
                <span class="wpedit-editor__divider"></span>
                <span v-for="(placeholder, index) in placeholders" :key="index"
                      class="tooltip-element wpedit-editor__chip" data-bs-toggle="tooltip" :title="$t(placeholder.description)"
                      @click="insertPlaceholder(placeholder.value)">
                    {{ $t(placeholder.label) }}
                </span>
            </div>
            <textarea rows="5" ref="textArea" id="editorText" class="text-area-Message wpedit-editor__textarea" contenteditable="true"
                      :placeholder="$t('wp.placeholders.editor_message')"
                      @input="updateTextareaMessage"
                      v-model="newMessage" />
        </div>
        <div v-show="isEmojiPickerOpen" class="emoji-picker position-absolute z-index-1">
            <EmojiPicker @select="insertEmoji" />
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
<style scoped lang="scss">
.wpedit-editor {
  --wpedit-border: var(--border-color);
  --wpedit-border-subtle: var(--border-subtle);
  --wpedit-surface: var(--surface-input);
  --wpedit-text: var(--text-heading);
  --wpedit-muted: var(--text-muted);
  --wpedit-primary: var(--primary);
  --wpedit-chip-hover-bg: var(--badge-primary-bg);
}

body.dark-version .wpedit-editor {
  --wpedit-border: var(--border-color);
  --wpedit-border-subtle: var(--border-subtle);
  --wpedit-surface: var(--surface-input);
  --wpedit-text: var(--text-heading);
  --wpedit-muted: var(--text-muted);
  --wpedit-primary: var(--primary);
  --wpedit-chip-hover-bg: var(--badge-primary-bg);
}

.wpedit-editor__label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--wpedit-text);
  margin-bottom: 0.35rem;
}

.wpedit-editor__block {
  border: 1.5px solid var(--wpedit-border);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: border-color 0.15s ease;
}

.wpedit-editor__block:focus-within {
  border-color: var(--wpedit-primary);
}

.wpedit-editor__toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.2rem;
  padding: 0.3rem 0.5rem;
  background: var(--wpedit-surface);
  border-bottom: 1px solid var(--wpedit-border-subtle);
}

.wpedit-editor__tool-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 0.35rem;
  background: transparent;
  color: var(--wpedit-text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Georgia, serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.12s ease;
}

.wpedit-editor__tool-btn:hover {
  background: var(--wpedit-chip-hover-bg);
}

.wpedit-editor__tool-btn--bold {
  font-weight: 900;
}

.wpedit-editor__tool-btn--italic {
  font-style: italic;
}

.wpedit-editor__divider {
  width: 1px;
  height: 16px;
  background: var(--wpedit-border-subtle);
  margin: 0 0.1rem;
}

.wpedit-editor__chip {
  padding: 0.18rem 0.5rem;
  border-radius: 50rem;
  border: 1px solid var(--wpedit-border);
  background: transparent;
  color: var(--wpedit-muted);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.13s ease;
  margin-left: 0.1rem;
}

.wpedit-editor__chip:hover {
  border-color: var(--wpedit-primary);
  background: var(--wpedit-chip-hover-bg);
  color: var(--wpedit-primary);
}

.wpedit-editor__textarea {
  display: block;
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: none;
  outline: none;
  background: var(--wpedit-surface);
  color: var(--wpedit-text);
  font-size: 0.875rem;
  line-height: 1.65;
  resize: vertical;
}
</style>
