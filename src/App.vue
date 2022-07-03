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

const {getPlaces} = usePlacesStore()
const {getClients} = useClientsStore()

onMounted((): void => {
  AuthService.onAuthStateChanged(location.pathname)
  getPlaces()
  getClients()
})
</script>

<style lang="scss">
@import "src/assets/scss/app.scss";
</style>
