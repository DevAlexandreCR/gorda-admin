<template>
  <div class="form-group mb-1">
    <Field type="text" id="search" :name="props.fieldName ?? '12345'" @input="onChange" v-model="searchElement" :ref="input"
           @keyup="searchElements" :placeholder="props.placeholder" class="form-control" autocomplete="none"
    />

    <ul v-show="foundElements.length > 0"
        class="list-group autocomplete-list shadow-sm" :id="'list-' + props.idField + props.fieldName">
      <li v-for="element in foundElements" :key="element.id" @click="selectElement(element)"
          class="list-group-item" :id="element.id">
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
  fieldName?: string
  placeholder?: string
  idField?: string
}

const props = defineProps<Props>()
const input = ref<HTMLInputElement|null>(null)
const foundElements: Ref<Array<AutoCompleteType>> = ref([])
const searchElement: Ref<string> = ref('')
const emit = defineEmits(['on-change', 'selected'])
const callback = function (mutationsList: MutationRecord[]) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      const list = document?.getElementById('list-' + props.idField + props.fieldName)
      if (list && list.children.length > 0) {
        addListener()
      }
    }
  }
}

onMounted(() => {
  const targetNode = document.body
  const config = {childList: true, subtree: true}
  const observer = new MutationObserver(callback)
  observer.observe(targetNode, config)
})

function addListener(): void {
  const ul = document.getElementById('list-' + props.idField + props.fieldName)
  let liSelected: HTMLLIElement | null
  let index = -1
  if (!ul) return
  document.addEventListener('keydown', function (event: KeyboardEvent) {
    const len = ul.getElementsByTagName('li')?.length - 1
    if (len <= -1) return
    switch (event.code) {
      case 'ArrowDown':
        index++
        if (liSelected) {
          removeClass(liSelected, 'selected')
          let next = ul.getElementsByTagName('li')[index] as HTMLLIElement
          if (next && index <= len) {

            liSelected = next
          } else {
            index = 0
            liSelected = ul.getElementsByTagName('li')[0] as HTMLLIElement
          }
          addClass(liSelected, 'selected')
        } else {
          index = 0

          liSelected = ul.getElementsByTagName('li')[index] as HTMLLIElement
          if (liSelected) addClass(liSelected, 'selected')
        }
        break
      case 'ArrowUp':
        if (liSelected) {
          removeClass(liSelected, 'selected')
          index--
          let next = ul.getElementsByTagName('li')[index] as HTMLLIElement
          if (next && index >= 0) {
            liSelected = next
          } else {
            index = len
            liSelected = ul.getElementsByTagName('li')[len] as HTMLLIElement
          }
          addClass(liSelected, 'selected')
        } else {
          index = 0
          liSelected = ul.getElementsByTagName('li')[len] as HTMLLIElement
          if (liSelected) addClass(liSelected, 'selected')
        }
        break
      case 'Enter':
        if (liSelected) {
          input.value?.blur()
          liSelected.click()
        }
        break
      default:
        return
    }
  }, false)
}

function onChange(): void {
  emit('on-change', searchElement.value)
}

function removeClass(el: HTMLLIElement, className: string) {
  if(!el.className.includes(className)) return
  if (el.classList) {
    el.classList.remove(className)
  } else {
    el.className = el.className
        .replace(new RegExp('(^|\\b)' + className.split(' ')
            .join('|') + '(\\b|$)', 'gi'), ' ')
  }
}

function addClass(el: HTMLLIElement, className: string) {
  if(el.className.includes(className)) return
  if (el.classList) {
    el.classList.add(className)
  } else {
    el.className += ' ' + className
  }
}

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
  emit('selected', element, props.idField)
  searchElement.value = element.value
  foundElements.value = []
}
</script>