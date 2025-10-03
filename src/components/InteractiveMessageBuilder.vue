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
                v-model="button.reply!.title"
                placeholder="Button Title"
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
            <button class="btn btn-outline-primary btn-sm" @click="addButton">{{ $t('wp.actions.add') }}</button>
            </div>

            <div v-if="message.type === 'list'" class="mb-3">
                <div class="mb-3">
                    <label class="form-label">{{ $t('wp.fields.button_text') }}</label>
                    <input
                        class="form-control"
                        v-model="message.action.button"
                        :placeholder="$t('wp.placeholders.button_text')"
                    />
                </div>
                
                <label class="form-label">{{ $t('wp.fields.list_items') }}</label><br>
                <div v-for="(row, rowIndex) in message.action.rows" :key="rowIndex" class="row mb-2">
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
                            v-model="row.title"
                            :placeholder="$t('wp.placeholders.item_title')"
                        />
                    </div>
                    <div class="col-4">
                        <input
                            class="form-control form-control-sm"
                            v-model="row.description"
                            :placeholder="$t('wp.placeholders.item_description')"
                        />
                    </div>
                    <div class="col-1">
                        <button class="btn btn-danger btn-sm" @click="removeRow(rowIndex)">
                            <em class="fa fa-trash"></em>
                        </button>
                    </div>
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
import { onMounted, ref, watch } from 'vue';
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

watch(message, (newMessage) => {
  emit('interactiveUpdated', newMessage)
}, { deep: true });

// Watch for type changes to initialize proper structure
watch(() => message.value.type, (newType) => {
  if (newType === 'list') {
    if (!message.value.action.rows) {
      message.value.action.rows = [];
    }
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

// List management functions
function addRow() {
  if (!message.value.action.rows) {
    message.value.action.rows = [];
  }
  message.value.action.rows.push({
    id: '',
    title: '',
    description: ''
  });
  emit('interactiveUpdated', message.value)
}

function removeRow(index: number) {
  message.value.action.rows?.splice(index, 1);
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
    if (message.value.type === 'list' && !message.value.action.rows) {
      message.value.action.rows = [];
    }
  } else {
    message.value = defaultMessage;
  }
  
  emit('interactiveUpdated', message.value)
})
</script>
