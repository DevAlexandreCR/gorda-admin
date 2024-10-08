<template>
  <div id="map"></div>
</template>

<script setup lang="ts">
import {onMounted, watch} from 'vue'
import { PlaceInterface } from '@/types/PlaceInterface';
import {GoogleMaps} from '@/services/maps/GoogleMaps'
import {google} from 'google-maps'
import {useSettingsStore} from "@/services/stores/SettingsStore";

let googleMap: GoogleMaps
let mapReady = false
const { branchSelected } = useSettingsStore()

interface Props {
  places: Array<PlaceInterface>,
  icon?: string
  addListener?: boolean
  route?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['onMapClick'])
let icon: string

onMounted(async () => {
  icon = props.icon?? process.env.VUE_APP_LOCATION_IMAGE_URL as string
  googleMap = new GoogleMaps(icon, branchSelected?.city.location.lat, branchSelected?.city.location.lng)
  await googleMap.initMap('map').then(() => {
    mapReady = true
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

watch(() => [...props.places], (newPlaces, oldPlaces) => {
  if (oldPlaces.length <= newPlaces.length) {
    const intersections = newPlaces.filter(place => oldPlaces.indexOf(place) === -1)
    intersections.forEach(place => {
      const currents = oldPlaces.filter(pla => pla.key === place.key)
      if (currents.length === 1 && mapReady) {
        googleMap.updateMarker(currents[0])
      } else if (mapReady) {
        googleMap.addMarker(place)
      }
    })
  } else {
    const intersections = oldPlaces.filter(driver => newPlaces.indexOf(driver) === -1)
    intersections.forEach(place => {
      const currents = oldPlaces.filter(pla => pla.key === place.key)
      currents.forEach(() => {if (mapReady) googleMap.removeMarker(place)})
    })
  }
  
  if (newPlaces.length === 1) {
    if (mapReady) googleMap.moveCamera(newPlaces[0])
  }
})

function onMapClick(latLng: google.maps.LatLng): void {
  emit('onMapClick', latLng)
}
</script>

