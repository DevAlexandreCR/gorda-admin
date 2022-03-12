<template>
  <div class="bg-gray-50 min-w-screen min-h-screen flex justify-center items-center">
    <div class="max-w-xs relative space-y-3">
               
      <div class="form-group">
            <div class="input-group">
              <Field  type="text" id="search" :name="fieldName" v-model="searchTerm" @keyup="searchCountry" placeholder="Type here..." class="form-control "/>
            </div>
         </div>

      <ul v-if="searchElements.length > 1" class="w-full rounded text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 ">
        <li class="px-1 pt-1 pb-2 font-bold border-b border-gray-200">
          Showing {{ searchElements.length }} of {{ Elements.length }} results
        </li>
        <li v-for="country in searchElements" :key="country" @click="selectCountry(country)" class="cursor-pointer hover:bg-gray-100 p-1">
          {{ country }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">

import {Options, Vue} from 'vue-class-component'
import {Field} from 'vee-validate'

class Props {
  Elements: Array<any>
  fieldName: string
}

@Options({
  components: {
    Field
  }
})
export default class AutoComplete  extends Vue.with(Props){

  selectedCountry = ''
  searchElements: Array<any> = [] 
  searchTerm = ''

  // mounted(){
    //console.log(this.Elements);
  //}

  searchCountry(): void {
    let matches = 0
    if (this.searchTerm.length > 2) {
      this.searchElements = this.Elements.filter(country => {
        if (country.toLowerCase().includes(this.searchTerm.toLowerCase()) && matches < 5) {
          matches++
          return country
        }
      })
    }
  }

  selectCountry(country: string): void {
    this.selectedCountry = country
    this.searchTerm = country
  }
}
</script>