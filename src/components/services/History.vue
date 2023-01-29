<template>
  <div>
    <div class="card card-frame mb-2">
      <div class="card-header text-bold">{{ $t('common.filters.title') }}</div>
      <div class="card-body">
        <Form @submit="getServices" :validation-schema="schema">
          <div class="row">
            <div class="col-md-4">
              <label class="form-control-label" for="from">{{ $t('common.filters.from') }}</label>
              <Field name="from" type="date" v-model="filter.from" v-slot="{ field, errorMessage, meta }">
                <input class="form-control form-control-sm" type="date" v-model="field.value" :placeholder="$t('drivers.placeholders.tec_exp')"
                       id="from" aria-label="Pec_from" aria-describedby="from-addon" v-bind="field" autocomplete="none"/>
                <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
              </Field>
            </div>
            <div class="col-md-4">
              <label class="form-control-label" for="to">{{ $t('common.filters.until') }}</label>
              <Field name="to" type="date" v-model="filter.to" v-slot="{ field, errorMessage, meta }">
                <input class="form-control form-control-sm" type="date" v-model="field.value" :placeholder="$t('drivers.placeholders.tec_exp')"
                       id="to" aria-label="Pec_to" aria-describedby="to-addon" v-bind="field" autocomplete="none"/>
                <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
              </Field>
            </div>
            <div class="col-md-4">
              <label class="form-control-label" for="submit"></label>
              <div class="form-group">
                <button class="btn btn-sm btn-info mt-1" name="submit">{{ $t('common.actions.filter') }}</button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
    <services-table :drivers="drivers" :isHistory="true" :services="history"></services-table>
  </div>
</template>

<script setup lang="ts">

import ServicesTable from '@/components/services/ServicesTable.vue'
import {storeToRefs} from 'pinia'
import {useDriversStore} from '@/services/stores/DriversStore'
import {useServicesStore} from '@/services/stores/ServiceStore'
import {Form, Field} from 'vee-validate'
import {object, date} from 'yup'

const driverStore = useDriversStore()
const {drivers} = storeToRefs(driverStore)
const {getHistoryServices} = useServicesStore()
const {history, filter} = storeToRefs(useServicesStore())

const schema = object().shape({
  from: date().required(),
  to: date().required()
})

function getServices(): void {
  getHistoryServices()
}
</script>