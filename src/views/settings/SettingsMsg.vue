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
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 w-auto">{{ $t('services.fields.comment') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 w-auto">Message</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Acciones</th>
            </tr>
          </thead>
          <tbody class="text-sm text-opacity-25">
            <tr v-for="(message, index) in messages" :key="index">
              <td class="align-middle">{{ message.name }}</td>
              <td class="align-middle text-wrap">{{ message.description }}</td>
              <td class="align-middle">{{ message.message }}</td>
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
              <div class="row mb-0">
                <div class="col">
                  <button class="btn btn-sm btn-info btn-squared px-4 py-2 active" :class="{ 'btn-dark': isBoldActive }"
                    @click="letterBold">
                    <b>B</b>
                  </button>
                </div>
                <div class="col">
                  <button class="btn btn-sm btn-info btn-squared px-4 py-2 active" :class="{ 'btn-dark': isItalicActive }"
                    @click="letterItalic">
                    <i>C</i>
                  </button>
                </div>
                <div class="col">
                  <button class="btn btn-sm btn-info btn-squared px-4 py-2"
                    @click="showingEmojiPanel = !showingEmojiPanel">😊</button>
                </div>
                <div class="col">
                  <button class="btn btn-sm btn-info btn-squared px-4 py-2" @click="clearFormatting">
                    Limpiar Filtros
                  </button>
                </div>
              </div>
              <div class="mb-3">
                <label for="message-text" class="col-form-label">Mensaje:</label>
                <div id="editorTexto" class="form-control editor-text" contenteditable="true" @input="updatePreview"
                  v-html="selectedMessage.message"></div>
                <div class="modal-body preview-container overflow-auto max-w-100" v-html="preview" />
                <div v-if="showingEmojiPanel" class="emoji-panel">
                  <button v-for="emoji in emojis" :key="emoji" @click="insertEmoji(emoji)">{{ emoji }}</button>
                  <button class="btn btn-outline-danger mt-3" @click="showingEmojiPanel = false">
                    <i class="fas fa-times" style="font-size: 15px;"></i>
                  </button>
                </div>
              </div>
              <div class="mb-3">
                <label for="description-text" class="col-form-label">Descripción:</label>
                <input class="form-control" id="description-text" aria-label="Description"
                  aria-describedby="description-addon" v-model="selectedMessage.description" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">
                {{ $t('common.actions.close') }}
              </button>
              <button type="submit" class="btn bg-gradient-primary" @click="saveChanges">{{ $t('common.actions.submit') }}</button>
            </div>
          </div>
          <div class="col-md-6">
            <div class="row align-items-center">
              <div class="col-md-12" v-for="(placeholder, index) in placeholders" :key="index">
                <label class="text-muted">Placeholder de {{ placeholder.name }}</label>
                <button class="btn btn-link btn-block btn-xs" @click="insertPlaceholder(placeholder.value)">
                  {{ placeholder.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
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
const preview = ref('')
const isBoldActive = ref(false)
const isItalicActive = ref(false)
const placeholders = [
  { name: 'placa', label: 'plate', value: '${plate}' },
  { name: 'color del vehículo', label: 'Vehicle.color', value: '${Vehicle.color.name}' },
  { name: 'nombre de usuario', label: 'name', value: '${name}' },
  { name: 'número de compañía', label: 'PQR_NUMBER', value: '${PQR_NUMBER}' },
  { name: 'bienvenida', label: 'WELCOME', value: '${WELCOME}' }
]
const emojis = [
  '😀', '😊', '👍', '❤️', '🌟', '🚀', '🙌', '💯', '🌞', '🌙', '🚗', '🚕', '🚓'
]

onMounted(async () => {
  messages.value = await SettingsRepository.getMessages()
})

const editMessage = (message: SettingsMessageInterface): void => {
  selectedMessage.value = message
}

const letterBold = () => {
  isBoldActive.value = !isBoldActive.value
  editorFocus()
  document.execCommand('bold', false)
}

const letterItalic = () => {
  isItalicActive.value = !isItalicActive.value
  editorFocus()
  document.execCommand('italic', false)
}

const editorFocus = () => {
  const editor = document.getElementById('editorTexto')
  if (editor) {
    editor.focus()
  }
}

const clearFormatting = () => {
  document.execCommand('removeFormat', false,)
  isBoldActive.value = false
  isItalicActive.value = false
  updatePreview()
}

const insertEmoji = (emoji: string | undefined) => {
  editorFocus()
  const editor = document.getElementById('editorTexto')
  if (editor) {
    editor.focus()
    document.execCommand('insertText', false, emoji)
    showingEmojiPanel.value = false
    updatePreview()
  }
}

const insertPlaceholder = (placeholder: string) => {
  editorFocus()
  const editor = document.getElementById('editorTexto')
  if (editor) {
    editor.focus()
    document.execCommand('insertText', false, placeholder)
    showingEmojiPanel.value = false;
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
  const editor = document.getElementById('editorTexto')
  if (editor) {
    let content = editor.innerHTML
    content = content.replace(/<u>(.*?)<\/u>/g, '$1')
    content = content.replace(/<b>(.*?)<\/b>/g, '*$1*')
    content = content.replace(/<i>(.*?)<\/i>/g, '_$1_')
    preview.value = content
  }
}
</script>