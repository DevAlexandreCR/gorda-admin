<template>
  <div class="card px-2 py-1">
    <div class="card-header pb-0">
      <h6>Segunda Tabla</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <caption hidden></caption>
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('services.fields.name') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 w-25">{{ $t('services.fields.comment') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 w-25">Message</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Acciones</th>
            </tr>
          </thead>
          <tbody class="text-sm text-opacity-25">
            <tr v-for="(message, index) in messages" :key="index">
              <td class="align-middle">{{ message.name }}</td>
              <td class="align-middle text-truncate">{{ message.description }}</td>
              <td class="align-middle text-truncate">{{ message.message }}</td>
              <td class="align-middle">
                <button class="btn btn-sm btn-info btn-rounded rounded-pill py-1 m-0" data-bs-toggle="modal"
                  data-bs-target="#exampleModal" @click="() => editMessage(message)">
                  <em class="fas fa-pencil"></em>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div id="exampleModal" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content" v-if="selectedMessage">
        <div class="modal-header">
          <h5 class="modal-title">Editor</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body row">
          <div class="col-md-6">
            <div class="modal-body">
              <div class="mb-3">
                <label for="message-text" class="col-form-label">Mensaje:</label>
                <textarea ref="textArea" id="editorText" class="form-control" contenteditable="true" @change="updatePreview"
                          v-model="selectedMessage.message"/>
                <div class="d-flex mt-1">
                  <button class="btn btn-sm btn-info btn-squared px-4 py-2 active" :class="{ 'btn-dark': isBoldActive }"
                          @click="letterBold">
                    <b>B</b>
                  </button>
                  <button class="btn btn-sm btn-info btn-squared px-4 py-2 active ms-1" :class="{ 'btn-dark': isItalicActive }"
                          @click="letterItalic">
                    <i>C</i>
                  </button>
                  <button class="btn btn-sm btn-info btn-squared px-4 py-2 ms-1"
                          @click="showingEmojiPanel = !showingEmojiPanel">😊</button>
                </div>
                <div v-if="showingEmojiPanel" class="emoji-panel">
                  <button v-for="emoji in emojis" :key="emoji" @click="insertEmoji(emoji)">{{ emoji }}</button>
                  <button class="btn btn-outline-danger mt-3" @click="showingEmojiPanel = false">
                    <i class="fas fa-times" style="font-size: 15px;"></i>
                  </button>
                </div>
                <div class="d-flex align-items-center flex-wrap">
                  <div v-for="(placeholder, index) in placeholders" :key="index">
                <span class="badge bg-secondary" data-bs-toggle="tooltip" :title="$t(placeholder.name)" @click="insertPlaceholder(placeholder.value)">
                  {{ placeholder.label }}
                </span>
                </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <label for="message-text" class="col-form-label">Preview:</label>
            <textarea disabled class="form-control" v-model="preview" />
            <div class="mb-3">
              <label for="description-text" class="form-label">Descripción:</label>
              <textarea class="form-control" id="description-text" aria-label="Description"
                        aria-describedby="description-addon" v-model="selectedMessage.description" />
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
import {ref, onMounted, Ref, computed} from 'vue'
import SettingsRepository from '@/repositories/SettingsRepository'
import { SettingsMessageInterface } from '@/types/SettingsMessages';
import { useLoadingState } from '@/services/stores/LoadingState'
import { hide } from '@/helpers/ModalHelper'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'

const messages: Ref<SettingsMessageInterface[]> = ref([])
const selectedMessage: Ref<SettingsMessageInterface | null> = ref(null)
const showingEmojiPanel = ref(false)
const { setLoading } = useLoadingState()
const isBoldActive = ref(false)
const isItalicActive = ref(false)
const textArea: Ref<HTMLTextAreaElement|null> = ref(null)
const placeholders = [
  { name: 'placa', label: 'setting.placeholders.plate', value: '[[plate]]' },
  { name: 'color del vehículo', label: 'Vehicle.color', value: '${Vehicle.color.name}' },
  { name: 'nombre de usuario', label: 'name', value: '${name}' },
  { name: 'número de compañía', label: 'PQR_NUMBER', value: '${PQR_NUMBER}' },
  { name: 'bienvenida', label: 'WELCOME', value: '${WELCOME}' }
]
const emojis = [
  '😀', '😊', '👍', '❤️', '🌟', '🚀', '🙌', '💯', '🌞', '🌙', '🚗', '🚕', '🚓'
]
const preview = computed(() => {
  return updatePreview()
})
onMounted(async () => {
  messages.value = await SettingsRepository.getMessages()
})

const editMessage = (message: SettingsMessageInterface): void => {
  selectedMessage.value = message
}

const letterBold = () => {
  isBoldActive.value = !isBoldActive.value
  editorFocus()
  if (textArea.value) {
    textArea.value.classList.add('bold')
  }
}

const letterItalic = () => {
  isItalicActive.value = !isItalicActive.value
  editorFocus()
  document.execCommand('italic', false)
}

const editorFocus = () => {
  if (textArea.value) {
    textArea.value.focus()
  }
}

const insertEmoji = (emoji: string | undefined) => {
  editorFocus()
  if (textArea.value && selectedMessage.value) {
    textArea.value.focus()
    selectedMessage.value.message += emoji
    showingEmojiPanel.value = false
    updatePreview()
  }
}

const insertPlaceholder = (placeholder: string) => {
  editorFocus()
  if (textArea.value && selectedMessage.value) {
    textArea.value.focus()
    selectedMessage.value.message += placeholder
    showingEmojiPanel.value = false
    updatePreview()
  }
}

function saveChanges(): void {
  if (selectedMessage.value) {
    setLoading(true)
    const updatedMessage = {
      id: selectedMessage.value.id,
      name: selectedMessage.value.name,
      description: selectedMessage.value.description,
      message: preview.value.trim()
    }
    SettingsRepository.updateMessage(updatedMessage).then(async () => {
      messages.value = await SettingsRepository.getMessages()
      preview.value = ''
      setLoading(false)
      hide('exampleModal')
      await ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.updated'))
    }).catch(async e => {
      setLoading(false)
      await ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
    })
  }
}

const updatePreview = () => {
  if (selectedMessage.value) {
    let content = selectedMessage.value.message
    content = content.replace(/<u>(.*?)<\/u>/g, '$1')
    content = content.replace(/<b>(.*?)<\/b>/g, '*$1*')
    content = content.replace(/<i>(.*?)<\/i>/g, '_$1_')
    return  content
  }
}
</script>