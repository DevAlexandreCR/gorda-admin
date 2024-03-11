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
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Nombre</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 w-auto">Descripción</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 w-auto">Message</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Acciones</th>
            </tr>
          </thead>
          <tbody class="text-sm text-opacity-25">
            <tr v-for="(item, index) in items" :key="index">
              <td class="align-middle">{{ item.messages.name }}</td>
              <td class="align-middle text-wrap">{{ item.messages.description }}</td>
              <td class="align-middle">{{ item.messages.message }}</td>
              <td class="align-middle">
                <button class="btn btn-sm btn-info btn-rounded rounded-pill py-1 m-0" data-bs-toggle="modal"
                  data-bs-target="#exampleModal">
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
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Editor</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
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
              <button class="btn btn-sm btn-info btn-squared px-4 py-2" @click="showingEmojiPanel = !showingEmojiPanel">😊</button>

            </div>
            <div class="col">
              <button class="btn btn-sm btn-info btn-squared px-4 py-2" @click="clearFormatting">
                Limpiar Filtros
              </button>
            </div>
          </div>
          <div class="mb-3">
            <label for="message-text" class="col-form-label">Mensaje:</label>
            <div id="editorTexto" class="form-control" contenteditable="true" @input="updatePreview"></div>
          </div>
          <div v-if="showingEmojiPanel" class="emoji-panel">
            <button v-for="emoji in emojis" :key="emoji" @click="insertEmoji(emoji)">{{ emoji }}</button>
          </div>
          <div class="modal-body" v-html="preview"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary">Guardar Cambios</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SettingsRepository from '@/repositories/SettingsRepository'
import { SettingsMessageInterface } from '@/types/SettingsMessages';

const items = ref<SettingsMessageInterface[]>([]) 
const emojis = [
  '😀', '😊', '👍', '❤️', '🌟', '🚀', '🙌', '💯', '🌞', '🌙', '🚗', '🚕', '🚓'
]

const showingEmojiPanel = ref(false)
const preview = ref('')
const isBoldActive = ref(false)
const isItalicActive = ref(false)

console.log('besitos');


onMounted(async () => {
  try {
    const mensajes = await SettingsRepository.getMessages()
    items.value = mensajes
  } catch (error) {
    console.error('Error al cargar los mensajes:', error)
  }
})

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