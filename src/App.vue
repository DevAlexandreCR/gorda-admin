<template>
  <div>
    <router-view/>
  </div>
</template>
<script setup lang="ts">
import AuthService from '@/services/AuthService'
import {onMounted} from 'vue'
import {useStorage} from '@/services/stores/Storage'
import {useLoadingState} from '@/services/stores/LoadingState'

const {getLogoUrl} = useStorage()
const {isLoading} = useLoadingState()

onMounted((): void => {
  AuthService.onAuthStateChanged(location.pathname)
  getLogoUrl()
})
</script>

<style lang="scss">
@import "src/assets/scss/app.scss";
</style>
