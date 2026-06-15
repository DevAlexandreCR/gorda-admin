<template>
  <div class="mx-3">
    <div class="card mb-4">
      <div class="row m-3 align-items-center">
        <div class="col-auto">
          <h6 class="ms-2 mb-0">{{ $t('routes.vehicles') }} &middot; {{ total }}</h6>
        </div>
        <div class="col"></div>
      </div>

      <!-- Filter bar -->
      <div class="mx-3 mb-2 d-flex align-items-center gap-2 flex-wrap">
        <input
          class="form-control form-control-sm"
          style="max-width: 240px"
          type="search"
          :placeholder="$t('common.placeholders.search')"
          v-model="search"
          @input="onSearchInput"
          autocomplete="off"
        />
        <div class="btn-group btn-group-sm" role="group">
          <button
            type="button"
            class="btn"
            :class="enabledFilter === null ? 'btn-secondary' : 'btn-outline-secondary'"
            @click="setEnabledFilter(null)"
          >{{ $t('common.placeholders.all') }}</button>
          <button
            type="button"
            class="btn"
            :class="enabledFilter === true ? 'btn-success' : 'btn-outline-success'"
            @click="setEnabledFilter(true)"
          >{{ $t('common.fields.enabled') }}</button>
          <button
            type="button"
            class="btn"
            :class="enabledFilter === false ? 'btn-danger' : 'btn-outline-danger'"
            @click="setEnabledFilter(false)"
          >{{ $t('common.fields.disabled') }}</button>
        </div>
      </div>

      <div class="card-body px-0 pt-0 pb-2">
        <div class="table-responsive p-0">
          <div v-if="loading" class="text-center py-2 text-secondary text-xs">
            <em class="fas fa-circle-notch fa-spin me-1"></em>{{ $t('common.messages.waiting') }}
          </div>

          <table class="table align-items-center mb-0" :class="{ 'opacity-50': loading }">
            <caption hidden></caption>
            <thead>
              <tr>
                <th
                  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 cursor-pointer user-select-none"
                  @click="setSort('plate')"
                >
                  {{ $t('drivers.fields.plate') }}
                  <span v-if="sortField === 'plate'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th
                  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 cursor-pointer user-select-none"
                  @click="setSort('brand')"
                >
                  {{ $t('drivers.vehicle.brand') }}
                  <span v-if="sortField === 'brand'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  {{ $t('drivers.vehicle.model') }}
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  {{ $t('drivers.placeholders.color') }}
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  {{ $t('common.fields.status') }}
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  {{ $t('vehicles.fields.linked_drivers') }}
                </th>
                <th
                  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 cursor-pointer user-select-none"
                  @click="setSort('created_at')"
                >
                  {{ $t('common.fields.createdAt') }}
                  <span v-if="sortField === 'created_at'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  {{ $t('common.actions.edit') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="vehicle in rows" :key="vehicle.id">
                <td class="py-0">
                  <div class="d-flex px-2 py-1 align-items-center">
                    <img
                      :src="vehicle.photoUrl || ''"
                      class="avatar avatar-sm me-3"
                      alt="Vehicle"
                      v-if="vehicle.photoUrl"
                    />
                    <router-link
                      :to="{ name: 'vehicles.detail', params: { id: vehicle.id } }"
                      class="text-sm font-weight-bold mb-0"
                    >{{ vehicle.plate }}</router-link>
                  </div>
                </td>
                <td>
                  <p class="text-xs font-weight-bold mb-0">{{ vehicle.brand }}</p>
                </td>
                <td>
                  <p class="text-xs text-secondary mb-0">{{ vehicle.model }}</p>
                </td>
                <td>
                  <div class="d-flex align-items-center gap-1">
                    <span
                      v-if="vehicle.color?.hex"
                      class="rounded-circle d-inline-block"
                      style="width: 14px; height: 14px; border: 1px solid #ccc;"
                      :style="{ backgroundColor: vehicle.color.hex }"
                    ></span>
                    <p class="text-xs mb-0">{{ vehicle.color?.name ?? '' }}</p>
                  </div>
                </td>
                <td class="align-middle text-center text-sm">
                  <span
                    class="badge badge-sm"
                    :class="vehicle.enabled ? 'bg-gradient-success' : 'bg-gradient-danger'"
                  >
                    {{ $t(vehicle.enabled ? 'common.fields.enabled' : 'common.fields.disabled') }}
                  </span>
                </td>
                <td class="align-middle text-center">
                  <span class="text-secondary text-xs font-weight-bold">
                    {{ vehicle.linked_drivers_count ?? 0 }}
                  </span>
                </td>
                <td class="align-middle text-center">
                  <span class="text-secondary text-xs font-weight-bold">
                    {{ vehicle.created_at ? formatDate(vehicle.created_at) : '' }}
                  </span>
                </td>
                <td class="align-middle">
                  <router-link
                    :to="{ name: 'vehicles.edit', params: { id: vehicle.id } }"
                    class="btn btn-sm btn-outline-primary px-2"
                    :title="$t('common.actions.edit')"
                  >
                    <em class="fas fa-pencil"></em>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="container mt-2">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VehicleRepository from '@/repositories/VehicleRepository'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'
import PagePaginator from '@/components/PagePaginator.vue'
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

watchEffect(async () => {
  void committedSearch.value
  void enabledFilter.value
  void sortParam.value
  void page.value
  void perPage.value

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

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(value: string): string {
  if (!value) return ''
  return dayjs(value).format('YYYY-MM-DD')
}
</script>
