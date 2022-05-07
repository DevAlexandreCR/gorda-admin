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

<script lang="ts">

import {Options, Vue} from 'vue-class-component'
import {Field} from 'vee-validate'
import {AutoCompleteType} from '@/types/AutoCompleteType'

class Props {
  elements: Array<AutoCompleteType>
  fieldName: string
  placeholder: string
}

@Options({
  components: {
    Field
  }
})
export default class AutoComplete extends Vue.with(Props) {

  selectedElement = ''
  foundElements: Array<AutoCompleteType> = []
  searchElement = ''

  onChange(): void {
    this.$emit('on-change', this.searchElement)
  }

  searchElements(): void {
    let matches = 0
    if (this.searchElement.length > 2) {
      this.foundElements = this.elements.filter(element => {
        if (element.value.toLowerCase().includes(this.searchElement.toLowerCase()) && matches < 5) {
          matches++
          return element
        }
      }) 
    } else {
      this.foundElements = []
    }
  }
  
  selectElement(element: AutoCompleteType): void {
    this.$emit('selected', element)
    this.selectedElement = element.value
    this.searchElement = element.value
    this.foundElements = []
  }
}
</script>