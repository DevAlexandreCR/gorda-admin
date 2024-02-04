<template>
  <div class="container-fluid d-flex">
    <div class="form-group d-inline-flex">
      <label class="me-2 text-nowrap">{{ $t('common.actions.items_pages') }}</label>
      <select class="form-select form-select-sm text-nowrap" v-model="storePagination.perPage">
        <option :value="20" :selected="currentPage === 20">20</option>
        <option :value="30" :selected="currentPage === 30">30</option>
        <option :value="50" :selected="currentPage === 50">50</option>
      </select>
    </div>
    <nav aria-label="...">
      <ul class="pagination">
        <li class="page-item">
          <a class="page-link cursor-pointer" @click="backPage" tabindex="-1">
            <em class="fa fa-angle-left"></em>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <template v-for="(item, index) in totalPages" :key="index">
          <li v-if="item === 1 || item === totalPages || (item >= currentPage - 1 && item <= currentPage + 1)"
              class="page-item cursor-pointer"
              :class="{ active: currentPage === item }">
            <span class="page-link">{{ item }} <span class="sr-only">(current)</span></span>
          </li>
          <li v-else-if="item === totalPages - 1 || item === 2" :key="`dots-${index}`" class="page-item disabled">
            <span class="page-link">...</span>
          </li>
        </template>
        <li class="page-item cursor-pointer">
          <a class="page-link" @click="nextPage">
            <em class="fa fa-angle-right"></em>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>


<script setup lang="ts">
import {ref, computed, watch, Ref} from 'vue'
import {Pagination} from "@/types/Pagination";
import {storeToRefs} from 'pinia'
import {useServicesStore} from '@/services/stores/ServiceStore'

interface Props {
  pagination: Pagination
}

const props = defineProps<Props>()
const emit = defineEmits(['paginatedData'])

const totalPages = computed(() => Math.ceil(props.pagination.totalCount / props.pagination.perPage))
const {pagination: storePagination} = storeToRefs(useServicesStore())
const currentPage: Ref<number> = ref(storePagination.value.currentPage)

watch(() => props.pagination.currentPage, (page) => {
  currentPage.value = page
})

function nextPage(): void {
  if (currentPage.value < totalPages.value) {
    currentPage.value ++
    emitPageData(currentPage.value, true)
  }
}

function backPage(): void {
  if (currentPage.value > 1) {
    currentPage.value--
    emitPageData(currentPage.value, false)
  }
}

function emitPageData(page: number, next: boolean): void {
  emit('paginatedData', page, next)
}
</script>




