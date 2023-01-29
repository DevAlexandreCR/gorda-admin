<template>
  <div>
    <div class="card mb-2">
        <div class="row mx-2 mt-2">
          <div class="col col-md-2 text-bold">{{ $t('common.filters.title') }}</div>
          <div class="col col-md-4">
          </div>
          <div class="col col-md-4"></div>
          <div class="col col-md-2 text-end">
            <button class="btn btn-sm btn-light" data-bs-toggle="collapse" data-bs-target="#collapse-filter"
               aria-expanded="false" aria-controls="collapse-filter">
              <em class="fa-solid fa-bars"></em>
            </button>
          </div>
        </div>
      <div class="card-body collapse" id="collapse-filter">
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
    <div class="row my-2">
      <div class="col col-sm-4">
        <div class="card">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-sm-10">
                <div class="numbers">
                  <p class="text-sm mb-0 text-capitalize font-weight-bold">{{ $t('services.total') }}</p>
                  <h5 class="font-weight-bolder mb-0">
                    {{ history.length }}
<!--                    <span class="text-success text-sm font-weight-bolder">{{ completedPercent + '%' }}</span>-->
                  </h5>
                </div>
              </div>
              <div class="col-sm-2 text-end">
                <div class="icon icon-shape bg-gradient-light shadow text-center border-radius-md">
                  <em class="fa-solid fa-arrow-up-wide-short fa-2x mt-2"></em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col col-sm-4">
        <div class="card">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-sm-10">
                <div class="numbers">
                  <p class="text-sm mb-0 text-capitalize font-weight-bold">{{ $t('services.statuses.terminated') }}</p>
                  <h5 class="font-weight-bolder mb-0">
                    {{ completed }}
                    <span class="text-success text-sm font-weight-bolder">{{ completedPercent + '%' }}</span>
                  </h5>
                </div>
              </div>
              <div class="col-sm-2 text-end">
                <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                  <em class="fa-solid fa-thumbs-up fa-2x mt-2 text-light"></em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-sm-10">
                <div class="numbers">
                  <p class="text-sm mb-0 text-capitalize font-weight-bold">{{ $t('services.statuses.canceled') }}</p>
                  <h5 class="font-weight-bolder mb-0">
                    {{ canceled }}
                    <span class="text-success text-sm font-weight-bolder">{{ canceledPercent + '%' }}</span>
                  </h5>
                </div>
              </div>
              <div class="col-sm-2 text-end">
                <div class="icon icon-shape bg-gradient-danger shadow text-center text-light border-radius-md">
                  <em class="fa-solid fa-ban fa-2x mt-2"></em>
                </div>
              </div>
            </div>
          </div>
        </div>
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
import Service from '@/models/Service'
import {computed} from 'vue'

const driverStore = useDriversStore()
const {drivers} = storeToRefs(driverStore)
const {getHistoryServices} = useServicesStore()
const {history, filter} = storeToRefs(useServicesStore())

const schema = object().shape({
  from: date().required(),
  to: date().required()
})

const completed = computed(() =>
    history.value.filter(s => s.status === Service.STATUS_TERMINATED).length
)

const completedPercent = computed(() =>
    isWhatPercent(completed.value)
)

const canceled = computed(() =>
    history.value.filter(s => s.status === Service.STATUS_CANCELED).length
)

const canceledPercent = computed(() =>
    isWhatPercent(canceled.value)
)

function isWhatPercent(x: number): number {
  return Math.round((x / history.value.length) * 100)
}

function getServices(): void {
  getHistoryServices()
}
</script>