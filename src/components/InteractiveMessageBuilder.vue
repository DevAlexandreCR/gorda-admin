<template>
  <div class="card p-4">
    <div class="row">
        <div class="col col-sm-6">
            <h5 class="card-title">{{ $t('wp.titles.interactive_message') }}</h5>
            <div class="mb-3">
            <label class="form-label">{{ $t('wp.placeholders.message_type') }}</label>
            <select class="form-select" v-model="message.type">
                <option value="button">{{ $t('wp.fields.button') }}</option>
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
            <div v-for="(button, index) in message.action.buttons" :key="index" class="input-group mb-2">
                <input
                class="form-control form-control-sm me-2"
                v-model="button.reply.title"
                placeholder="Button Title"
                />
                <input
                class="form-control form-control-sm"
                v-model="button.reply.id"
                placeholder="Button ID"
                />
                <button class="btn btn-sm btn-outline-danger" @click="removeButton(index)">{{ $t('wp.actions.remove') }}</button>
            </div>
            <button class="btn btn-outline-primary btn-sm" @click="addButton">{{ $t('wp.actions.add') }}</button>
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
const props = defineProps<{ selectedInteractive: Interactive|undefined}>()
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

onMounted(() => {
  message.value = props.selectedInteractive ?? {
    type: 'button',
    body: { text: '' },
    action: {
      buttons: [],
    },
  }
  emit('interactiveUpdated', message.value)
})
</script>
