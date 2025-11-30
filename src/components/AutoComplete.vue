<template>
  <div class="form-group mb-1">
    <Field :name="props.fieldName ?? '12345'" :ref="input" v-model="searchElement"
           v-slot="{ errorMessage, meta }">
      <input :name="props.fieldName ?? '12345'" :id="idField?? 'search'" :class="classes?? 'form-control'" type="text" @input="onChange"
             :placeholder="props.placeholder" autocomplete="none" @keydown="onKeyDown" v-model="searchElement"/>
      <span class="is-invalid" v-if="errorMessage && meta.dirty">{{ errorMessage }}</span>
    </Field>
    <ErrorMessage :name="props.fieldName?? '12345'" v-slot="{ message }">
      <span class="is-invalid">{{ message }}</span>
    </ErrorMessage>

    <ul v-show="foundElements.length > 0"
        class="list-group autocomplete-list shadow-sm" :id="'list-' + props.idField + props.fieldName">
      <li v-for="(element, idx) in foundElements" :key="element.id" @click="selectElement(element)"
          class="list-group-item" :class="{ selected: idx === selectedIndex }" :id="element.id">
        {{ element.value }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {Field, ErrorMessage} from 'vee-validate'
import {AutoCompleteType} from '@/types/AutoCompleteType'
import {ref, Ref, watch} from 'vue'

interface Props {
  elements: Array<AutoCompleteType>
  classes?: string
  fieldName?: string
  placeholder?: string
  idField?: string
  normalizer?: (str: string) => string
  searchHandler?: (term: string) => Promise<Array<AutoCompleteType>>
}

const props = defineProps<Props>()
const input = ref<HTMLInputElement | null>(null)
const foundElements: Ref<Array<AutoCompleteType>> = ref([])
const searchElement: Ref<string> = ref('')
const selectedIndex = ref(-1)
const emit = defineEmits(['on-change', 'selected'])

watch(searchElement, (newValue) => {
  if (props.normalizer) searchElement.value = props.normalizer(newValue)
})

watch(foundElements, () => {
  selectedIndex.value = -1
})

function onChange(): void {
  emit('on-change', searchElement.value)
  searchElements()
}

function searchElements(): void {
  const term = searchElement.value
  if (props.searchHandler) {
    if (term.length <= 2) {
      foundElements.value = []
      return
    }
    const currentTerm = term
    props.searchHandler(term).then((results) => {
      // Evita resultados desfasados si el usuario siguió escribiendo
      if (searchElement.value !== currentTerm) return
      foundElements.value = results.slice(0, 10)
    }).catch(() => {
      foundElements.value = []
    })
    return
  }

  let matches = 0
  if (term.length > 2) {
    foundElements.value = props.elements.filter(element => {
      if (element.value.toLowerCase().includes(term.toLowerCase()) && matches < 10) {
        matches++
        return element
      }
    })
  } else {
    foundElements.value = []
  }
}

function selectElement(element: AutoCompleteType): void {
  emit('selected', element, props.idField)
  searchElement.value = element.value
  foundElements.value = []
}

function onKeyDown(event: KeyboardEvent): void {
  const len = foundElements.value.length
  if (len === 0) return

  if (event.code === 'ArrowDown') {
    event.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % len
  } else if (event.code === 'ArrowUp') {
    event.preventDefault()
    selectedIndex.value = selectedIndex.value <= 0 ? len - 1 : selectedIndex.value - 1
  } else if (event.code === 'Enter' && selectedIndex.value >= 0) {
    event.preventDefault()
    selectElement(foundElements.value[selectedIndex.value])
  }
}
</script>
