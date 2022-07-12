<template>
  <div>
    <SideBar></SideBar>
    <main  class="main-content mt-1 border-radius-lg " id="main">
      <NavBar/>
      <router-view class="mt-4 ms-2"></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import {onMounted} from 'vue'

onMounted((): void => {
  require('@/vendor/js/soft-ui-dashboard')
})
</script>
