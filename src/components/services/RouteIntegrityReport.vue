<template>
  <div class="gorda-route-integrity">
    <div class="card mb-2 gorda-route-integrity__filter-card">
      <div class="gorda-route-integrity__filter-header">
        <div class="gorda-route-integrity__filter-title">
          <span class="gorda-route-integrity__filter-icon-chip">
            <em class="fa-solid fa-filter"></em>
          </span>
          <h6 class="gorda-route-integrity__filter-heading">{{ $t('common.filters.title') }}</h6>
        </div>
      </div>
      <div class="card-body">
        <Form @submit="loadReport" :validation-schema="schema" @keydown.enter="$event.preventDefault()">
          <div class="row align-items-end">
            <div class="col-md-3">
              <label class="gorda-route-integrity__label" for="route-integrity-from">{{ $t('common.filters.from') }}</label>
              <Field name="from" type="date" v-model="filter.from" v-slot="{ field, errorMessage, meta }">
                <input class="form-control form-control-sm" type="date" v-model="field.value"
                  id="route-integrity-from" aria-label="route_integrity_from" v-bind="field" autocomplete="none" />
                <span class="is-invalid" v-if="errorMessage && meta.dirty">{{ errorMessage }}</span>
              </Field>
            </div>
            <div class="col-md-3">
              <label class="gorda-route-integrity__label" for="route-integrity-to">{{ $t('common.filters.until') }}</label>
              <Field name="to" type="date" v-model="filter.to" v-slot="{ field, errorMessage, meta }">
                <input class="form-control form-control-sm" type="date" v-model="field.value"
                  id="route-integrity-to" aria-label="route_integrity_to" v-bind="field" autocomplete="none" />
                <span class="is-invalid" v-if="errorMessage && meta.dirty">{{ errorMessage }}</span>
              </Field>
            </div>
            <div class="col-md-6">
              <button class="btn gorda-route-integrity__btn-filter me-2" type="submit" name="submit">
                {{ $t('common.actions.filter') }}
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>

    <div class="gorda-route-integrity__helper" role="note">
      <em class="fa-solid fa-circle-info gorda-route-integrity__helper-icon"></em>
      <span>{{ $t('services.route_integrity.helper_text') }}</span>
    </div>

    <div class="card gorda-route-integrity__table-card">
      <div class="gorda-table-header">
        <div class="d-flex align-items-center gap-2">
          <span class="gorda-table-header-icon" style="background: linear-gradient(310deg, #7928ca, #ff0080);">
            <em class="fas fa-route"></em>
          </span>
          <h6 class="gorda-table-header-title mb-0">{{ $t('services.route_integrity.title') }}</h6>
          <span class="gorda-table-header-count">{{ rows.length }}</span>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-sm table-borderless align-items-center mb-0">
          <caption hidden></caption>
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                {{ $t('services.route_integrity.fields.driver') }}
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-center">
                {{ $t('services.route_integrity.fields.total_trips') }}
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-center">
                {{ $t('services.route_integrity.fields.flagged_trips') }}
                <em
                  class="fa-solid fa-circle-info gorda-route-integrity__header-info"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  :title="$t('services.route_integrity.fields.flagged_trips_tooltip')"
                ></em>
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-center">
                {{ $t('services.route_integrity.fields.flagged_ratio') }}
                <em
                  class="fa-solid fa-circle-info gorda-route-integrity__header-info"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  :title="$t('services.route_integrity.fields.flagged_ratio_tooltip')"
                ></em>
              </th>
            </tr>
          </thead>
          <tbody class="text-sm" v-if="!loading && rows.length > 0">
            <tr
              v-for="row in rows"
              :key="row.driver_id"
              class="gorda-route-integrity__row"
              :class="{ 'gorda-route-integrity__row--selected': selectedDriverId === row.driver_id }"
              @click="selectDriver(row)"
            >
              <td class="ps-2">{{ driverName(row.driver_id) }}</td>
              <td class="ps-2 text-center">{{ row.total_trips }}</td>
              <td class="ps-2 text-center">{{ row.flagged_trips }}</td>
              <td class="ps-2 text-center">
                <span class="gorda-route-integrity__ratio-badge" :class="ratioBadgeClass(row.flagged_ratio)">
                  {{ formatRatio(row.flagged_ratio) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="text-center py-4 text-secondary text-sm">
          <em class="fas fa-circle-notch fa-spin me-1"></em>{{ $t('common.messages.waiting') }}
        </div>
        <div v-else-if="rows.length === 0" class="text-center py-4 gorda-route-integrity__empty">
          <em class="fa-solid fa-route fa-lg mb-2 d-block opacity-50"></em>
          {{ $t('services.route_integrity.empty_state') }}
        </div>
      </div>
    </div>

    <div class="card mt-2 gorda-route-integrity__drilldown-card" v-if="selectedDriverId">
      <div class="gorda-table-header">
        <div class="d-flex align-items-center gap-2">
          <span class="gorda-table-header-icon" style="background: linear-gradient(310deg, #2152ff, #21d4fd);">
            <em class="fas fa-list-check"></em>
          </span>
          <h6 class="gorda-table-header-title mb-0">
            {{ $t('services.route_integrity.drilldown_title', { driver: driverName(selectedDriverId) }) }}
          </h6>
        </div>
      </div>
      <div v-if="drillDownLoading" class="text-center py-4 text-secondary text-sm">
        <em class="fas fa-circle-notch fa-spin me-1"></em>{{ $t('common.messages.waiting') }}
      </div>
      <ServicesTable
        v-else
        :table="Tables.history"
        :services="drillDownServices"
        :pagination="drillDownPagination"
        @paginate="paginateDrillDown"
        @showService="show"
      ></ServicesTable>
    </div>

    <ShowServiceModal :key="selectedService.id" v-if="selectedService" :service="selectedService"></ShowServiceModal>
  </div>
</template>

<script setup lang="ts">
import { Field, Form } from 'vee-validate'
import { date, object } from 'yup'
import { nextTick, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { Modal, Tooltip } from 'bootstrap'
import ServiceRepository from '@/repositories/ServiceRepository'
import DateHelper from '@/helpers/DateHelper'
import { useDriversStore } from '@/services/stores/DriversStore'
import { RouteIntegrityMetric } from '@/types/RouteIntegrityMetric'
import { Pagination } from '@/types/Pagination'
import { ServiceCursor } from '@/types/ServiceCursor'
import ToastService from '@/services/ToastService'
import Service from '@/models/Service'
import { ServiceList } from '@/models/ServiceList'
import ServicesTable from '@/components/services/ServicesTable.vue'
import ShowServiceModal from '@/components/services/ShowServiceModal.vue'
import { Tables } from '@/constants/Tables'

const { t } = useI18n()
const { findById } = useDriversStore()

const filter = reactive({
  from: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
  to: DateHelper.stringNow(),
})

const schema = object().shape({
  from: date().required(),
  to: date().required(),
})

const rows = ref<RouteIntegrityMetric[]>([])
const loading = ref(false)
const selectedDriverId = ref<string | null>(null)

// Component-scoped drill-down state (design.md Decision 3): this list/pagination
// is fetched directly through ServiceRepository.getHistoryPage and never touches
// ServiceStore's shared history/pagination/filter/cursor state.
const drillDownServices = ref<ServiceList[]>([])
const drillDownPagination = ref<Pagination>({
  currentPage: 1,
  perPage: 20,
  totalCount: 0,
  cursor: { id: '', created: 0 },
})
const drillDownLoading = ref(false)
const selectedService = ref<ServiceList | null>(null)

async function loadReport(): Promise<void> {
  loading.value = true
  selectedDriverId.value = null
  resetDrillDown()
  try {
    rows.value = await ServiceRepository.getRouteIntegrityReport({
      from: DateHelper.getFromDate(filter.from),
      to: DateHelper.getToDate(filter.to),
    })
  } catch (e: any) {
    rows.value = []
    await ToastService.toast(ToastService.ERROR, t('common.messages.error'), e?.message)
  } finally {
    loading.value = false
  }
}

function driverName(driverId: string): string {
  return findById(driverId)?.name || driverId
}

function formatRatio(ratio: number): string {
  return `${Math.round(ratio * 100)}%`
}

function ratioBadgeClass(ratio: number): string {
  if (ratio >= 0.5) return 'gorda-route-integrity__ratio-badge--danger'
  if (ratio > 0) return 'gorda-route-integrity__ratio-badge--warning'
  return 'gorda-route-integrity__ratio-badge--success'
}

function resetDrillDown(): void {
  selectedService.value = null
  drillDownServices.value.splice(0)
  drillDownPagination.value.currentPage = 1
  drillDownPagination.value.totalCount = 0
  drillDownPagination.value.cursor = { id: '', created: 0 }
}

// Replicates ServiceStore's setServiceFromFS/attachDriver locally so the
// drill-down never calls ServiceStore.getHistoryServices() or shares its state.
function attachDriverLocal(service: Service): ServiceList {
  const list = Object.assign(new ServiceList(), service)
  list.vehicle = service.vehicle ?? null
  list.driver = list.driver_id ? findById(list.driver_id) ?? null : null
  return list
}

async function loadDrillDown(next = true): Promise<void> {
  if (!selectedDriverId.value) return
  drillDownLoading.value = true
  try {
    const response = await ServiceRepository.getHistoryPage({
      from: DateHelper.getFromDate(filter.from),
      to: DateHelper.getToDate(filter.to),
      driverId: selectedDriverId.value,
      clientId: null,
      perPage: drillDownPagination.value.perPage,
      cursor: drillDownPagination.value.cursor,
      next,
      routeIntegrity: 'flagged',
    })
    drillDownPagination.value.totalCount = response.totalCount
    drillDownServices.value.splice(0)
    response.services.forEach((service) => {
      drillDownServices.value.push(attachDriverLocal(service))
    })
  } catch (e: any) {
    drillDownServices.value.splice(0)
    await ToastService.toast(ToastService.ERROR, t('common.messages.error'), e?.message)
  } finally {
    drillDownLoading.value = false
  }
}

async function selectDriver(row: RouteIntegrityMetric): Promise<void> {
  selectedDriverId.value = row.driver_id
  selectedService.value = null
  drillDownPagination.value.currentPage = 1
  drillDownPagination.value.cursor = { id: '', created: 0 }
  await loadDrillDown(true)
}

async function paginateDrillDown(page: number, cursor: ServiceCursor, next: boolean): Promise<void> {
  drillDownPagination.value.cursor = cursor
  drillDownPagination.value.currentPage = page
  await loadDrillDown(next)
}

async function show(service: ServiceList): Promise<void> {
  selectedService.value = service
  await nextTick()
  const modalEl = document.getElementById('showServiceModal')
  const modal = new Modal(modalEl ?? 'showServiceModal')
  modal.show()
}

watch(() => drillDownPagination.value.perPage, async () => {
  if (!selectedDriverId.value) return
  drillDownPagination.value.currentPage = 1
  drillDownPagination.value.cursor = { id: '', created: 0 }
  await loadDrillDown(true)
})

onBeforeMount(async () => {
  await loadReport()
})

// Header tooltips are static, so they can be initialized once the component mounts
// (the vendor tooltip auto-init only scans the DOM once, on Dashboard.vue's onMounted).
let headerTooltips: Tooltip[] = []

onMounted(async () => {
  await nextTick()
  headerTooltips = Array.from(document.querySelectorAll('.gorda-route-integrity__header-info'))
    .map((el) => new Tooltip(el))
})

onBeforeUnmount(() => {
  headerTooltips.forEach((tooltip) => tooltip.dispose())
  headerTooltips = []
})
</script>

<style scoped>
.gorda-route-integrity {
  --route-integrity-label-color: var(--text-secondary);
  --route-integrity-helper-bg: rgba(23, 193, 232, 0.1);
  --route-integrity-helper-border: rgba(23, 193, 232, 0.25);
  --route-integrity-helper-color: var(--text-body);
  --route-integrity-row-hover: var(--surface-input);
  --route-integrity-row-selected: rgba(203, 12, 159, 0.08);
  --route-integrity-empty-color: var(--text-secondary);
}
body.dark-version .gorda-route-integrity {
  --route-integrity-label-color: var(--text-secondary);
  --route-integrity-helper-bg: rgba(23, 193, 232, 0.12);
  --route-integrity-helper-border: rgba(23, 193, 232, 0.28);
  --route-integrity-helper-color: var(--text-body);
  --route-integrity-row-hover: var(--surface-input);
  --route-integrity-row-selected: rgba(203, 12, 159, 0.16);
  --route-integrity-empty-color: var(--text-secondary);
}

.gorda-route-integrity__filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-subtle);
}

.gorda-route-integrity__filter-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.gorda-route-integrity__filter-icon-chip {
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

.gorda-route-integrity__filter-heading {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-heading);
}

.gorda-route-integrity__label {
  display: block;
  text-transform: uppercase;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.04rem;
  color: var(--route-integrity-label-color);
  margin-bottom: 0.25rem;
}

.gorda-route-integrity__btn-filter {
  background: linear-gradient(310deg, #7928ca, #ff0080);
  color: #fff;
  border: none;
  box-shadow: 0 4px 12px rgba(121, 40, 202, 0.35);
  padding: 0.6rem 1.25rem;
  line-height: 1.4;
  margin-bottom: 0;
}

.gorda-route-integrity__btn-filter:hover {
  color: #fff;
}

.gorda-route-integrity__helper {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  border-radius: var(--radius-md);
  background: var(--route-integrity-helper-bg);
  border: 1px solid var(--route-integrity-helper-border);
  color: var(--route-integrity-helper-color);
  font-size: 0.8rem;
}

.gorda-route-integrity__helper-icon {
  color: #17c1e8;
  margin-top: 0.15rem;
}

.gorda-route-integrity__row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.gorda-route-integrity__row:hover {
  background-color: var(--route-integrity-row-hover);
}

.gorda-route-integrity__row--selected {
  background-color: var(--route-integrity-row-selected);
}

.gorda-route-integrity__ratio-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3.2rem;
  padding: 0.25rem 0.6rem;
  border-radius: 50rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
}

.gorda-route-integrity__ratio-badge--success {
  background: linear-gradient(310deg, #17ad37, #98ec2d);
}

.gorda-route-integrity__ratio-badge--warning {
  background: linear-gradient(310deg, #f53939, #fbcf33);
}

.gorda-route-integrity__ratio-badge--danger {
  background: linear-gradient(310deg, #ea0606, #ff667c);
}

.gorda-route-integrity__empty {
  color: var(--route-integrity-empty-color);
}

.gorda-route-integrity__header-info {
  font-size: 0.7rem;
  color: var(--text-secondary);
  margin-left: 0.25rem;
  cursor: help;
}

.gorda-table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: .75rem;
  padding: .85rem 1rem;
  border-bottom: 1px solid var(--border-subtle);
}

.gorda-table-header-icon {
  width: 32px;
  height: 32px;
  border-radius: .5rem;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: .8rem;
}

.gorda-table-header-title {
  font-size: .95rem;
  font-weight: 700;
  color: var(--text-heading);
}

.gorda-table-header-count {
  background: var(--surface-input);
  border: 1px solid var(--border-subtle);
  border-radius: 50rem;
  padding: .1rem .6rem;
  font-size: .72rem;
  font-weight: 700;
  color: var(--text-secondary);
}
</style>
