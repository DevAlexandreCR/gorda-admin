<template>
  <div>
    <router-view/>
    <LoadingToast :isLoading="isLoading"/>
  </div>
</template>
<script setup lang="ts">
import LoadingToast from '@/components/LoadingToast.vue'
import AuthService from '@/services/AuthService'
import {onMounted} from 'vue'
import {useStorage} from '@/services/stores/Storage'
import {useLoadingState} from '@/services/stores/LoadingState'
import {storeToRefs} from 'pinia'

const {getLogoUrl} = useStorage()
const {isLoading} = storeToRefs(useLoadingState())

onMounted((): void => {
  AuthService.onAuthStateChanged(location.pathname)
  getLogoUrl()
})
</script>

<style lang="scss">
@import "src/assets/scss/app.scss";
</style>
