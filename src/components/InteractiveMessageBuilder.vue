<template>
  <div class="wabuilder-card">
    <div class="wabuilder-header">
      <div class="wabuilder-header-icon">
        <em class="fas fa-bolt"></em>
      </div>
      <span class="wabuilder-header-title">{{ $t('wp.titles.interactive_message') }}</span>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="mb-3">
          <label class="wabuilder-label">{{ $t('wp.placeholders.message_type') }}</label>
          <div class="wabuilder-select-wrap">
            <select class="wabuilder-select" v-model="message.type">
              <option value="button">{{ $t('wp.fields.button') }}</option>
              <option value="list">{{ $t('wp.fields.list') }}</option>
              <option value="location_request_message">{{ $t('wp.fields.location_request') }}</option>
            </select>
            <em class="fas fa-chevron-down wabuilder-select-caret"></em>
          </div>
        </div>

        <div class="mb-3">
          <TextEditor
            :selectedMessage="message.body?.text ?? ''"
            @content-updated="updateFormattedMessage"
            @message-updated="updateMessage"
          />
        </div>

        <div v-if="message.type === 'button'" class="mb-3">
          <div class="wabuilder-section-header">
            <span class="wabuilder-label wabuilder-label--inline">{{ $t('wp.fields.reply_buttons_label') }}</span>
            <span class="wabuilder-counter">{{ message.action.buttons?.length ?? 0 }}/3</span>
          </div>
          <div class="wabuilder-cols-head">
            <span>{{ $t('wp.fields.column_label') }}</span>
            <span>{{ $t('wp.fields.column_action_id') }}</span>
            <span></span>
          </div>
          <div class="wabuilder-btn-rows">
            <div v-for="(button, index) in message.action.buttons" :key="index" class="wabuilder-btn-row">
              <input
                class="wabuilder-input wabuilder-input--sm"
                :class="{ 'is-invalid': isButtonTitleInvalid(button.reply?.title || '') }"
                v-model="button.reply!.title"
                :placeholder="$t('wp.placeholders.button_label')"
                maxlength="20"
              />
              <input
                class="wabuilder-input wabuilder-input--sm wabuilder-input--mono"
                v-model="button.reply!.id"
                :placeholder="$t('wp.placeholders.button_action')"
              />
              <button type="button" class="wabuilder-delete-btn" @click="removeButton(index)">
                <em class="fas fa-trash"></em>
              </button>
            </div>
          </div>
          <div v-if="hasInvalidButtonTitles" class="text-danger small mb-2">
            {{ $t('wp.validations.button_title_max_length') }}
          </div>
          <button
            v-if="(message.action.buttons?.length ?? 0) < 3"
            type="button"
            class="wabuilder-add-btn"
            @click="addButton"
          >
            <em class="fas fa-plus"></em>
            {{ $t('wp.actions.add_button') }}
          </button>
        </div>

        <div v-if="message.type === 'list'" class="mb-3">
          <div class="mb-3">
            <label class="wabuilder-label">{{ $t('wp.fields.button_text') }}</label>
            <input
              class="wabuilder-input"
              :class="{ 'is-invalid': isButtonTextInvalid }"
              v-model="message.action.button"
              :placeholder="$t('wp.placeholders.button_text')"
              maxlength="20"
            />
            <div v-if="isButtonTextInvalid" class="invalid-feedback">
              {{ $t('wp.validations.button_text_max_length') }}
            </div>
            <div class="wabuilder-counter wabuilder-counter--block">
              {{ buttonTextLength }}/20 {{ $t('wp.fields.characters') }}
            </div>
          </div>

          <label class="wabuilder-label">{{ $t('wp.fields.list_items') }}</label>
          <div class="wabuilder-list-rows">
            <div v-for="(row, rowIndex) in getListRows()" :key="rowIndex" class="wabuilder-list-row">
              <input
                class="wabuilder-input wabuilder-input--sm"
                v-model="row.id"
                :placeholder="$t('wp.placeholders.item_id')"
              />
              <input
                class="wabuilder-input wabuilder-input--sm"
                :class="{ 'is-invalid': isListItemTitleInvalid(row.title || '') }"
                v-model="row.title"
                :placeholder="$t('wp.placeholders.item_title')"
                maxlength="24"
              />
              <input
                class="wabuilder-input wabuilder-input--sm"
                :class="{ 'is-invalid': isListItemDescriptionInvalid(row.description || '') }"
                v-model="row.description"
                :placeholder="$t('wp.placeholders.item_description')"
                maxlength="72"
              />
              <button type="button" class="wabuilder-delete-btn" @click="removeRow(rowIndex)">
                <em class="fas fa-trash"></em>
              </button>
            </div>
          </div>
          <div v-if="hasInvalidListItems" class="text-danger small mb-2">
            {{ $t('wp.validations.list_items_max_length') }}
          </div>
          <button type="button" class="wabuilder-add-btn" @click="addRow">
            <em class="fas fa-plus"></em>
            {{ $t('wp.actions.add_item') }}
          </button>
        </div>
      </div>
      <div class="col-md-6">
        <label class="wabuilder-label">{{ $t('common.fields.label_preview') }}</label>
        <WhatsAppPhonePreview>
          <InteractiveMessagePreview :message="message" :formattedMessage="formattedMessage" />
        </WhatsAppPhonePreview>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue';
