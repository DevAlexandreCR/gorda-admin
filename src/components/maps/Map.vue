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

let googleMap: GoogleMaps

interface Props {
  places: Array<PlaceInterface>
}

const props = defineProps<Props>()
const emit = defineEmits(['onMapClick'])

watch(props.places, (newPlaces) => {
  googleMap.clearMap()
  newPlaces.forEach(place => {
    googleMap.addMarker(place)
  })
  if (newPlaces.length === 1) {
    googleMap.moveCamera(newPlaces[0])
  }
})

onMounted(() => {
  googleMap = new GoogleMaps()
  googleMap.initMap('map').then(() => {
    props.places.forEach(place => {
      googleMap.addMarker(place)
    })
    googleMap.addListener(onMapClick)
  })
})

function onMapClick(latLng: google.maps.LatLng): void {
  emit('onMapClick', latLng)
}
</script>

