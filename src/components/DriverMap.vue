<template>
  <div class="row row-cols-2 w-100">
    <div class="col-8">Drivers</div>
    <div class="form-group col-4">
      <Field name="driver" type="search" v-slot="{ field, errorMessage, meta }" v-model="searchDriver">
        <input class="form-control form-control-sm me-2" type="search" v-model="field.value"
               :placeholder="$t('common.placeholders.search')" v-bind="field" autocomplete="off"/>
        <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
      </Field>
    </div>
  </div>
  <div class="row min-vh-75">
    <Map :places="filteredDrivers"/>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, Ref, watch} from 'vue'
import {useDriversStore} from '@/services/stores/DriversStore'
import {Field} from 'vee-validate'
import Map from '@/components/maps/Map.vue'
import {PlaceInterface} from '@/types/PlaceInterface'
import Driver from '@/models/Driver'
import {DriverConnectedInterface} from '@/types/DriverConnectedInterface'

const {drivers, filterByPlate, getOnlineDrivers, findById} = useDriversStore()
const searchDriver: Ref<string> = ref('')
const filteredDrivers: Ref<Array<PlaceInterface>> = ref([])

watch(searchDriver, (plate) => {
  filteredDrivers.value.splice(0, filteredDrivers.value.length)
  // filterByPlate(plate).forEach(driver => filteredDrivers.value.push(driver))
})

function onDriverConnected(partialDriver: DriverConnectedInterface): void {
  const driver = findById(partialDriver.id??'') ?? new Driver()
  filteredDrivers.value.push({
    key: driver.id,
    name: driver.vehicle.plate,
    lat: partialDriver.location?.lat?? 0,
    lng: partialDriver.location?.lng?? 0
  })
}

function onDriverChanged(partialDriver: DriverConnectedInterface): void {
  const driver = findById(partialDriver.id??'') ?? new Driver()
  const index = filteredDrivers.value.findIndex(dri => dri.key === partialDriver.id)
  filteredDrivers.value[index] = {
    key: driver.id,
    name: driver.vehicle.plate,
    lat: partialDriver.location?.lat?? 0,
    lng: partialDriver.location?.lng?? 0
  }
}

function onDriverDisconnected(driver: DriverConnectedInterface): void {
  const index = filteredDrivers.value.findIndex(dri => dri.key === driver.id)
  filteredDrivers.value.splice(index, 1)
}

onMounted(() => {
  getOnlineDrivers(onDriverConnected, onDriverChanged, onDriverDisconnected)
})
</script>