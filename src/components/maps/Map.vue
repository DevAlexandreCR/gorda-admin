<template>
<div class="card">
  <div class="card-body">
  <div id="map" class="container-fluid w-100 h-100" ></div>
  </div>
</div>
</template>

<script setup lang="ts">
import {onMounted, watch} from 'vue'
import { PlaceInterface } from '@/types/PlaceInterface';
import {GoogleMaps} from '@/services/maps/GoogleMaps'
import {google} from 'google-maps'

let googleMap: GoogleMaps
let mapReady = false

interface Props {
  places: Array<PlaceInterface>,
  icon?: string
  addListener?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['onMapClick'])
let icon: string

onMounted(async () => {
  icon = props.icon?? process.env.VUE_APP_LOCATION_IMAGE_URL as string
  googleMap = new GoogleMaps(icon)
  await googleMap.initMap('map').then(() => {
    mapReady = true
    props.places.forEach(place => {
      googleMap.addMarker(place)
    })
    if (props.addListener) googleMap.addListener(onMapClick)
  })
})

watch(props.places, (newPlaces) => {
  googleMap.clearMap()
  newPlaces.forEach(place => {
    if(mapReady) googleMap.addMarker(place)
  })
  if (newPlaces.length === 1) {
    if(mapReady) googleMap.moveCamera(newPlaces[0])
  }
})

function onMapClick(latLng: google.maps.LatLng): void {
  emit('onMapClick', latLng)
}
</script>

