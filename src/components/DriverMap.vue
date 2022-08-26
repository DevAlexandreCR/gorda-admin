<template>
  <div class="row row-cols-2 w-100">
    <div class="col-9">Drivers</div>
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
import {onMounted, ref, Ref, watch} from 'vue'
import {useDriversStore} from '@/services/stores/DriversStore'
import {Field} from 'vee-validate'
import Map from '@/components/maps/Map.vue'
import {PlaceInterface} from '@/types/PlaceInterface'

const {getOnlineDrivers, connectedDrivers} = useDriversStore()
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

watch(connectedDrivers, (newDrivers) => {
  if (!filtering) {
    if (filteredDrivers.value.length <= newDrivers.length) {
      newDrivers.forEach((driver, index) => {
        const indexDriver = filteredDrivers.value.findIndex(dri => dri.key === driver.key)
        if (indexDriver > 0) {
          filteredDrivers.value[indexDriver] = driver
        } else {
          filteredDrivers.value[index] = driver
        }
      })
    } else {
      filteredDrivers.value.forEach((filtered, index) => {
        const indexDriver = newDrivers.findIndex(connected => connected.key === filtered.key)
        if (indexDriver < 0) filteredDrivers.value.splice(index, 1)
      })
    }
  }
})

onMounted(() => {
  getOnlineDrivers()
})
</script>