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
    </div>
  <div class="col-sm-3 pe-4">
      <h5>{{$t('routes.places')}}</h5>
       <div class="form-group">
        <Field name="lat" type="search" v-slot="{ field, errorMessage, meta }" v-model="searchPlace">
           <input class="form-control" type="search" id="lat" v-model="field.value" :placeholder="$t('common.placeholders.search')" v-bind="field" autocomplete="off"/>
           <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
        </Field>
      </div>
        <ul class="list-group places-group-up">
          <li class="list-group-item list-group-item-action" v-for="(place, key) in foundPlaces" :key="key">{{place.name}}</li>
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

const places: Array<Place> = []
const place: Ref<Place> = ref(new Place)
const searchPlace: Ref<string> = ref('')
const foundPlaces: Ref<Array<PlaceInterface>> = ref([])

onMounted(() => {
    PlacesRepository.getAll().then(placesDB => {
      placesDB.forEach(placeDB => {
        const placeTmp = new Place
        Object.assign(placeTmp, placeDB)
        places.push(placeTmp)
      })
      foundPlaces.value = places
  })
})

watch(searchPlace, findPlaceByName)

const schema = yup.object().shape({
  name: yup.string().required().min(3),
  lat: yup.string().required().min(8),
  lng: yup.number().required(),
})

function createPlace(_values: PlaceInterface, event: FormActions<any>): void {
  event.resetForm()
  PlacesRepository.create(place.value).then(() => {
    foundPlaces.value.push(place.value)
    ToastService.toast(ToastService.SUCCESS, i18n.global.t('common.messages.created'))
  }).catch(e => {
    ToastService.toast(ToastService.ERROR, i18n.global.t('common.messages.error'), e.message)
  })
}

function findPlaceByName(placeName: string): void {
  foundPlaces.value = places.filter(pl => {
    if (pl.name.toLowerCase().includes(placeName.toLowerCase())) {
      return pl
    }
  })
}
</script>
