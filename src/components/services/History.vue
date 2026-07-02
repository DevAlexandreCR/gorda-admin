<template>
  <div class="gorda-history">
    <div class="card mb-2 gorda-history__filter-card">
      <div class="gorda-history__filter-header">
        <div class="gorda-history__filter-title">
          <span class="gorda-history__filter-icon-chip">
            <em class="fa-solid fa-filter"></em>
          </span>
          <h6 class="gorda-history__filter-heading">{{ $t('common.filters.title') }}</h6>
        </div>
        <button class="gorda-history__filter-toggle" data-bs-toggle="collapse" data-bs-target="#collapse-filter"
          aria-expanded="true" aria-controls="collapse-filter">
          <em class="fa-solid fa-chevron-up"></em>
        </button>
      </div>
      <div class="card-body collapse show" id="collapse-filter">
        <Form @submit="getServices" :validation-schema="schema" @keydown.enter="$event.preventDefault()">
          <div class="row align-items-end">
            <div class="col-md-2">
              <label class="gorda-history__label" for="from">{{ $t('common.filters.driver_plate') }}</label>
              <AutoComplete :idField="'field-driver'" :elements="plates" @selected="onDriverSelected"
                :placeholder="$t('common.filters.driver_plate')" :fieldName="'driver'" :key="plate"
                :classes="'form-control form-control-sm'" />
            </div>
            <div class="col-md-2">
              <label class="gorda-history__label" for="from">{{ $t('common.filters.number_client') }}</label>
              <AutoComplete :idField="'field-client'" :elements="clientsPhone" @selected="onClientSelected" @on-change="onClientInput" :key="clientPhone"
                :search-handler="searchClientsAutocomplete"
                :placeholder="$t('common.filters.number_client')" :fieldName="'client'"
                :normalizer="StrHelper.formatNumber" :classes="'form-control form-control-sm'" :disabled="!clientsReady"/>
            </div>
            <div class="col-md-2">
              <label class="gorda-history__label" for="from">{{ $t('common.filters.from') }}</label>
              <Field name="from" type="date" v-model="filter.from" v-slot="{ field, errorMessage, meta }">
                <input class="form-control form-control-sm" type="date" v-model="field.value"
                  :placeholder="$t('drivers.placeholders.tec_exp')" id="from" aria-label="Pec_from"
                  aria-describedby="from-addon" v-bind="field" :fieldName="'from'" autocomplete="none" />
                <span class="is-invalid" v-if="errorMessage && meta.dirty">{{ errorMessage }}</span>
              </Field>
            </div>
            <div class="col-md-2">
              <label class="gorda-history__label" for="to">{{ $t('common.filters.until') }}</label>
              <Field name="to" type="date" v-model="filter.to" v-slot="{ field, errorMessage, meta }">
                <input class="form-control form-control-sm" type="date" v-model="field.value"
                  :placeholder="$t('drivers.placeholders.tec_exp')" id="to" aria-label="Pec_to"
                  aria-describedby="to-addon" v-bind="field" autocomplete="none" />
                <span class="is-invalid" v-if="errorMessage && meta.dirty">{{ errorMessage }}</span>
              </Field>
            </div>
            <div class="col-md-4">
              <div class="d-flex">
                <button class="btn gorda-history__btn-filter me-2" type="submit" name="submit">{{ $t('common.actions.filter') }}</button>
                <button class="btn gorda-history__btn-clear me-2" type="button" name="clear" @click="clearFilters">{{$t('common.actions.clear_filters') }}</button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
    <div class="row my-2">
      <div class="col-12 col-md-4 my-1 my-md-0">
        <div class="card gorda-history__stat-card">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-9 col-sm-10">
                <div class="numbers">
                  <p class="gorda-history__stat-label">{{ $t('services.total') }}</p>
                  <h5 class="gorda-history__stat-value">
                    {{ pagination.totalCount }}
                  </h5>
                  <span class="gorda-history__stat-delta">{{ $t('services.title', pagination.totalCount) }}</span>
                </div>
              </div>
              <div class="col-3 col-sm-2 text-end">
                <div class="icon icon-shape bg-gradient-dark shadow text-center border-radius-md">
                  <em class="fa-solid text-light fa-arrow-up-wide-short fa-2x mt-2"></em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 my-1 my-md-0">
        <div class="card gorda-history__stat-card">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-9 col-sm-10">
                <div class="numbers">
                  <p class="gorda-history__stat-label">{{ $t('services.statuses.terminated') }}</p>
                  <h5 class="gorda-history__stat-value">
                    {{ completed }}
                  </h5>
                  <span class="gorda-history__stat-delta">{{ completedPercent + '%' }}</span>
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
        <div class="card gorda-history__stat-card">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-9 col-sm-10">
                <div class="numbers">
                  <p class="gorda-history__stat-label">{{ $t('services.statuses.canceled') }}</p>
                  <h5 class="gorda-history__stat-value">
                    {{ canceled }}
                  </h5>
                  <span class="gorda-history__stat-delta">{{ canceledPercent + '%' }}</span>
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
    <ServicesTable @showService="show"  :table="Tables.history" :services="history" :pagination="pagination" @paginate="paginateData"></ServicesTable>
    <ShowServiceModal :key="selectedService.id" v-if="selectedService" :service="selectedService"></ShowServiceModal>
  </div>
