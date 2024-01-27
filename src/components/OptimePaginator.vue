<template>
  <div class="container-fluid">
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
            <a class="page-link" @click="goToPage(item)">{{ item }} <span class="sr-only">(current)</span></a>
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
import { ref, computed, defineProps, defineEmits, watch } from 'vue'

interface Props {
  totalCount: number
  perPage: number
  currentPage: number
  data: []
}

const props = defineProps<Props>()
const emit = defineEmits(['paginatedData'])

const totalPages = computed(() => Math.ceil(props.totalCount / props.perPage))
const currentPage = ref(props.currentPage)

function nextPage(): void {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
    emitPageData(currentPage.value)
  }
}

function backPage(): void {
  if (currentPage.value > 1) {
    currentPage.value -= 1
    emitPageData(currentPage.value)
  }
}

function goToPage(numPage: number): void {
  if (numPage >= 1 && numPage <= totalPages.value) {
    currentPage.value = numPage
    emitPageData(numPage)
  }
}

function emitPageData(page: number): void {

  emit('paginatedData', page)
}

// watch(() => props.currentPage, () => {
//   currentPage.value = props.currentPage
//   emitPageData(currentPage.value)
// })
</script>




