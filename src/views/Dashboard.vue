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
import {usePlacesStore} from '@/services/stores/PlacesStore'
import {useClientsStore} from '@/services/stores/ClientsStore'
import {useDriversStore} from '@/services/stores/DriversStore'
import {useStorage} from '@/services/stores/Storage'

const {getPlaces} = usePlacesStore()
const {getClients} = useClientsStore()
const {getDrivers} = useDriversStore()
const {getLogoUrl} = useStorage()

onMounted((): void => {
  require('@/vendor/js/soft-ui-dashboard')
  getPlaces()
  getClients()
  getDrivers()
  getLogoUrl()
})
</script>
