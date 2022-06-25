<template>
<div class="container-fluid">
 <div class="my-2">
    <Form>
      <div class="row">
        <div class="col-12 col-md">
          <div class="form-group">
            <Field name="name" type="text" class="form-control" id="name" :placeholder="$t('common.placeholders.name')"/>
            </div>
          </div>
        <div class="col-12 col-md">
          <div class="form-group">
            <Field name="lat" type="text" class="form-control" id="lat" :placeholder="$t('services.fields.lat')"/>
           </div>
        </div>
           <div class="col-12 col-md">
            <div class="form-group">
               <Field name="lng" type="text" class="form-control" id="lng" :placeholder="$t('services.fields.lng')"/>
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

<script lang="ts">
import {Vue, Options} from 'vue-class-component'
import {Field, Form} from 'vee-validate'

@Options({
  components: {
    Form,
    Field,
  },
})

export default class CreateService extends Vue {
}

</script>
