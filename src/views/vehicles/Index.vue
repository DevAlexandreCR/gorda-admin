<template>
  <div class="mx-3">
    <div class="gorda-vehicles-card">
      <div class="gorda-vehicles-toolbar">
        <h6 class="gorda-vehicles-toolbar__title">{{ $t('routes.vehicles') }} &middot; {{ total }}</h6>

        <div class="gorda-vehicles-search">
          <em class="fas fa-magnifying-glass"></em>
          <input
            type="search"
            :placeholder="$t('vehicles.placeholders.search')"
            v-model="search"
            @input="onSearchInput"
            autocomplete="off"
          />
        </div>

        <div class="gorda-vehicles-pills">
          <button
            type="button"
            class="gorda-pill gorda-pill--neutral"
            :class="{ 'gorda-pill--active': enabledFilter === null }"
            @click="setEnabledFilter(null)"
          >{{ $t('common.placeholders.all') }}</button>
          <button
            type="button"
            class="gorda-pill gorda-pill--success"
            :class="{ 'gorda-pill--active': enabledFilter === true }"
            @click="setEnabledFilter(true)"
          >{{ $t('common.fields.enabled') }}</button>
          <button
            type="button"
            class="gorda-pill gorda-pill--danger"
            :class="{ 'gorda-pill--active': enabledFilter === false }"
            @click="setEnabledFilter(false)"
          >{{ $t('common.fields.disabled') }}</button>
        </div>

        <button
          type="button"
          class="gorda-vehicles-add-btn"
          :title="$t('vehicles.actions.add_vehicle')"
          :aria-label="$t('vehicles.actions.add_vehicle')"
          @click="createModalRef?.open()"
        >
          <em class="fas fa-plus"></em>
        </button>
      </div>

      <div class="table-responsive p-0">
        <div v-if="loading" class="gorda-table-loading-indicator text-secondary text-xs">
          <em class="fas fa-circle-notch fa-spin me-1"></em>{{ $t('common.messages.waiting') }}
        </div>

        <table class="table align-items-center mb-0 gorda-vehicles-table" :class="{ 'gorda-table-body--loading': loading }">
          <caption hidden></caption>
          <thead>
            <tr>
              <th class="gorda-th cursor-pointer user-select-none" @click="setSort('plate')">
                {{ $t('drivers.fields.plate') }}
                <em class="gorda-sort-icon" :class="sortIconClass('plate')"></em>
              </th>
              <th class="gorda-th cursor-pointer user-select-none" @click="setSort('brand')">
                {{ $t('vehicles.fields.brand') }}
                <em class="gorda-sort-icon" :class="sortIconClass('brand')"></em>
              </th>
              <th class="gorda-th">{{ $t('vehicles.fields.model') }}</th>
              <th class="gorda-th">{{ $t('vehicles.fields.color') }}</th>
              <th class="gorda-th text-center">{{ $t('common.fields.status') }}</th>
              <th class="gorda-th text-center">{{ $t('vehicles.fields.linked_drivers') }}</th>
              <th class="gorda-th text-center cursor-pointer user-select-none" @click="setSort('created_at')">
                {{ $t('common.fields.createdAt') }}
                <em class="gorda-sort-icon" :class="sortIconClass('created_at')"></em>
              </th>
              <th class="gorda-th text-center">{{ $t('common.actions.edit') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vehicle in rows" :key="vehicle.id" class="gorda-vehicles-row">
              <td>
                <div class="d-flex align-items-center gap-2">
                  <span class="gorda-plate-icon"><em class="fas fa-car"></em></span>
                  <router-link
                    :to="{ name: 'vehicles.detail', params: { id: vehicle.id } }"
                    class="gorda-plate-link"
                  >{{ vehicle.plate }}</router-link>
                </div>
              </td>
              <td><span class="gorda-brand">{{ vehicle.brand }}</span></td>
              <td><span class="gorda-model">{{ vehicle.model }}</span></td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <span
                    v-if="vehicle.color?.hex"
                    class="gorda-color-dot"
                    :style="{ backgroundColor: vehicle.color.hex }"
                  ></span>
                  <span class="gorda-color-name">{{ vehicle.color?.name ?? '—' }}</span>
                </div>
              </td>
              <td class="text-center">
                <span
                  class="gorda-status-badge"
                  :class="vehicle.enabled ? 'gorda-status-badge--solid-success' : 'gorda-status-badge--solid-danger'"
                >
                  {{ $t(vehicle.enabled ? 'common.fields.enabled' : 'common.fields.disabled') }}
                </span>
              </td>
              <td class="text-center">
                <span
                  class="gorda-linked-count"
                  :class="{ 'gorda-linked-count--active': (vehicle.linked_drivers_count ?? 0) > 0 }"
                >{{ vehicle.linked_drivers_count ?? 0 }}</span>
              </td>
              <td class="text-center">
                <span class="gorda-created">{{ vehicle.created_at ? formatDate(vehicle.created_at) : '' }}</span>
              </td>
              <td class="text-center">
                <router-link
                  :to="{ name: 'vehicles.edit', params: { id: vehicle.id } }"
                  class="gorda-edit-btn"
                  :title="$t('common.actions.edit')"
                >
                  <em class="fas fa-pencil"></em>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="px-3 pb-2">
          <PagePaginator
            :total="total"
            :page="page"
            :per-page="perPage"
            @update:page="onPageUpdate"
            @update:per-page="onPerPageUpdate"
          />
        </div>
      </div>
    </div>

    <VehicleCreateModal ref="createModalRef" @created="onVehicleCreated" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VehicleRepository from '@/repositories/VehicleRepository'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import PagePaginator from '@/components/PagePaginator.vue'
import VehicleCreateModal from '@/components/vehicles/VehicleCreateModal.vue'
import { Vehicle } from '@/types/Vehicle'
import dayjs from 'dayjs'

// ── Constants ──────────────────────────────────────────────────────────────────

const DEFAULT_SORT = 'plate'
const DEFAULT_PAGE = 1
const DEFAULT_PER_PAGE = 30

// ── Router / route ─────────────────────────────────────────────────────────────

const route = useRoute()
const router = useRouter()

// ── URL-derived state ──────────────────────────────────────────────────────────

function parseSort(raw: string | undefined): { field: string; dir: 'asc' | 'desc' } {
  if (!raw) return { field: DEFAULT_SORT, dir: 'asc' }
  if (raw.startsWith('-')) return { field: raw.slice(1), dir: 'desc' }
  return { field: raw, dir: 'asc' }
}

const initialSort = parseSort(route.query.sort as string | undefined)
const sortField = ref<string>(initialSort.field)
const sortDir = ref<'asc' | 'desc'>(initialSort.dir)
const search = ref<string>((route.query.search as string) || '')
const page = ref<number>(route.query.page ? Math.max(1, Number(route.query.page)) : DEFAULT_PAGE)
const perPage = ref<number>(route.query.perPage ? Number(route.query.perPage) : DEFAULT_PER_PAGE)
const enabledFilter = ref<boolean | null>(
  route.query.enabled === 'true' ? true : route.query.enabled === 'false' ? false : null
)

// ── Debounce ───────────────────────────────────────────────────────────────────

const committedSearch = ref<string>(search.value)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function flushSearch(): void {
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  committedSearch.value = search.value
}

function onSearchInput(): void {
  if (debounceTimer !== null) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    committedSearch.value = search.value
    debounceTimer = null
    page.value = 1
    commitUrlState()
  }, 300)
}

