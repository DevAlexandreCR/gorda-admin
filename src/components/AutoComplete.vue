<template>
  <div class="form-group mb-1">
    <Field type="text" id="search" :name="fieldName ?? 'field'" @input="onChange" v-model="searchElement"
           @keyup="searchElements" :placeholder="placeholder" class="form-control" autocomplete="off"
    />

    <ul v-if="foundElements.length > 0"
        class="list-group autocomplete-list shadow-sm">
      <li v-for="element in foundElements" :key="element.id" @click="selectElement(element)"
          class="list-group-item">
        {{ element.value }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {Field} from 'vee-validate'
import {AutoCompleteType} from '@/types/AutoCompleteType'
import {onMounted, ref, Ref} from 'vue'

interface Props {
  elements: Array<AutoCompleteType>
  fieldName: string
  placeholder: string
}

const props = defineProps<Props>()

let selectedElement = ''
const foundElements: Ref<Array<AutoCompleteType>> = ref([])
const searchElement: Ref<string> = ref('')
const emit = defineEmits(['on-change', 'selected'])

function onChange(): void {
  emit('on-change', searchElement.value)
}

onMounted(() => {
  console.log(props.elements)
})

function searchElements(): void {
  let matches = 0
  if (searchElement.value.length > 2) {
    foundElements.value = props.elements.filter(element => {
      if (element.value.toLowerCase().includes(searchElement.value.toLowerCase()) && matches < 5) {
        matches++
        return element
      }
    })
  } else {
    foundElements.value = []
  }
}

function selectElement(element: AutoCompleteType): void {
  emit('selected', element)
  selectedElement = element.value
  searchElement.value = element.value
  foundElements.value = []
}
</script>