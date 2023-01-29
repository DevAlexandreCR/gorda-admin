<template>
  <div>
    <SideBar></SideBar>
    <Suspense>
      <template #default>
        <main class="main-content mt-1 border-radius-lg " id="main">
          <NavBar/>
          <router-view class="mt-4 ms-2"></router-view>
        </main>
      </template>
      <template #fallback>
        <div class="display-6">Loading...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import {usePlacesStore} from '@/services/stores/PlacesStore'
import {useClientsStore} from '@/services/stores/ClientsStore'
import {useDriversStore} from '@/services/stores/DriversStore'
import {onMounted} from 'vue'
import {useServicesStore} from '@/services/stores/ServiceStore'

const {getPlaces} = usePlacesStore()
const {getClients} = useClientsStore()
const {getDrivers} = useDriversStore()
const {getHistoryServices} = useServicesStore()
getPlaces()
getClients()
getDrivers()
getHistoryServices()
onMounted(() => {
  require('@/vendor/js/soft-ui-dashboard')
})

</script>