import InteractiveMessagePreview from './InteractiveMessagePreview.vue';
import WhatsAppPhonePreview from './WhatsAppPhonePreview.vue';
import { Interactive } from '@/types/Interactive';
import TextEditor from './TextEditor.vue';

const emit = defineEmits(['interactiveUpdated'])
const props = defineProps<{ selectedInteractive: Interactive|null}>()
const formattedMessage = ref<string>('')
const message = ref<Interactive>({
  type: 'button',
  body: { text: '' },
  action: {
    buttons: [],
  },
});

// Computed properties for button text validation
const buttonTextLength = computed(() => {
  return message.value.action.button?.length || 0;
});

const isButtonTextInvalid = computed(() => {
  return buttonTextLength.value > 20;
});

// Button title validation functions
const isButtonTitleInvalid = (title: string) => {
  return title.length > 20;
};

const hasInvalidButtonTitles = computed(() => {
  return message.value.action.buttons?.some(button =>
    isButtonTitleInvalid(button.reply?.title || '')
  ) || false;
});

// List item title validation
const isListItemTitleInvalid = (title: string) => {
  return title.length > 24;
};

// List item description validation
const isListItemDescriptionInvalid = (description: string) => {
  return description.length > 72;
};

const hasInvalidListItems = computed(() => {
  const rows = getListRows();
  return rows.some(row =>
    isListItemTitleInvalid(row.title || '') ||
    isListItemDescriptionInvalid(row.description || '')
  );
});

watch(message, (newMessage) => {
  emit('interactiveUpdated', newMessage)
}, { deep: true });

// Watch for type changes to initialize proper structure
watch(() => message.value.type, (newType) => {
  if (newType === 'list') {
    ensureDefaultSection();
    if (!message.value.action.button) {
      message.value.action.button = '';
    }
  } else if (newType === 'button') {
    if (!message.value.action.buttons) {
      message.value.action.buttons = [];
    }
  }
});

function updateFormattedMessage(text: string): void{
  formattedMessage.value = text
}

function updateMessage(text: string): void{
  message.value.body = {
    text: text,
  }
}

function addButton() {
  message.value.action.buttons?.push({
    type: 'reply',
    reply: {
      id: '',
      title: '',
    },
  });
  emit('interactiveUpdated', message.value)
}

function removeButton(index: number) {
  message.value.action.buttons?.splice(index, 1);
  emit('interactiveUpdated', message.value)
}

// List management functions (working with single default section)
function getListRows() {
  ensureDefaultSection();
  return message.value.action.sections?.[0]?.rows || [];
}

function ensureDefaultSection() {
  if (!message.value.action.sections) {
    message.value.action.sections = [];
  }
  if (message.value.action.sections.length === 0) {
    message.value.action.sections.push({
      rows: []
    });
  }
}

function addRow() {
  ensureDefaultSection();
  message.value.action.sections![0].rows.push({
    id: '',
    title: '',
    description: ''
  });
  emit('interactiveUpdated', message.value)
}

function removeRow(index: number) {
  ensureDefaultSection();
  message.value.action.sections![0].rows.splice(index, 1);
  emit('interactiveUpdated', message.value)
}

onMounted(() => {
  const defaultMessage: Interactive = {
    type: 'button',
    body: { text: '' },
    action: {
      buttons: [],
    },
  };

  if (props.selectedInteractive) {
    message.value = { ...props.selectedInteractive };
    // Ensure proper structure for list messages
    if (message.value.type === 'list') {
      ensureDefaultSection();
    }
  } else {
    message.value = defaultMessage;
  }

  emit('interactiveUpdated', message.value)
})
</script>

