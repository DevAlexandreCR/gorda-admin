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
    <div class="modal-dialog">
      <div class="modal-content" v-if="selectedMessage">
        <div class="modal-header">
          <h5 class="modal-title">Editor</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <Form @submit="saveChanges">
          <div class="modal-body">
            <div class="row mb-0">
              <div class="col">
                <button class="btn btn-sm btn-info btn-squared px-4 py-2 active" :class="{ 'btn-dark': isBoldActive }"
                  @click="toggleBold">
                  <b>B</b>
                </button>
              </div>
              <div class="col">
                <button class="btn btn-sm btn-info btn-squared px-4 py-2 active" :class="{ 'btn-dark': isItalicActive }"
                  @click="toggleItalic">
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
              <div class="modal-body preview-container" v-html="preview" />
            </div>
            <div class="mb-3">
              <label for="description-text" class="col-form-label">Descripción:</label>
              <input class="form-control" id="description-text" aria-label="Description"
                aria-describedby="description-addon" v-model="selectedMessage.description" />
            </div>
            <div v-if="showingEmojiPanel" class="emoji-panel">
              <button v-for="emoji in emojis" :key="emoji" @click="insertEmoji(emoji)">{{ emoji }}</button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">
              {{ $t('common.actions.close') }}
            </button>
            <button type="submit" class="btn bg-gradient-primary">{{ $t('common.actions.submit') }}</button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
import { Field, Form } from 'vee-validate'
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
const emojis = [
  '😀', '😊', '👍', '❤️', '🌟', '🚀', '🙌', '💯', '🌞', '🌙', '🚗', '🚕', '🚓'
]

onMounted(async () => {
  messages.value = await SettingsRepository.getMessages()
})

const editMessage = (message: SettingsMessageInterface): void => {
  selectedMessage.value = message
}

const toggleBold = () => {
  isBoldActive.value = !isBoldActive.value
  editorFocus()
  document.execCommand('bold', false)
}

const toggleItalic = () => {
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

function saveChanges(): void {
  if (selectedMessage.value) {
    setLoading(true)
    SettingsRepository.updateMessage(selectedMessage.value).then(async () => {
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

<style>
.emoji-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.emoji-panel button {
  cursor: pointer;
  background: none;
  border: none;
  font-size: 20px;
}
</style>