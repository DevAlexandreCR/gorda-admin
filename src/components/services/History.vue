<template>
  <div>
    <div class="card card-frame mb-2">
      <div class="card-header">{{ $t('commons.filters') }}</div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com">
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <input type="text" placeholder="Regular" class="form-control" disabled/>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <div class="input-group mb-4">
                <span class="input-group-text"><i class="ni ni-zoom-split-in"></i></span>
                <input class="form-control" placeholder="Search" type="text">
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <div class="input-group mb-4">
                <input class="form-control" placeholder="Birthday" type="text">
                <span class="input-group-text"><i class="ni ni-zoom-split-in"></i></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <services-table :drivers="props.drivers" :isHistory="true" :services="props.services"></services-table>
  </div>
</template>

<script setup lang="ts">

import Service from '@/models/Service'
import Driver from '@/models/Driver'
import ServicesTable from '@/components/services/ServicesTable.vue'

interface Props {
  services: Array<Service>
  drivers: Array<Driver>
}

const props = defineProps<Props>()

</script>