<template>
  <div class="container-fluid row">
    <div class="col-sm-9">
      <Form @submit="createPlace" :validation-schema="schema" autocomplete="off">
       <div class="row">
         <div class="col-sm-3">
           <div class="form-group">
             <Field name="name" type="text"   v-slot="{ field, errorMessage, meta }" v-model="place.name">
                <input class="form-control" id="name" v-model="field.value" :placeholder="$t('common.placeholders.name')" v-bind="field" autocomplete="off"/>
                <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
             </Field>
            </div>
          </div>
        <div class="col-sm-3">
          <div class="form-group">
            <Field name="lat" type="text" v-slot="{ field, errorMessage, meta }" v-model="place.lat">
               <input class="form-control" id="lat" v-model="field.value" :placeholder="$t('services.fields.lat')" v-bind="field" autocomplete="off"/>
               <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
            </Field>
           </div>
        </div>
           <div class="col-sm-3">
            <div class="form-group">
               <Field name="lng" type="text" v-slot="{ field, errorMessage, meta }" v-model="place.lng">
                  <input class="form-control" id="lng" v-model="field.value" :placeholder="$t('services.fields.lng')" v-bind="field" autocomplete="off"/>
                  <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
               </Field>
           </div>
        </div>
          <div class="col-sm-3">
             <div class="form-group">
              <button type="submit" class="btn btn-primary">{{ $t('common.actions.create') }}</button>
            </div>
         </div>
      </div>
      </Form>
      <div class="row min-vh-75">
        <Map :places="selectedPlace" @onMapClick="onMapClick" :add-listener="true"/>
      </div>
    </div>
  <div class="col-sm-3 pe-4">
      <h5>{{$t('routes.places')}}</h5>
       <div class="form-group">
        <Field name="lat" type="search" v-slot="{ field, errorMessage, meta }" v-model="searchPlace">
           <input class="form-control" type="search" v-model="field.value" :placeholder="$t('common.placeholders.search')" v-bind="field" autocomplete="off"/>
           <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
        </Field>
      </div>
        <ul class="list-group places-group-up text-xs">
          <li class="list-group-item list-group-item-action" @click="selectPlace(place)" v-for="(place, key) in foundPlaces" :key="key">
            <div class="row">
              <div class="col-10">
                {{place.name}}
              </div>
              <div class="col-2 text-end">
                <em class="fa-solid fa-trash cursor-pointer" @click="deletePlace(place)"></em>
              </div>
            </div>
          </li>
        </ul>
    </div>
</div>
</template>

<script setup lang="ts">
import {Ref, ref, watch, onMounted} from 'vue'
import {Field, Form, FormActions} from 'vee-validate'
import * as yup from 'yup'
import PlacesRepository from '@/repositories/PlaceRepository'
import { PlaceInterface } from '@/types/PlaceInterface'
import ToastService from '@/services/ToastService'
import Place from '@/models/Place'
import i18n from '@/plugins/i18n'
import {usePlacesStore} from '@/services/stores/PlacesStore'
import Map from '@/components/maps/Map.vue'
import {storeToRefs} from 'pinia'
import {google} from 'google-maps'
import {StrHelper} from '@/helpers/StrHelper'
import {useLoadingState} from '@/services/stores/LoadingState'

const place: Ref<Place> = ref(new Place)
const searchPlace: Ref<string> = ref('')
const foundPlaces: Ref<Array<Place>> = ref([])
const placesStore = usePlacesStore()
const {places} = storeToRefs(placesStore)
const selectedPlace: Ref<Array<Place>> = ref([])
const {setLoading} = useLoadingState()

onMounted(() => {
  foundPlaces.value = places.value
})

watch(searchPlace, findPlaceByName)
watch(places, (newPlaces) => {
  foundPlaces.value = newPlaces
})

const schema = yup.object().shape({
  name: yup.string().required().min(3),
  lat: yup.number().required(),
  lng: yup.number().required(),
})

function createPlace(_values: PlaceInterface, event: FormActions<any>): void {
  setLoading(true)
  place.value.name = StrHelper.toCamelCase(place.value.name)
  PlacesRepository.create(place.value).then(() => {
    setLoading(false)
    event.resetForm()
    ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.created'))
  }).catch(e => {
    setLoading(false)
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function selectPlace(placeSelected: Place): void {
  selectedPlace.value[0] = placeSelected
}

function findPlaceByName(placeName: string): void {
  foundPlaces.value = places.value.filter(pl => {
    if (pl.name.toLowerCase().includes(placeName.toLowerCase())) {
      return pl
    }
  })
}

function onMapClick(latLng: google.maps.LatLng): void {
  place.value = new Place()
  place.value.lat = latLng.lat()
  place.value.lng = latLng.lng()
}

async function deletePlace(deletedPlace: Place): Promise<void> {
  setLoading(true)
  deletedPlace.delete().then(() => {
    setLoading(false)
    searchPlace.value = ''
    placesStore.remove(deletedPlace)
    ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.deleted'))
  }).catch(e => {
    setLoading(false)
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}
</script>
