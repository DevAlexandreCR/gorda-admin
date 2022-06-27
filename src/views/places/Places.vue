<template>
<div class="container-fluid">
 <div class="my-2" v-for="(Place, key) in Places" :key="key" :id="'row-' + key">
    <Form @submit="CreatePlace" :validation-schema="schema" autocomplete="off">
      <div class="row">
        <div class="col-12 col-md">
          <div class="form-group">
            <Field name="name" type="text"   v-slot="{ field, errorMessage, meta }" v-model="place.name">
                <input class="form-control" id="name" v-model="field.value" :placeholder="$t('common.placeholders.name')" v-bind="field" autocomplete="off"/>
                <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
            </Field>
            </div>
          </div>
        <div class="col-12 col-md">
          <div class="form-group">
            <Field name="lat" type="text" v-slot="{ field, errorMessage, meta }" v-model="place.lat">
                <input class="form-control" id="lat" v-model="field.value" :placeholder="$t('services.fields.lat')" v-bind="field" autocomplete="off"/>
                <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
            </Field>
           </div>
        </div>
           <div class="col-12 col-md">
            <div class="form-group">
               <Field name="lng" type="text" v-slot="{ field, errorMessage, meta }" v-model="place.lng">
                <input class="form-control" id="lng" v-model="field.value" :placeholder="$t('services.fields.lng')" v-bind="field" autocomplete="off"/>
                <span class="is-invalid" v-if="errorMessage || !meta.dirty">{{ errorMessage }}</span>
               </Field>
           </div>
        </div>
          <div class="col-12 col-md">
             <div class="form-group">
              <button type="button" class="btn btn-primary">{{ $t('common.actions.create') }}</button>
            </div>
         </div>
      </div>
    </Form>
  </div>
<div class="row"> 
  <div class="">
    <div class="panel panel-primary" id="result_panel">
        <div class="col-6 d-flex align-items-center"> 
            <div class="panel-heading ">
                <h3 class="panel-title ">Result List</h3>
            </div>
      </div>
    <div class="panel-body">
        <ul class="places-group-up">
            <li class="list-group-item"><strong>Lugar
                HOLA</strong> (1880m)
            </li>
            <li class="list-group-item"><strong>Lugar
                HOLA</strong> (80m)
            </li>
            <li class="list-group-item"><strong>Lugar
                HOLA</strong> (8140m)
            </li>
            <li class="list-group-item"><strong>Lugar
                HOLA</strong> (38729m)
            </li>
            <li class="list-group-item"><strong>Lugar
                HOLA</strong> (2190m)
            </li>
            <li class="list-group-item"><strong>Lugar
                HOLA</strong> (90029m)
            </li>
            <li class="list-group-item"><strong>Lugar
                HOLA</strong> (100m)
            </li>
            <li class="list-group-item"><strong>Lugar
                HOLA</strong> (70m)
            </li>
            <li class="list-group-item"><strong>Lugar
                HOLA</strong> (95m)
            </li>
            <li class="list-group-item"><strong>Lugar
                HOLA</strong> (13m)
            </li>
            <li class="list-group-item"><strong>Lugar
                HOLA</strong> (12m)
            </li>
            <li class="list-group-item"><strong>Lugar
                HOLA</strong> (877m)
            </li>
            <li class="list-group-item"><strong>Lugar
                HOLA</strong> (344m)
            </li>
            <li class="list-group-item"><strong>Lugar
                HOLA</strong> (10000m)
            </li>
        </ul>
       </div>
      </div>
     </div>
    </div>
</div>


</template>

<script setup lang="ts">
import {Vue, Options} from 'vue-class-component'
import {Field, Form, FormActions} from 'vee-validate'
import * as yup from 'yup'
import PlacesRepository from '@/repositories/PlacesRepository'
import { PlacesInterface } from '@/types/PlacesInterface'
import ToastService from '@/services/ToastService'
import Place from '@/models/Place'


@Options({
  components: {
    Form,
    Field,
  },
})

export default class Places extends Vue {
  mivariable: Array<Place> = []
  place: Places

  mounted(): void {
      PlacesRepository.getAll().then(places => {
      places.forEach(place => {
        this.mivariable.push(place)
      })
    })
  }

    readonly schema = yup.object().shape({
    name: yup.string().required().min(3),
    lat: yup.string().required().min(8),
    lng: yup.number().required(),
  })

  CreatePlace(values: PlacesInterface, event: FormActions<any>): void {
    event.resetForm()
    const place: Place  = new (Place)
    place.name = values.name 
    place.lat = values.lat
    place.lng = values.lng
    PlacesRepository.create(place).then(() => {
      ToastService.toast(ToastService.SUCCESS, this.$t('common.messages.created'))
    }).catch(e => {
      ToastService.toast(ToastService.ERROR, this.$t('common.messages.error'), e.message)
    })
  }
}

</script>
