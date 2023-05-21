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
               aria-expanded="true" aria-controls="collapse-filter">
              <em class="fa-solid fa-bars"></em>
            </button>
          </div>
        </div>
      <div class="card-body collapse show" id="collapse-filter">
        <Form @submit="getServices" :validation-schema="schema" @keydown.enter="$event.preventDefault()">
          <div class="row">
            <div class="col-md-2">
              <div class="form-group">
                <label class="form-control-label" for="from">{{ $t('common.filters.driver_plate') }}</label>
                <AutoComplete :idField="'field-driver'" :elements="plates" @selected="onDriverSelected" :key="'driverId'"
                              :placeholder="$t('common.filters.driver_plate')" :fieldName="'driver'"
                :classes="'form-control form-control-sm'"/>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label class="form-control-label" for="from">{{ $t('common.filters.number_client') }}</label>
                <AutoComplete :idField="'field-client'" :elements="clientsPhone" @selected="onClientSelected" :key="'clientId'"
                              :placeholder="$t('common.filters.number_client')" :fieldName="'client'"
                              :normalizer="StrHelper.formatNumber" :classes="'form-control form-control-sm'"/>
              </div>
            </div>
            <div class="col-md-2">
              <label class="form-control-label" for="from">{{ $t('common.filters.from') }}</label>
              <Field name="from" type="date" v-model="filter.from" v-slot="{ field, errorMessage, meta }">
                <input class="form-control form-control-sm" type="date" v-model="field.value" :placeholder="$t('drivers.placeholders.tec_exp')"
                       id="from" aria-label="Pec_from" aria-describedby="from-addon" v-bind="field" autocomplete="none"/>
                <span class="is-invalid" v-if="errorMessage && meta.dirty">{{ errorMessage }}</span>
              </Field>
            </div>
            <div class="col-md-2">
              <label class="form-control-label" for="to">{{ $t('common.filters.until') }}</label>
              <Field name="to" type="date" v-model="filter.to" v-slot="{ field, errorMessage, meta }">
                <input class="form-control form-control-sm" type="date" v-model="field.value" :placeholder="$t('drivers.placeholders.tec_exp')"
                       id="to" aria-label="Pec_to" aria-describedby="to-addon" v-bind="field" autocomplete="none"/>
                <span class="is-invalid" v-if="errorMessage && meta.dirty">{{ errorMessage }}</span>
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
      <div class="col-12 col-md-4 my-1 my-md-0">
        <div class="card">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-9 col-sm-10">
                <div class="numbers">
                  <p class="text-sm mb-0 text-capitalize font-weight-bold">{{ $t('services.total') }}</p>
                  <h5 class="font-weight-bolder mb-0">
                    {{ filteredServices.length }}
                    <span class="text-success text-sm font-weight-bolder">{{ $t('services.title', filteredServices.length) }}</span>
                  </h5>
                </div>
              </div>
              <div class="col-3 col-sm-2 text-end">
                <div class="icon icon-shape bg-gradient-light shadow text-center border-radius-md">
                  <em class="fa-solid fa-arrow-up-wide-short fa-2x mt-2"></em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 my-1 my-md-0">
        <div class="card">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-9 col-sm-10">
                <div class="numbers">
                  <p class="text-sm mb-0 text-capitalize font-weight-bold">{{ $t('services.statuses.terminated') }}</p>
                  <h5 class="font-weight-bolder mb-0">
                    {{ completed }}
                    <span class="text-success text-sm font-weight-bolder">{{ completedPercent + '%' }}</span>
                  </h5>
                </div>
              </div>
              <div class="col-3 col-sm-2 text-end">
                <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                  <em class="fa-solid text-light fa-thumbs-up fa-2x mt-2"></em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 my-1 my-md-0">
        <div class="card">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-9 col-sm-10">
                <div class="numbers">
                  <p class="text-sm mb-0 text-capitalize font-weight-bold">{{ $t('services.statuses.canceled') }}</p>
                  <h5 class="font-weight-bolder mb-0">
                    {{ canceled }}
                    <span class="text-success text-sm font-weight-bolder">{{ canceledPercent + '%' }}</span>
                  </h5>
                </div>
              </div>
              <div class="col-3 col-sm-2 text-end">
                <div class="icon icon-shape bg-gradient-danger shadow text-center text-light border-radius-md">
                  <em class="fa-solid fa-thumbs-down fa-2x mt-2"></em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <services-table :table="Tables.history" :services="filteredServices"></services-table>
  </div>
