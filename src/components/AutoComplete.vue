<template>
  <div class="bg-gray-50 min-w-screen min-h-screen flex justify-center items-center">
    <div class="max-w-xs relative space-y-3">
               
      <div class="form-group">
            <div class="input-group">
              <Field type="text" id="search" :name="fieldName" @input="onChange" v-model="searchElement" @keyup="searchElements" placeholder="Type here..." class="form-control "/>
            </div>
         </div>

      <ul v-if="foundElements.length > 0" class="w-full rounded text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 ">
        <li v-for="element in foundElements" :key="element" @click="selectElement(element)" class="cursor-pointer hover:bg-gray-100 p-1">
          {{ element }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">

import {Options, Vue} from 'vue-class-component'
import {Field} from 'vee-validate'

class Props {
  elements: Array<any>
  fieldName: string
}

@Options({
  components: {
    Field
  }
})
export default class AutoComplete  extends Vue.with(Props){

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