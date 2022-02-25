<template>
  <div class="card">
    <table class="table table-sm table-borderless">
      <caption hidden></caption>
      <thead>
      <th>{{ $t('services.fields.hour') }}</th>
      <th>{{ $t('services.fields.status') }}</th>
      <th>{{ $t('services.fields.start_address') }}</th>
      <th>{{ $t('services.fields.phone') }}</th>
      <th>{{ $t('services.fields.name') }}</th>
      <th></th>
      </thead>
      <tbody>
      <tr v-for="service of services" :key="service.id">
        <td>{{ format(service.created_at) }}</td>
        <td>{{ service.status }}</td>
        <td>{{ service.start_address }}</td>
        <td>{{ service.phone }}</td>
        <td>{{ service.name }}</td>
        <td>actions</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-class-component'
import {ServiceInterface} from '@/entities/ServiceInterface'
import DateHelper from '@/helpers/DateHelper'

class Props {
  services: Array<ServiceInterface>
}

export default class ServicesTable extends Vue.with(Props) {

  format(unix: number): string {
    return DateHelper.unixToDate(unix, 'HH:mm:ss')
  }
}
</script>