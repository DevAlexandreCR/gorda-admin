<template>
  <div class="relative">
    <div class="form-group mb-1">
      <Field type="text" id="search" :name="fieldName" @input="onChange" v-model="searchElement"
             @keyup="searchElements" :placeholder="placeholder" class="form-control" autocomplete="none"/>
    </div>
    <ul v-if="foundElements.length > 2"
        class="list-group autocomplete-list shadow-sm w-100">
      <li v-for="element in foundElements" :key="element" @click="selectElement(element)"
          class="list-group-item">
        {{ element }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">

import {Options, Vue} from 'vue-class-component'
import {Field} from 'vee-validate'

class Props {
  elements: Array<any>
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
  foundElements: Array<any> = []
  searchElement = ''

  onChange(): void {
    this.$emit('on-change', this.searchElement)
  }

  searchElements(): void {
    let matches = 0
    if (this.searchElement.length > 2) {
      this.foundElements = this.elements.filter(element => {
        if (element.toLowerCase().includes(this.searchElement.toLowerCase()) && matches < 5) {
          matches++
          return element
        }
      })
    }
  }

  selectElement(element: string): void {
    this.selectedElement = element
    this.searchElement = element
    this.foundElements = []
  }
}
</script>