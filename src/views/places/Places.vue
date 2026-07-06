<template>
  <div class="row mx-4">
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
                <button type="submit" class="btn btn-primary" :disabled="creating">
                  <span v-if="creating" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ $t('common.actions.create') }}
                </button>
              </div>
            </div>
          </div>
        </Form>
        <div class="row min-vh-75">
          <Map v-if="branchSelected?.city" :places="selectedPlace" @onMapClick="onMapClick" :add-listener="true"/>
        </div>
      </div>
      <div class="col-sm-3 pe-4">
        <h5>{{$t('routes.places')}}</h5>
        <div class="form-group">
          <Field name="lat" type="search" v-slot="{ field, errorMessage, meta }" v-model="searchPlace">
            <input class="form-control form-control-sm" type="search" v-model="field.value" :placeholder="$t('common.placeholders.search')" v-bind="field" autocomplete="off"/>
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
                <span v-if="isDeleting(place)" class="spinner-border spinner-border-sm text-secondary" role="status" aria-hidden="true"></span>
                <em v-else class="fa-solid fa-trash cursor-pointer" @click="deletePlace(place)"></em>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch, onMounted } from 'vue'
import { Field, Form, FormActions } from 'vee-validate'
import * as yup from 'yup'
import PlacesRepository from '@/repositories/PlaceRepository'
import { PlaceInterface } from '@/types/PlaceInterface'
import ToastService from '@/services/ToastService'
import Place from '@/models/Place'
import i18n from '@/plugins/i18n'
import { usePlacesStore } from '@/services/stores/PlacesStore'
import Map from '@/components/maps/Map.vue'
import { storeToRefs } from 'pinia'
import { google } from 'google-maps'
import { StrHelper } from '@/helpers/StrHelper'
import { useSettingsStore } from '@/services/stores/SettingsStore'

const place: Ref<Place> = ref(new Place())
const searchPlace: Ref<string> = ref('')
const foundPlaces: Ref<Array<Place>> = ref([])
const placesStore = usePlacesStore()
const { results, isReady, currentCityId } = storeToRefs(placesStore)
const settingsStore = useSettingsStore()
const { branchSelected } = storeToRefs(settingsStore)
const selectedPlace: Ref<Array<Place>> = ref([])
const creating = ref(false)
const deletingKeys: Ref<Set<string>> = ref(new Set())

function placeKey(placeItem: Place): string {
  return placeItem.id || placeItem.key
}

function isDeleting(placeItem: Place): boolean {
  return deletingKeys.value.has(placeKey(placeItem))
}

onMounted(() => {
  if (!branchSelected.value?.city) {
    ToastService.toast(ToastService.ERROR, i18n.global.t('settings.messages.select_city'))
    return
  }
  hydratePlaces(searchPlace.value).catch(() => undefined)
})

watch(searchPlace, (placeName) => {
  hydratePlaces(placeName).catch(() => undefined)
})

watch(results, (newPlaces) => {
  foundPlaces.value = newPlaces
})

watch([isReady, currentCityId], async ([ready]) => {
  if (!ready) {
    return
  }
  await hydratePlaces(searchPlace.value)
})

const schema = yup.object().shape({
  name: yup.string().required().min(3),
  lat: yup.number().required(),
  lng: yup.number().required(),
})

function createPlace(_values: PlaceInterface, event: FormActions<any>): void {
  creating.value = true
  if (!branchSelected.value?.city) {
    creating.value = false
    ToastService.toast(ToastService.ERROR, i18n.global.t('settings.messages.select_city'))
    return
  }
  place.value.name = StrHelper.toCamelCase(place.value.name)
  PlacesRepository.create(place.value, branchSelected.value.city.id).then(() => {
    event.resetForm()
    ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.created'))
    placesStore.hydratePlacesInBackground(branchSelected.value?.city?.id).then(() => hydratePlaces(searchPlace.value)).finally(() => {
      creating.value = false
    })
  }).catch((e) => {
    creating.value = false
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function selectPlace(placeSelected: Place): void {
  selectedPlace.value = [placeSelected]
}

function onMapClick(latLng: google.maps.LatLng): void {
  place.value = new Place()
  place.value.lat = latLng.lat()
  place.value.lng = latLng.lng()
}

async function deletePlace(deletedPlace: Place): Promise<void> {
  const deletedPlaceId = placeKey(deletedPlace)
  deletingKeys.value.add(deletedPlaceId)
  deletedPlace.delete().then(() => {
    deletingKeys.value.delete(deletedPlaceId)
    searchPlace.value = ''
    foundPlaces.value = foundPlaces.value.filter((placeItem) => placeKey(placeItem) !== deletedPlaceId)
    placesStore.remove(deletedPlace)
    ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.deleted'))
  }).catch((e) => {
    deletingKeys.value.delete(deletedPlaceId)
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

async function hydratePlaces(term: string): Promise<void> {
  const placesResult = await placesStore.searchPlaces(term)
  foundPlaces.value = placesResult
}
</script>
