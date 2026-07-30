<template>
  <div class="gorda-map">
    <div class="gorda-map__header">
      <div class="gorda-map__title-group">
        <span class="gorda-map__icon-chip">
          <em class="fas fa-car-side"></em>
        </span>
        <h6 class="gorda-map__title">{{ $t('common.models.drivers_connected') }}</h6>
        <span class="gorda-map__count-pill">{{ filteredDrivers.length }}</span>
      </div>
      <div class="gorda-map__search form-group">
        <Field name="driver" type="search" v-slot="{ field, errorMessage, meta }" v-model="searchDriver">
          <div class="gorda-map__search-control">
            <em class="fas fa-magnifying-glass gorda-map__search-icon"></em>
            <input class="form-control form-control-sm gorda-map__search-input" type="search" v-model="field.value"
                   :placeholder="$t('common.placeholders.search')" v-bind="field" autocomplete="off"/>
          </div>
          <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
        </Field>
      </div>
    </div>
    <div class="gorda-map__surface">
      <Map :places="filteredDrivers" :icon="icon"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, onBeforeUnmount, ref, Ref} from 'vue'
import {storeToRefs} from 'pinia'
import {useDriversStore} from '@/services/stores/DriversStore'
import {Field} from 'vee-validate'
import Map from '@/components/maps/Map.vue'
import {PlaceInterface} from '@/types/PlaceInterface'

const driversStore = useDriversStore()
const {connectedDrivers} = storeToRefs(driversStore)
const searchDriver: Ref<string> = ref('')
const icon: Ref<string> = ref(process.env.VUE_APP_DRIVER_LOC_IMAGE_URL as string)

const filteredDrivers = computed<Array<PlaceInterface>>(() => {
  const search = searchDriver.value
  if (search.length === 0) {
    return connectedDrivers.value.slice()
  }
  return connectedDrivers.value.filter(place => place.name.toLowerCase().includes(search.toLowerCase()))
})

onBeforeUnmount(() => {
  driversStore.offOnlineDrivers()
})

onBeforeMount(() => {
  driversStore.getOnlineDrivers()
})
</script>

<style scoped>
.gorda-map {
  --map-icon-gradient: linear-gradient(310deg, #17ad37, #98ec2d);
  --map-surface: var(--surface-card);
  --map-input-bg: var(--surface-input);
  --map-border: var(--border-subtle);
  --map-heading: var(--text-heading);
  --map-muted: var(--text-secondary);
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  flex: 1 1 auto;
  min-height: 0;
}

body.dark-version .gorda-map {
  --map-icon-gradient: linear-gradient(310deg, #17ad37, #98ec2d);
  --map-surface: var(--surface-card);
  --map-input-bg: var(--surface-input);
  --map-border: var(--border-subtle);
  --map-heading: var(--text-heading);
  --map-muted: var(--text-secondary);
}

.gorda-map__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.gorda-map__title-group {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.gorda-map__icon-chip {
  width: 30px;
  height: 30px;
  flex: none;
  border-radius: 0.45rem;
  background: var(--map-icon-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 0.75rem;
}

.gorda-map__title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--map-heading);
}

.gorda-map__count-pill {
  background: var(--map-input-bg);
  border: 1px solid var(--map-border);
  border-radius: var(--radius-pill);
  padding: 0.1rem 0.6rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--map-muted);
}

.gorda-map__search {
  margin-bottom: 0;
  width: 260px;
  max-width: 100%;
}

.gorda-map__search-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.75rem;
  border: 1px solid var(--map-border);
  border-radius: 0.9rem;
  background: var(--map-input-bg);
}

.gorda-map__search-icon {
  color: var(--map-muted);
  font-size: 0.8rem;
}

.gorda-map__search-input,
.gorda-map__search-input:focus {
  border: 0;
  background: transparent;
  color: var(--map-heading);
  box-shadow: none;
  padding-left: 0;
}

.gorda-map__surface {
  border-radius: var(--radius-lg);
  border: 1px solid var(--map-border);
  background: var(--map-surface);
  overflow: hidden;
  flex: 1 1 auto;
  min-height: 0;
  height: 70vh;
}

@media (max-width: 767.98px) {
  .gorda-map__search {
    width: 100%;
  }

  .gorda-map__surface {
    height: 60vh;
  }
}
</style>