// ── Sort ───────────────────────────────────────────────────────────────────────

const sortParam = computed<string>(() =>
  sortDir.value === 'desc' ? `-${sortField.value}` : sortField.value
)

function setSort(field: string): void {
  flushSearch()
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDir.value = 'asc'
  }
  page.value = 1
  commitUrlState()
}

function sortIconClass(field: string): string[] {
  if (sortField.value !== field) return ['fas', 'fa-sort']
  return sortDir.value === 'asc'
    ? ['fas', 'fa-sort-up', 'gorda-sort-icon--active']
    : ['fas', 'fa-sort-down', 'gorda-sort-icon--active']
}

// ── Enabled filter ─────────────────────────────────────────────────────────────

function setEnabledFilter(value: boolean | null): void {
  flushSearch()
  enabledFilter.value = value
  page.value = 1
  commitUrlState()
}

// ── URL state commit ───────────────────────────────────────────────────────────

function commitUrlState(): void {
  const q: Record<string, string | undefined> = {}
  if (committedSearch.value !== '') q.search = committedSearch.value
  if (enabledFilter.value !== null) q.enabled = String(enabledFilter.value)
  if (sortParam.value !== DEFAULT_SORT) q.sort = sortParam.value
  if (page.value !== DEFAULT_PAGE) q.page = String(page.value)
  if (perPage.value !== DEFAULT_PER_PAGE) q.perPage = String(perPage.value)
  router.replace({ query: q })
}

// ── Paginator handlers ─────────────────────────────────────────────────────────

function onPageUpdate(value: number): void {
  flushSearch()
  page.value = value
  commitUrlState()
}

