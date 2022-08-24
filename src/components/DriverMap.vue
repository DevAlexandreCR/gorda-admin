<template>
  <div class="row row-cols-2">
    <div class="col-8">Drivers</div>
    <div class="form-group col-4">
      <Field name="driver" type="search" v-slot="{ field, errorMessage, meta }" v-model="searchDriver">
        <input class="form-control form-control-sm me-2" type="search" v-model="field.value"
               :placeholder="$t('common.placeholders.search')" v-bind="field" autocomplete="off"/>
        <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
      </Field>
    </div>
  </div>
  <Map :/>
</template>

<script setup lang="ts">
import {onMounted, ref, Ref, watch} from 'vue'
import Driver from '@/models/Driver'
import {useDriversStore} from '@/services/stores/DriversStore'
import {Field} from 'vee-validate'
import Map from '@/components/maps/Map.vue'
import {PlaceInterface} from '@/types/PlaceInterface'

const {drivers, filterByPlate} = useDriversStore()
const searchDriver: Ref<string> = ref('')
const filteredDrivers: Ref<Array<PlaceInterface>> = ref([])

watch(drivers, (newDrivers) => {
  filteredDrivers.value.splice(0, filteredDrivers.value.length)
  newDrivers.forEach(driver => filteredDrivers.value.push(driver))
})

watch(searchDriver, (plate) => {
  filteredDrivers.value.splice(0, filteredDrivers.value.length)
  filterByPlate(plate).forEach(driver => filteredDrivers.value.push(driver))
})

onMounted(() => {
  drivers.forEach(driver => filteredDrivers.value.push({
    key: driver.id,
    name: driver.vehicle.plate
  }))
})
</script>