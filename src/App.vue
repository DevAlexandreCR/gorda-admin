<template>
  <div>
    <router-view/>
  </div>
</template>
<script setup lang="ts">
import AuthService from '@/services/AuthService'
import {onMounted} from 'vue'
import {usePlacesStore} from '@/services/stores/PlacesStore'
import {useClientsStore} from '@/services/stores/ClientsStore'
import {useDriversStore} from '@/services/stores/DriversStore'
import {useStorage} from '@/services/stores/Storage'

const {getPlaces} = usePlacesStore()
const {getClients} = useClientsStore()
const {getDrivers} = useDriversStore()
const {getLogoUrl} = useStorage()

onMounted((): void => {
  AuthService.onAuthStateChanged(location.pathname)
  getPlaces()
  getClients()
  getDrivers()
  getLogoUrl()
})
</script>

<style lang="scss">
@import "src/assets/scss/app.scss";
</style>