</template>

<script setup lang="ts">

import ServicesTable from '@/components/services/ServicesTable.vue'
import {storeToRefs} from 'pinia'
import {useServicesStore} from '@/services/stores/ServiceStore'
import {Field, Form} from 'vee-validate'
import {date, object} from 'yup'
import {computed, onBeforeMount, ref, Ref, watch, watchEffect, nextTick} from 'vue'
import DateHelper from '@/helpers/DateHelper'
import {StrHelper} from '@/helpers/StrHelper'
import {Tables} from '@/constants/Tables'
import AutoComplete from '@/components/AutoComplete.vue'
import {useDriversStore} from '@/services/stores/DriversStore'
import {AutoCompleteType} from '@/types/AutoCompleteType'
import {useClientsStore} from '@/services/stores/ClientsStore'
import {ServiceCursor} from "@/types/ServiceCursor"
import Service from '@/models/Service'
import ShowServiceModal from '@/components/services/ShowServiceModal.vue'
import {Modal} from 'bootstrap'
import {ServiceList} from '@/models/ServiceList'

const { getHistoryServices, resetCursor } = useServicesStore()
const { history, pagination, completed, canceled, currentCursor } = storeToRefs(useServicesStore())
const { drivers } = useDriversStore()
const clientsStore = useClientsStore()
const { isReady: clientsReady } = storeToRefs(clientsStore)
const { filter } = storeToRefs(useServicesStore())
const plates: Ref<Array<AutoCompleteType>> = ref([])
const clientsPhone: Ref<Array<AutoCompleteType>> = ref([])
const plate: Ref<number> = ref(0)
const clientPhone: Ref<number> = ref(0)
let selectedService = ref<ServiceList|null>(null)

const schema = object().shape({
  from: date().required(),
  to: date().required()
})

const completedPercent = computed(() =>
  isWhatPercent(completed.value)
)

const canceledPercent = computed(() =>
  isWhatPercent(canceled.value)
)

watch(() => pagination.value.perPage, async () => {
  resetCursor()
  pagination.value.currentPage = 1
  await getHistoryServices()
})

watchEffect(async () => {
  plates.value = drivers
    .filter(driver => driver.id && driver.vehicle?.plate)
    .map(driver => ({ id: driver.id as string, value: driver.vehicle!.plate }))
})

onBeforeMount(async () => {
  pagination.value.cursor = currentCursor.value
  await getHistoryServices(true, true)
})

function onDriverSelected(element: AutoCompleteType): void {
  filter.value.driverId = element.id
  const input = document.querySelector('input[name="driver"]') as HTMLInputElement
  input?.blur()
}

function onClientSelected(element: AutoCompleteType): void {
  filter.value.clientId = element.id
  const input = document.querySelector('input[name="client"]') as HTMLInputElement
  input?.blur()
}

async function onClientInput(term: string): Promise<void> {
  if (term.length <= 2) {
    filter.value.clientId = null
    clientsPhone.value = []
  }
}

