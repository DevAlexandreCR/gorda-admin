<template>
  <div class="card p-4">
    <div class="row">
        <div class="col col-sm-6">
            <h5 class="card-title">{{ $t('wp.titles.interactive_message') }}</h5>
            <div class="mb-3">
            <label class="form-label">{{ $t('wp.placeholders.message_type') }}</label>
            <select class="form-select" v-model="message.type">
                <option value="button">Button</option>
                <option value="location_request_message">Location Request</option>
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
            <label class="form-label">Buttons</label>
            <div v-for="(button, index) in message.action.buttons" :key="index" class="input-group mb-2">
                <input
                class="form-control"
                v-model="button.reply.title"
                placeholder="Button Title"
                />
                <input
                class="form-control"
                v-model="button.reply.id"
                placeholder="Button ID"
                />
                <button class="btn btn-outline-danger" @click="removeButton(index)">Remove</button>
            </div>
            <button class="btn btn-outline-primary btn-sm" @click="addButton">Add Button</button>
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
import { onMounted, reactive, ref, watch } from 'vue';
import InteractiveMessagePreview from './InteractiveMessagePreview.vue';
import { Interactive } from '@/types/Interactive';
import TextEditor from './TextEditor.vue';

const emit = defineEmits(['interactiveUpdated'])
const props = defineProps<{ selectedInteractive: Interactive|undefined}>()
const formattedMessage = ref<string>('')
let message = reactive<Interactive>({
  type: 'button',
  body: { text: '' },
  action: {
    buttons: [],
  },
});

watch(message, (newMessage) => {
  emit('interactiveUpdated', newMessage)
}, { deep: true });

function updateFormattedMessage(text: string): void{
  formattedMessage.value = text
}

function updateMessage(text: string): void{
  message.body = {
    text: text,
  }
}

function addButton() {
  message.action.buttons?.push({
    type: 'reply',
    reply: {
      id: '',
      title: '',
    },
  });
}

function removeButton(index: number) {
  message.action.buttons?.splice(index, 1);
}

onMounted(() => {
  message = props.selectedInteractive ?? {
    type: 'button',
    body: { text: '' },
    action: {
      buttons: [],
    },
  }
})
</script>
