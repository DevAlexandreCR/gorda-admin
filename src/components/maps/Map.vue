<template>
  <div id="map"></div>
</template>

<script setup lang="ts">
import {onMounted, watch} from 'vue'
import { PlaceInterface } from '@/types/PlaceInterface';
import {GoogleMaps} from '@/services/maps/GoogleMaps'
import {google} from 'google-maps'
import {useSettingsStore} from "@/services/stores/SettingsStore";
import { useThemeStore } from '@/services/stores/ThemeStore'

let googleMap: GoogleMaps
let mapReady = false
const { branchSelected } = useSettingsStore()
const theme = useThemeStore()

interface Props {
  places: Array<PlaceInterface>,
  icon?: string
  addListener?: boolean
  route?: string
  coloredVehicleMarkers?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['onMapClick'])
let icon: string

onMounted(async () => {
  icon = props.icon?? process.env.VUE_APP_LOCATION_IMAGE_URL as string
  googleMap = new GoogleMaps(icon, branchSelected?.city.location.lat, branchSelected?.city.location.lng, props.coloredVehicleMarkers ?? false)
  await googleMap.initMap('map').then(() => {
    mapReady = true
    // Apply theme after map is ready
    googleMap.setDarkMode(theme.isDark)
    props.places.forEach(place => {
      googleMap.addMarker(place)
    })
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

watch(() => [...props.places], (newPlaces, oldPlaces) => {
  if (!mapReady) {
    return
  }

  newPlaces.forEach((place) => {
    const current = oldPlaces.find((oldPlace) => oldPlace.key === place.key)
    if (current) {
      googleMap.updateMarker(place)
      return
    }

    googleMap.addMarker(place)
  })

  oldPlaces
    .filter((place) => !newPlaces.some((newPlace) => newPlace.key === place.key))
    .forEach((place) => {
      googleMap.removeMarker(place)
    })

  if (newPlaces.length === 1) {
    googleMap.moveCamera(newPlaces[0])
  }
})

function onMapClick(latLng: google.maps.LatLng): void {
  emit('onMapClick', latLng)
}
</script>
