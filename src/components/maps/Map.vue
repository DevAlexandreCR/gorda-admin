<template>
<div class="card">
  <div class="card-body">
  <div id="map" class="container-fluid w-100 h-100" ></div>
  </div>
</div>
</template>

<script setup lang="ts">
import { onMounted} from 'vue'
import { Loader } from "@googlemaps/js-api-loader"
import { PlaceInterface } from '@/types/PlaceInterface';

const additionalOptions = {};

let map = null

const loader = new Loader({
  apiKey: process.env.VUE_APP_GOOGLE_API_KEY?? '',
  version: "weekly",
  ...additionalOptions,
})

interface Props {
  places: Array<PlaceInterface>
}

const props = defineProps<Props>()

onMounted(() => {
loader.load().then((google)=> {
    map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: 2.4448143, lng: -76.6147395 },
      zoom: 15
     })
    props.places.forEach(place => {
      const marker = new google.maps.Marker({
        position: {
          lat: place.lat as number, 
          lng: place.lng as number
          },
          map: map,
       });       
      })
    })
    .catch(error => {
    console.log(error)
  })
})
</script>

