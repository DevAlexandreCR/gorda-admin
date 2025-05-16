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
        <li v-for="item in Math.ceil(data.length / perPage)"
            :key="item"
            class="page-item cursor-pointer"
            :class="{ active: page === item }">
          <a class="page-link" @click="goToPage(item)">{{ item }} <span class="sr-only">(current)</span></a>
        </li>
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
import {computed, onMounted, ref, Ref, watch} from 'vue'

interface Props {
  data: Array<any>
  perPage?: number
  currentPage?: number 
}
const props = defineProps<Props>()
const emit = defineEmits(['paginatedData'])

const page: Ref<number> = ref(props.currentPage || 1)

watch(() => props.currentPage, (newPage) => {
  if (newPage && newPage !== page.value) {
    page.value = newPage
  }
})

const perPage = props.perPage ?? 10

const paginatedData = computed(() =>
  props.data.slice((page.value - 1) * perPage, page.value * perPage)
)

watch(paginatedData, (newData) => {
  const paginated = newData.map(item => item.value ?? item)
  emit('paginatedData', paginated, page.value)
}, { immediate: true })

function nextPage(): void {
  if (page.value !== Math.ceil(props.data.length / perPage)) {
    page.value += 1
  }
}

function backPage(): void {
  if (page.value !== 1) {
    page.value -= 1
  }
}

function goToPage(numPage: number): void {
  page.value = numPage
}

onMounted(() => {
  const initialData = props.data.slice((page.value - 1) * perPage, page.value * perPage)
  const paginated = initialData.map(item => item.value ?? item)
  emit('paginatedData', paginated, page.value)
})
</script>