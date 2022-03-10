<template>
  <div class="bg-gray-50 min-w-screen min-h-screen flex justify-center items-center">
    <div class="max-w-xs relative space-y-3">
      <label for="search" class="text-gray-900">
        Type the name of a country to search
      </label>

      <Field type="text" id="search" :name="fieldName" v-model="searchTerm" @keyup="searchCountry" placeholder="Type here..." class="p-3 mb-0.5 w-full border border-gray-300 rounded"/>

      <ul v-if="searchCountries.length > 1" class="w-full rounded bg-white border border-gray-300 px-4 py-2 space-y-1 absolute z-10">
        <li class="px-1 pt-1 pb-2 font-bold border-b border-gray-200">
          Showing {{ searchCountries.length }} of {{ countries.length }} results
        </li>
        <li v-for="country in searchCountries" :key="country" @click="selectCountry(country)" class="cursor-pointer hover:bg-gray-100 p-1">
          {{ country }}
        </li>
      </ul>

      <p v-if="selectedCountry" class="text-lg pt-2 absolute">
        You have selected: <span class="font-semibold">{{ selectedCountry }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">

import {Options, Vue} from 'vue-class-component'

@Options({
  components: {
    Field
  },
})

class Props {
  countries: Array<any>
  searchTerm: string
  fieldName: string
}

export default class AutoComplete  extends Vue.with(Props){

  selectedCountry = ''
  searchCountries: Array<any> = []

  searchCountry(): void {
    let matches = 0
    if (this.searchTerm.length > 2) {
      this.searchCountries = this.countries.filter(country => {
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