</template>

<script setup lang="ts">

import ServicesTable from '@/components/services/ServicesTable.vue'
import {storeToRefs} from 'pinia'
import {useServicesStore} from '@/services/stores/ServiceStore'
import {Field, Form} from 'vee-validate'
import {date, object} from 'yup'
import Service from '@/models/Service'
import {computed, onBeforeMount, ref, Ref, watch, watchEffect} from 'vue'
import DateHelper from '@/helpers/DateHelper'
import {ServiceList} from '@/models/ServiceList'
import {StrHelper} from '@/helpers/StrHelper'
import {Tables} from '@/constants/Tables'
import AutoComplete from '@/components/AutoComplete.vue'
import {useDriversStore} from '@/services/stores/DriversStore'
import {AutoCompleteType} from '@/types/AutoCompleteType'
import {useClientsStore} from '@/services/stores/ClientsStore'

const {getHistoryServices, history} = useServicesStore()
const {drivers} = useDriversStore()
const {clients, findById} = useClientsStore()
const {filter} = storeToRefs(useServicesStore())
const plates: Ref<Array<AutoCompleteType>> = ref([])
const clientsPhone: Ref<Array<AutoCompleteType>> = ref([])
const searchDriver: Ref<string> = ref('')
const searchClient: Ref<string> = ref('')
const filteredServices: Ref<Array<ServiceList>> = ref([])

const schema = object().shape({
  from: date().required(),
  to: date().required()
})

const completed = computed(() =>
    filteredServices.value.filter(s => s.status === Service.STATUS_TERMINATED).length
)

const completedPercent = computed(() =>
    isWhatPercent(completed.value)
)

const canceled = computed(() =>
    filteredServices.value.filter(s => s.status === Service.STATUS_CANCELED).length
)

const canceledPercent = computed(() =>
    isWhatPercent(canceled.value)
)

watch(history, (newDrivers) => {
  filteredServices.value.splice(0, filteredServices.value.length)
  newDrivers.forEach(service => filteredServices.value.push(service))
})

watchEffect(async () => {
  drivers.forEach(driver => {
    if (driver.id) plates.value.push({id: driver.id, value: driver.vehicle.plate})
  })

  clientsPhone.value = []
  clients.forEach(clientDB => {
    clientsPhone.value.push({
      id: clientDB.id,
      value: clientDB.phone
    })
  })
})

onBeforeMount(async () => {
  if (DateHelper.dateToUnix(filter.value.from) >= DateHelper.startOfDayUnix()) {
    const lastService = history[0]
    filter.value.from = DateHelper.unixToDate(lastService.created_at - 3600, 'YYYY-MM-DD HH:mm:ss')
    await getHistoryServices(true)
    history.forEach(service => filteredServices.value.push(service))
  }
})

function onDriverSelected(element: AutoCompleteType): void {
  filter.value.driverId = element.id
}

function onClientSelected(element: AutoCompleteType): void {
  filter.value.clientId = element.id
}

function filterServiceByClient(search: string): ServiceList[] {
  return history.filter(service => {
    const phone = StrHelper.formatNumber(service.phone)
    return phone.includes(search)
  })
}

function isWhatPercent(x: number): number {
  return Math.round((x / (filteredServices.value.length === 0 ? 1 : filteredServices.value.length)) * 100)
}

async function getServices(): Promise<void> {
  await getHistoryServices()
  searchClient.value = ''
  searchDriver.value = ''
}
</script>