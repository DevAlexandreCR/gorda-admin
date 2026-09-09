<template>
  <div id="map"></div>
</template>

<script setup lang="ts">
import {nextTick, onMounted, watch} from 'vue'
import { PlaceInterface } from '@/types/PlaceInterface';
import {GoogleMaps} from '@/services/maps/GoogleMaps'
import {google} from 'google-maps'
import {useSettingsStore} from "@/services/stores/SettingsStore";
import { useThemeStore } from '@/services/stores/ThemeStore'

let googleMap: GoogleMaps
let mapReady = false
let renderedPlaces: Map<string, PlaceInterface> = new Map()
const { branchSelected } = useSettingsStore()
const theme = useThemeStore()

interface Props {
  places: Array<PlaceInterface>,
  icon?: string
  addListener?: boolean
  route?: string
  visible?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['onMapClick'])
let icon: string

onMounted(async () => {
  icon = props.icon?? process.env.VUE_APP_LOCATION_IMAGE_URL as string
  googleMap = new GoogleMaps(icon, branchSelected?.city.location.lat, branchSelected?.city.location.lng)
  await googleMap.initMap('map').then(() => {
    mapReady = true
    // Apply theme after map is ready
    googleMap.setDarkMode(theme.isDark)
    props.places.forEach(place => {
      googleMap.addMarker(place)
    })
    renderedPlaces = toPlaceMap(props.places)
    if (props.addListener) googleMap.addListener(onMapClick)
    if (props.route) googleMap.printRoute(props.route)
    if (props.places.length === 1) {
      googleMap.moveCamera(props.places[0])
    }
  })
})

// React to theme changes
watch(() => theme.effective, () => {
  if (mapReady) googleMap.setDarkMode(theme.isDark)
})

// Rising edge of `visible` (e.g. a Bootstrap tab pane becoming shown again)
// needs a resize once the container regains layout, hence the nextTick.
watch(() => props.visible, (visible, wasVisible) => {
  if (!mapReady || !visible || wasVisible) {
    return
  }
  nextTick(() => {
    googleMap.resize()
  })
})

function toPlaceMap(places: Array<PlaceInterface>): Map<string, PlaceInterface> {
  const placeMap = new Map<string, PlaceInterface>()
  places.forEach((place) => placeMap.set(place.key, place))
  return placeMap
}

function placesEqual(a: PlaceInterface, b: PlaceInterface): boolean {
  return a.lat === b.lat
    && a.lng === b.lng
    && a.name === b.name
    && a.color === b.color
    && a.freshness === b.freshness
}

watch(() => props.places, (newPlaces) => {
  if (!mapReady) {
    return
  }

  const newPlaceMap = toPlaceMap(newPlaces)

  newPlaceMap.forEach((place, key) => {
    const previous = renderedPlaces.get(key)
    if (!previous) {
      googleMap.addMarker(place)
      return
    }

    if (!placesEqual(previous, place)) {
      googleMap.updateMarker(place)
    }
  })

  renderedPlaces.forEach((place, key) => {
    if (!newPlaceMap.has(key)) {
      googleMap.removeMarker(place)
    }
  })

  renderedPlaces = newPlaceMap

  if (newPlaces.length === 1) {
    googleMap.moveCamera(newPlaces[0])
  }
}, { deep: true })

function onMapClick(latLng: google.maps.LatLng): void {
  emit('onMapClick', latLng)
}
</script>
