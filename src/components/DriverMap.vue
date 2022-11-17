<template>
  <div class="row row-cols-2 w-100">
    <div class="col-9"><p>{{ $t('common.models.drivers_connected') }} <span class="badge bg-secondary">{{filteredDrivers.length}}</span></p></div>
    <div class="form-group col-3">
      <Field name="driver" type="search" v-slot="{ field, errorMessage, meta }" v-model="searchDriver">
        <input class="form-control form-control-sm me-2" type="search" v-model="field.value"
               :placeholder="$t('common.placeholders.search')" v-bind="field" autocomplete="off"/>
        <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
      </Field>
    </div>
  </div>
  <div class="row min-vh-75">
    <Map :places="filteredDrivers" :icon="icon"/>
  </div>
</template>

<script setup lang="ts">
import {ref, Ref, watch} from 'vue'
import {useDriversStore} from '@/services/stores/DriversStore'
import {Field} from 'vee-validate'
import Map from '@/components/maps/Map.vue'
import {PlaceInterface} from '@/types/PlaceInterface'

const {connectedDrivers} = useDriversStore()
const searchDriver: Ref<string> = ref('')
const filteredDrivers: Ref<Array<PlaceInterface>> = ref([])
const icon: Ref<string> = ref(process.env.VUE_APP_DRIVER_LOC_IMAGE_URL as string)
let filtering = false

watch(searchDriver, (plate) => {
  if (plate.length > 0) {
    filtering = true
    const filtered = connectedDrivers.filter(place => place.name.toLowerCase().includes(plate.toLowerCase()))
    filteredDrivers.value.splice(0, filteredDrivers.value.length)
    filtered.forEach(driver => filteredDrivers.value.push(driver))
  } else {
    filtering = false
    connectedDrivers.forEach(driver => filteredDrivers.value.push(driver))
  }
})

watch(connectedDrivers, (newConnectedDrivers) => {
  if (!filtering) {
    if (filteredDrivers.value.length <= newConnectedDrivers.length) {
      const intersections = newConnectedDrivers.filter(driver => filteredDrivers.value.indexOf(driver) === -1)
      intersections.forEach(driver => { 
        const currents = filteredDrivers.value.filter(dri => dri.key === driver.key)
        if (currents.length === 1) {
          const index = filteredDrivers.value.indexOf(currents[0])
          filteredDrivers.value[index] = driver
        } else {
          filteredDrivers.value.push(driver)
        }
      })
      } else {
      const intersections = filteredDrivers.value.filter(driver => newConnectedDrivers.indexOf(driver) === -1)
      intersections.forEach(driver => {
        const currents = filteredDrivers.value.filter(dri => dri.key === driver.key)
        currents.forEach(current => {
          const index = filteredDrivers.value.indexOf(current)
          filteredDrivers.value.splice(index, 1)
        })
      })      
      }
    }
})
</script>