function onPerPageUpdate(value: number): void {
  flushSearch()
  perPage.value = value
  page.value = 1
  commitUrlState()
}

// ── Data state ─────────────────────────────────────────────────────────────────

const rows = ref<Vehicle[]>([])
const total = ref<number>(0)
const loading = ref<boolean>(false)
const reloadNonce = ref<number>(0)

watchEffect(async () => {
  void committedSearch.value
  void enabledFilter.value
  void sortParam.value
  void page.value
  void perPage.value
  void reloadNonce.value

  const _search = committedSearch.value
  const _enabled = enabledFilter.value
  const _sort = sortParam.value
  const _page = page.value
  const _perPage = perPage.value

  loading.value = true
  try {
    const result = await VehicleRepository.list({
      search: _search || undefined,
      enabled: _enabled !== null ? _enabled : undefined,
      sort: _sort,
      page: _page,
      perPage: _perPage,
    })
    rows.value = result.vehicles
    total.value = result.total

    if (result.total > 0 && (_page - 1) * _perPage >= result.total) {
      page.value = 1
      commitUrlState()
    }
  } catch (e: unknown) {
    const err = e as { message?: string }
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), err?.message)
  } finally {
    loading.value = false
  }
})

// ── Create vehicle ─────────────────────────────────────────────────────────────

const createModalRef = ref<InstanceType<typeof VehicleCreateModal> | null>(null)

function onVehicleCreated(vehicleId: string): void {
  void vehicleId
  page.value = 1
  reloadNonce.value++
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(value: string): string {
  if (!value) return ''
  return dayjs(value).format('YYYY-MM-DD')
}
</script>

<style scoped>
.gorda-vehicles-card {
  background: var(--surface-card);
  border-radius: 1rem;
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.gorda-vehicles-toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 1rem 1.25rem 0.85rem;
}

.gorda-vehicles-toolbar__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-heading);
}

.gorda-vehicles-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 240px;
  padding: 0.4rem 0.7rem;
  background: var(--surface-input);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
}

.gorda-vehicles-search em {
  color: var(--text-muted);
  font-size: 0.78rem;
}

.gorda-vehicles-search input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.8rem;
  color: var(--text-body);
}

.gorda-vehicles-pills {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.gorda-pill {
  padding: 0.35rem 0.9rem;
  border-radius: 50rem;
  border: 1.5px solid var(--border-subtle);
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.gorda-pill--neutral.gorda-pill--active {
  background: var(--surface-input);
  border-color: var(--text-heading);
  color: var(--text-heading);
}

.gorda-pill--success.gorda-pill--active {
  background: rgba(130, 214, 22, 0.12);
  border-color: #82d616;
  color: #82d616;
}

.gorda-pill--danger.gorda-pill--active {
  background: rgba(234, 6, 6, 0.1);
  border-color: #ea0606;
  color: #ea0606;
}

.gorda-vehicles-add-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin-left: auto;
  border: none;
  border-radius: 0.5rem;
  background: var(--gradient-primary);
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
}

.gorda-th {
  padding: 0.6rem 1rem;
  text-transform: uppercase;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-subtle);
  white-space: nowrap;
}

.gorda-sort-icon {
  margin-left: 0.3rem;
  font-size: 0.65rem;
  opacity: 0.4;
}

.gorda-sort-icon--active {
  color: var(--primary);
  opacity: 1;
}

.gorda-vehicles-table td {
  padding: 0.55rem 1rem;
  font-size: 0.8rem;
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: middle;
}

.gorda-vehicles-row:hover {
  background: var(--surface-input);
}

.gorda-plate-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 0.4rem;
  background: var(--surface-input);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.gorda-plate-link {
  font-weight: 700;
  font-size: 0.82rem;
  color: var(--primary);
  text-decoration: none;
}

.gorda-brand {
  font-weight: 700;
  color: var(--text-heading);
  font-size: 0.8rem;
}

.gorda-model {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.gorda-color-dot {
  width: 13px;
  height: 13px;
  flex: none;
  border-radius: 50%;
  border: 1.5px solid var(--border-color);
}

.gorda-color-name {
  font-size: 0.78rem;
  color: var(--text-body);
}

.gorda-linked-count {
  font-weight: 700;
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.gorda-linked-count--active {
  color: var(--text-heading);
}

.gorda-created {
  color: var(--text-secondary);
  font-size: 0.78rem;
}

.gorda-edit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 0.45rem;
  background: var(--gradient-primary);
  color: #fff;
  font-size: 0.75rem;
  text-decoration: none;
}
</style>