<style scoped lang="scss">
.wabuilder-card {
  --wabuilder-card-bg: var(--surface-card);
  --wabuilder-card-shadow: var(--shadow-card);
  --wabuilder-heading: var(--text-heading);
  --wabuilder-muted: var(--text-muted);
  --wabuilder-input-bg: var(--surface-input);
  --wabuilder-input-border: var(--border-color);
  --wabuilder-primary: var(--primary);
  --wabuilder-danger-bg: var(--badge-danger-bg);
  --wabuilder-danger-fg: var(--badge-danger-fg);
  background-color: var(--wabuilder-card-bg);
  border-radius: 0.875rem;
  box-shadow: var(--wabuilder-card-shadow);
  padding: 1.25rem;
}

body.dark-version .wabuilder-card {
  --wabuilder-card-bg: var(--surface-card);
  --wabuilder-card-shadow: var(--shadow-card);
  --wabuilder-heading: var(--text-heading);
  --wabuilder-muted: var(--text-muted);
  --wabuilder-input-bg: var(--surface-input);
  --wabuilder-input-border: var(--border-color);
  --wabuilder-primary: var(--primary);
  --wabuilder-danger-bg: var(--badge-danger-bg);
  --wabuilder-danger-fg: var(--badge-danger-fg);
}

.wabuilder-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.1rem;
}

.wabuilder-header-icon {
  width: 26px;
  height: 26px;
  border-radius: 0.4rem;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(310deg, #17ad37, #98ec2d);
  color: #ffffff;
  font-size: 0.7rem;
}

.wabuilder-header-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--wabuilder-heading);
}

.wabuilder-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--wabuilder-heading);
  margin-bottom: 0.4rem;
}

.wabuilder-label--inline {
  margin-bottom: 0;
}

.wabuilder-select-wrap {
  position: relative;
}

.wabuilder-select {
  display: block;
  width: 100%;
  padding: 0.55rem 2.2rem 0.55rem 0.75rem;
  border: 1.5px solid var(--wabuilder-input-border);
  border-radius: 0.5rem;
  background-color: var(--wabuilder-input-bg);
  color: var(--wabuilder-heading);
  font-size: 0.875rem;
  appearance: none;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s ease;
}

.wabuilder-select:focus {
  border-color: var(--wabuilder-primary);
}

.wabuilder-select-caret {
  position: absolute;
  right: 0.7rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--wabuilder-muted);
  font-size: 0.7rem;
}

.wabuilder-input {
  display: block;
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: 1.5px solid var(--wabuilder-input-border);
  border-radius: 0.5rem;
  background-color: var(--wabuilder-input-bg);
  color: var(--wabuilder-heading);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s ease;
}

.wabuilder-input:focus {
  border-color: var(--wabuilder-primary);
}

.wabuilder-input--sm {
  font-size: 0.8rem;
  padding: 0.38rem 0.65rem;
}

.wabuilder-input--mono {
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
}

.wabuilder-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.55rem;
}

.wabuilder-counter {
  font-size: 0.68rem;
  color: var(--wabuilder-muted);
  font-weight: 600;
}

.wabuilder-counter--block {
  display: block;
  margin-top: 0.35rem;
}

.wabuilder-cols-head {
  display: grid;
  grid-template-columns: 1fr 1fr 34px;
  gap: 0.4rem;
  margin-bottom: 0.35rem;
}

.wabuilder-cols-head span {
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--wabuilder-muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.wabuilder-btn-rows,
.wabuilder-list-rows {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.wabuilder-btn-row {
  display: grid;
  grid-template-columns: 1fr 1fr 34px;
  gap: 0.4rem;
  align-items: center;
}

.wabuilder-list-row {
  display: grid;
  grid-template-columns: 0.75fr 1fr 1fr 34px;
  gap: 0.4rem;
  align-items: center;
}

.wabuilder-delete-btn {
  width: 34px;
  height: 34px;
  border-radius: 0.4rem;
  border: none;
  background-color: var(--wabuilder-danger-bg);
  color: var(--wabuilder-danger-fg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  cursor: pointer;
}

.wabuilder-add-btn {
  margin-top: 0.55rem;
  padding: 0.35rem 0.8rem;
  border: 1.5px dashed var(--wabuilder-input-border);
  border-radius: 0.45rem;
  background-color: transparent;
  color: var(--wabuilder-primary);
  font-size: 0.73rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: border-color 0.14s ease;
}
</style>
