<template>
  <div>
    <Suspense>
      <template #default>
        <div v-if="placesLoaded && clientsLoaded && driversLoaded && servicesLoaded && wpClientsLoaded && settingsLoaded">
          <SideBar></SideBar>
          <main class="main-content mt-1 border-radius-lg " id="main">
            <NavBar/>
            <router-view class="mt-4 ms-2"></router-view>
          </main>
        </div>
      </template>
    </Suspense>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
import { usePlacesStore } from '@/services/stores/PlacesStore'
import { useClientsStore } from '@/services/stores/ClientsStore'
import { useDriversStore } from '@/services/stores/DriversStore'
import { useServicesStore } from '@/services/stores/ServiceStore'
import { useWpClientsStore } from '@/services/stores/WpClientStore'
import { useSettingsStore } from "@/services/stores/SettingsStore";
import { useMetricsStore } from "@/services/stores/MetricsStore";
import { useLoadingState } from "@/services/stores/LoadingState";

const placesLoaded = ref(false)
const clientsLoaded = ref(false)
const driversLoaded = ref(false)
const servicesLoaded = ref(false)
const wpClientsLoaded = ref(false)
const settingsLoaded = ref(false)

const { getPlaces } = usePlacesStore()
const { getClients } = useClientsStore()
const driverStore = useDriversStore()
const servicesStore = useServicesStore()
const { getDrivers } = driverStore
const { drivers } = storeToRefs(driverStore)
const { getHistoryServices, getPendingServices, getInProgressServices, rehydrateServiceDrivers } = servicesStore
const { getWpClients } = useWpClientsStore()
const { getBranches, getRideFees } = useSettingsStore()
const { getCurrentYearMetric } = useMetricsStore()
const { setLoading } = useLoadingState()

const loadAllData = async () => {
  setLoading(true)
  await getDrivers().catch(() => undefined)
  rehydrateServiceDrivers()

  await Promise.allSettled([
    getClients(),
    getHistoryServices(),
    getPendingServices(),
    getInProgressServices(),
    getWpClients(),
    getBranches(),
    getRideFees(),
    getPlaces(),
    getCurrentYearMetric()
  ])

  placesLoaded.value = true
  clientsLoaded.value = true
  driversLoaded.value = true
  servicesLoaded.value = true
  wpClientsLoaded.value = true
  settingsLoaded.value = true
  setLoading(false)
}

watch(drivers, () => {
  rehydrateServiceDrivers()
}, { deep: true })

onMounted(async () => {
  await loadAllData()
  require('@/vendor/js/soft-ui-dashboard')
})

</script>
