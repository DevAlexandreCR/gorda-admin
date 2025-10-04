<template>
  <div class="card p-4">
    <div class="row">
        <div class="col col-sm-6">
            <h5 class="card-title">{{ $t('wp.titles.interactive_message') }}</h5>
            <div class="mb-3">
            <label class="form-label">{{ $t('wp.placeholders.message_type') }}</label>
            <select class="form-select" v-model="message.type">
                <option value="button">{{ $t('wp.fields.button') }}</option>
                <option value="list">{{ $t('wp.fields.list') }}</option>
                <option value="location_request_message">{{ $t('wp.fields.location_request') }}</option>
            </select>
            </div>

            <div class="mb-3">
                <TextEditor
                :selectedMessage="message.body?.text ?? ''"
                @content-updated="updateFormattedMessage"
                @message-updated="updateMessage"
                />
            </div>

            <div v-if="message.type === 'button'" class="mb-3">
            <label class="form-label">{{ $t('wp.fields.buttons') }}</label><br>
            <div v-for="(button, index) in message.action.buttons" :key="index" class="d-flex mb-1">
                <input
                class="form-control me-1"
                :class="{ 'is-invalid': isButtonTitleInvalid(button.reply?.title || '') }"
                v-model="button.reply!.title"
                placeholder="Button Title"
                maxlength="20"
                />
                <input
                class="form-control me-1"
                v-model="button.reply!.id"
                placeholder="Button ID"
                />
                <button class="btn btn-danger my-auto" @click="removeButton(index)">
                    <em class="fa fa-trash"></em>
                </button>
            </div>
            <div v-if="hasInvalidButtonTitles" class="text-danger small mb-2">
                {{ $t('wp.validations.button_title_max_length') }}
            </div>
            <button class="btn btn-outline-primary btn-sm" @click="addButton">{{ $t('wp.actions.add') }}</button>
            </div>

            <div v-if="message.type === 'list'" class="mb-3">
                <div class="mb-3">
                    <label class="form-label">{{ $t('wp.fields.button_text') }}</label>
                    <input
                        class="form-control"
                        :class="{ 'is-invalid': isButtonTextInvalid }"
                        v-model="message.action.button"
                        :placeholder="$t('wp.placeholders.button_text')"
                        maxlength="20"
                    />
                    <div v-if="isButtonTextInvalid" class="invalid-feedback">
                        {{ $t('wp.validations.button_text_max_length') }}
                    </div>
                    <div class="form-text">
                        {{ buttonTextLength }}/20 {{ $t('wp.fields.characters') }}
                    </div>
                </div>
                
                <label class="form-label">{{ $t('wp.fields.list_items') }}</label><br>
                <div v-for="(row, rowIndex) in getListRows()" :key="rowIndex" class="row mb-2">
                    <div class="col-3">
                        <input
                            class="form-control form-control-sm"
                            v-model="row.id"
                            :placeholder="$t('wp.placeholders.item_id')"
                        />
                    </div>
                    <div class="col-4">
                        <input
                            class="form-control form-control-sm"
                            :class="{ 'is-invalid': isListItemTitleInvalid(row.title || '') }"
                            v-model="row.title"
                            :placeholder="$t('wp.placeholders.item_title')"
                            maxlength="24"
                        />
                    </div>
                    <div class="col-4">
                        <input
                            class="form-control form-control-sm"
                            :class="{ 'is-invalid': isListItemDescriptionInvalid(row.description || '') }"
                            v-model="row.description"
                            :placeholder="$t('wp.placeholders.item_description')"
                            maxlength="72"
                        />
                    </div>
                    <div class="col-1">
                        <button class="btn btn-danger btn-sm" @click="removeRow(rowIndex)">
                            <em class="fa fa-trash"></em>
                        </button>
                    </div>
                </div>
                <div v-if="hasInvalidListItems" class="text-danger small mb-2">
                    {{ $t('wp.validations.list_items_max_length') }}
                </div>
                <button class="btn btn-outline-primary btn-sm" @click="addRow">{{ $t('wp.actions.add_item') }}</button>
            </div>
        </div>
        <div class="col col-sm-6">
            <h6 class="mt-4">{{ $t('common.fields.label_preview') }}</h6>
            <InteractiveMessagePreview :message="message" :formattedMessage="formattedMessage" />
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue';
import InteractiveMessagePreview from './InteractiveMessagePreview.vue';
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
