<template>
  <div>
    <router-view/>
  </div>
</template>
<script setup lang="ts">
import AuthService from '@/services/AuthService'
import {onMounted} from 'vue'

onMounted((): void => {
  AuthService.onAuthStateChanged(location.pathname)
})
</script>

<style lang="scss">
@import "src/assets/scss/app.scss";
</style>
