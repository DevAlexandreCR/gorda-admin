<template>
  <div class="container-fluid">
    <div class="card mb-4">
      <div class="modal-header pb-0">
        <h6>{{ $t('common.models.drivers', 2) }}</h6>
        <router-link :to="{ name: 'drivers.create'}" tag="a" class="btn btn-sm btn-primary btn-rounded" data-original-title="Create Driver">
          <em class="fas fa-plus"></em>
        </router-link>
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
            <tr v-for="driver in drivers" :key="driver.id">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DateHelper from "@/helpers/DateHelper";
import {useDriversStore} from '@/services/stores/DriversStore'
import {storeToRefs} from 'pinia'

const driverStore = useDriversStore()
const {drivers} = storeToRefs(driverStore)

function format(unix: number): string {
  return DateHelper.unixToDate(unix, 'YYYY-MM-DD')
}
</script>