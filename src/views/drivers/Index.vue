<template>
  <div class="mx-3">
      <div class="card mb-4">
      <div class="pt-3 d-inline-flex mx-3">
        <h6 class="col-6 col-lg-9 ms-2">{{ $t('common.models.drivers', 2) }}</h6>
        <div class="col-6 col-lg-3 d-flex justify-content-end">
          <div class="form-group me-2 w-100">
            <Field name="driver" type="search" v-slot="{ field, errorMessage, meta }" v-model="searchDriver">
              <input class="form-control form-control-sm me-2" type="search" v-model="field.value"
                     :placeholder="$t('common.placeholders.search')" v-bind="field" autocomplete="off"/>
              <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
            </Field>
          </div>
          <router-link :to="{ name: 'drivers.create'}" tag="a" class="btn btn-sm btn-primary btn-rounded float-end"
                       data-original-title="Create Driver">
            <em class="fas fa-plus"></em>
          </router-link>
        </div>
      </div>
      <div class="card-body px-0 pt-0 pb-2">
        <div class="table-responsive p-0">
          <table class="table align-items-center mb-0">
            <caption hidden></caption>
            <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('common.fields.name') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('common.fields.phone') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('drivers.fields.vehicle') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('drivers.fields.plate') }}</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{{ $t('common.fields.status') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="driver in paginatedDrivers" :key="driver.id">
              <td>
                <div class="d-flex px-2 py-1">
                  <div>
                    <img :src="driver.photoUrl" class="avatar avatar-sm me-3" alt="Profile image">
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ driver.name }}</h6>
                    <p class="text-xs text-secondary mb-0">{{ driver.email }}</p>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ driver.phone }}</p>
              </td>
              <td>
                <div class="d-flex px-2 py-1">
                  <div>
                    <img :src="driver.vehicle.photoUrl" class="avatar avatar-sm me-3" alt="Profile image">
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ driver.vehicle.brand }}</h6>
                    <p class="text-xs text-secondary mb-0">{{ driver.vehicle.model }}</p>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ driver.vehicle.plate }}</p>
              </td>
              <td class="align-middle text-center text-sm">
                <span class="badge badge-sm bg-gradient-success">{{ $t(driver.enabled_at ? 'common.fields.enabled' : 'common.fields.disabled') }}</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">{{ format(driver.created_at) }}</span>
              </td>
              <td class="align-middle">
                <router-link :to="{ name: 'drivers.edit', params: {id: driver.id}}" tag="a" class="btn btn-sm btn-dark btn-rounded px-2 py-1 mb-1" data-original-title="Edit Driver">
                  <em class="fas fa-pencil"></em>
                </router-link>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="container text-center mt-2">
            <Paginator :data="filteredDrivers" :perPage="10" @paginatedData="getPaginatedData"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DateHelper from '@/helpers/DateHelper'
import Paginator from '@/components/Paginator.vue'
import {useDriversStore} from '@/services/stores/DriversStore'
import {Field} from 'vee-validate'
import Driver from '@/models/Driver'
import {onMounted, ref, Ref, watch} from 'vue'

const {drivers, filterByPlate} = useDriversStore()
const paginatedDrivers: Ref<Array<Driver>> = ref([])
const filteredDrivers: Ref<Array<Driver>> = ref([])
const searchDriver: Ref<string> = ref('')

function format(unix: number): string {
  return DateHelper.unixToDate(unix, 'YYYY-MM-DD')
}

function getPaginatedData(data: []): void {
  paginatedDrivers.value = data
}

watch(drivers, (newDrivers) => {
  filteredDrivers.value.splice(0, filteredDrivers.value.length)
  newDrivers.forEach(driver => filteredDrivers.value.push(driver))
})

watch(searchDriver, (plate) => {
  filteredDrivers.value.splice(0, filteredDrivers.value.length)
  filterByPlate(plate).forEach(driver => filteredDrivers.value.push(driver))
})

onMounted(() => {
  drivers.forEach(driver => filteredDrivers.value.push(driver))
})
</script>