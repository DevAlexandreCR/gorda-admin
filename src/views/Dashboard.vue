<template>
  <div>
    <Suspense>
      <template #default>
        <div v-if="placesLoaded && clientsLoaded && driversLoaded && servicesLoaded && wpClientsLoaded">
          <SideBar></SideBar>
          <main class="main-content mt-1 border-radius-lg " id="main">
            <NavBar/>
            <router-view class="mt-4 ms-2"></router-view>
          </main>
        </div>
      </template>
      <template #fallback>
        <div class="display-6">Loading...</div>
      </template>
    </Suspense>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import { usePlacesStore } from '@/services/stores/PlacesStore'
import { useClientsStore } from '@/services/stores/ClientsStore'
import { useDriversStore } from '@/services/stores/DriversStore'
import { useServicesStore } from '@/services/stores/ServiceStore'
import { useWpClientsStore } from '@/services/stores/WpClientStore'

const placesLoaded = ref(false)
const clientsLoaded = ref(false)
const driversLoaded = ref(false)
const servicesLoaded = ref(false)
const wpClientsLoaded = ref(false)

const { getPlaces } = usePlacesStore()
const { getClients } = useClientsStore()
const { getDrivers } = useDriversStore()
const { getHistoryServices, getPendingServices, getInProgressServices } = useServicesStore()
const { getWpClients } = useWpClientsStore()

const loadAllData = async () => {
  await Promise.all([
    getPlaces(),
    getClients(),
    getDrivers(),
    getHistoryServices(),
    getPendingServices(),
    getInProgressServices(),
    getWpClients()
  ])

  placesLoaded.value = true
  clientsLoaded.value = true
  driversLoaded.value = true
  servicesLoaded.value = true
  wpClientsLoaded.value = true
}

onMounted(async () => {
  await loadAllData()
  require('@/vendor/js/soft-ui-dashboard')
})

</script>