async function searchClientsAutocomplete(term: string): Promise<Array<AutoCompleteType>> {
  const results = await clientsStore.searchClients(term, 10)
  clientsPhone.value = results.map(client => ({
    id: client.id,
    value: client.phone
  }))
  return clientsPhone.value
}

async function clearFilters(): Promise<void> {
  filter.value.from = DateHelper.stringNow()
  filter.value.to = DateHelper.stringNow()
  filter.value.clientId = null
  filter.value.driverId = null
  clientPhone.value++
  plate.value++
  resetCursor()
  await getHistoryServices()
}

function isWhatPercent(x: number): number {
  return Math.round((x / (pagination.value.totalCount === 0 ? 1 : pagination.value.totalCount)) * 100)
}

async function getServices(): Promise<void> {
  resetCursor()
  await getHistoryServices()
}

async function show(service: Service): Promise<void> {
  selectedService.value = service
  await nextTick()
  const modalShow = document.getElementById('showServiceModal')
  const modal = new Modal(modalShow?? 'showServiceModal')
  modal.show()
}

async function paginateData(page: number, cursor: ServiceCursor, next: boolean): Promise<void> {
  pagination.value.cursor = cursor
  pagination.value.currentPage = page
  await getHistoryServices(next)
}
</script>

<style scoped>
.gorda-history {
  --history-label-color: var(--text-secondary);
  --history-stat-label: var(--text-secondary);
  --history-stat-value: var(--text-heading);
  --history-clear-bg: var(--surface-input);
  --history-clear-border: var(--border-color);
  --history-clear-color: var(--text-heading);
  --history-toggle-bg: var(--surface-input);
  --history-toggle-border: var(--border-color);
  --history-toggle-color: var(--text-secondary);
}
body.dark-version .gorda-history {
  --history-label-color: var(--text-secondary);
  --history-stat-label: var(--text-secondary);
  --history-stat-value: var(--text-heading);
  --history-clear-bg: var(--surface-input);
  --history-clear-border: var(--border-color);
  --history-clear-color: var(--text-heading);
  --history-toggle-bg: var(--surface-input);
  --history-toggle-border: var(--border-color);
  --history-toggle-color: var(--text-secondary);
}

.gorda-history__filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-subtle);
}

.gorda-history__filter-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.gorda-history__filter-icon-chip {
  width: 30px;
  height: 30px;
  border-radius: 0.45rem;
  flex: none;
  background: linear-gradient(310deg, #7928ca, #ff0080);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.75rem;
}

.gorda-history__filter-heading {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-heading);
}

.gorda-history__filter-toggle {
  width: 34px;
  height: 34px;
  border-radius: 0.5rem;
  border: 1px solid var(--history-toggle-border);
  background: var(--history-toggle-bg);
  color: var(--history-toggle-color);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gorda-history__label {
  display: block;
  text-transform: uppercase;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.04rem;
  color: var(--history-label-color);
  margin-bottom: 0.25rem;
}

.gorda-history #collapse-filter .form-group {
  margin-bottom: 0;
}

.gorda-history #collapse-filter :deep(.form-control) {
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--surface-input);
  padding: 0.6rem 0.9rem;
}

.gorda-history #collapse-filter :deep(.form-control:focus) {
  box-shadow: 0 0 0 2px rgba(203, 12, 159, .15);
}

.gorda-history__btn-filter,
.gorda-history__btn-clear {
  padding: 0.6rem 1.25rem;
  line-height: 1.4;
}

.gorda-history__btn-filter {
  background: linear-gradient(310deg, #7928ca, #ff0080);
  color: #fff;
  border: none;
  box-shadow: 0 4px 12px rgba(121, 40, 202, 0.35);
}

.gorda-history__btn-filter:hover {
  color: #fff;
}

.gorda-history__btn-clear {
  background: var(--history-clear-bg);
  color: var(--history-clear-color);
  border: 1px solid var(--history-clear-border);
}

.gorda-history__stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.03rem;
  color: var(--history-stat-label);
  margin-bottom: 0.25rem;
}

.gorda-history__stat-value {
  font-weight: 700;
  color: var(--history-stat-value);
  margin-bottom: 0.15rem;
}

.gorda-history__stat-delta {
  color: #82d616;
  font-size: 0.75rem;
  font-weight: 700;
}
</style>
