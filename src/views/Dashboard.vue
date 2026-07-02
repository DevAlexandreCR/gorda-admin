<template>
  <div>
    <Suspense>
      <template #default>
        <div v-if="coreLoaded" class="dashboard-shell">
          <SideBar></SideBar>
          <main class="main-content border-radius-lg " id="main">
            <NavBar/>
            <div class="content-scroll">
              <router-view></router-view>
            </div>
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

const coreLoaded = ref(false)

const placesStore = usePlacesStore()
const clientsStore = useClientsStore()
const driverStore = useDriversStore()
const servicesStore = useServicesStore()
const { getDrivers } = driverStore
const { drivers } = storeToRefs(driverStore)
const { getHistoryServices, getPendingServices, getInProgressServices, rehydrateServiceDrivers } = servicesStore
const { getWpClients } = useWpClientsStore()
const settingsStore = useSettingsStore()
const { getBranches, getRideFees } = settingsStore
const { branchSelected } = storeToRefs(settingsStore)
const { getCurrentYearMetric } = useMetricsStore()
const { setLoading } = useLoadingState()

const startHeavyHydration = (): void => {
  clientsStore.hydrateClientsInBackground().catch(() => undefined)
  placesStore.hydratePlacesInBackground(branchSelected.value?.city?.id).catch(() => undefined)
}

const loadAllData = async () => {
  setLoading(true)
  await getDrivers().catch(() => undefined)
  rehydrateServiceDrivers()

  await Promise.allSettled([
    getHistoryServices(),
    getPendingServices(),
    getInProgressServices(),
    getWpClients(),
    getBranches(),
    getRideFees(),
    getCurrentYearMetric(),
  ])

  coreLoaded.value = true
  setLoading(false)
  startHeavyHydration()
}

watch(drivers, () => {
  rehydrateServiceDrivers()
}, { deep: true })

watch(branchSelected, (selectedBranch, previousBranch) => {
  if (!coreLoaded.value) {
    return
  }

  if (selectedBranch?.city?.id === previousBranch?.city?.id) {
    return
  }

  placesStore.hydratePlacesInBackground(selectedBranch?.city?.id).catch(() => undefined)
}, { deep: true })

onMounted(async () => {
  await loadAllData()
  require('@/vendor/js/soft-ui-dashboard')
})

</script>
<style scoped>
.dashboard-shell {
  height: 100vh;
  overflow: hidden;
}

.main-content {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 1.5rem;
  padding-left: 0.25rem;
}
</style>
