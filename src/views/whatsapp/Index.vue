<template>
  <div>
    <div class="container-fluid d-flex justify-content-end">
      <button class="btn btn-primary" data-bs-target="#create-client" data-bs-toggle="modal">{{$t('common.actions.create')}}</button>
    </div>
    <div class="row container-fluid">
      <div class="col-md-6 mt-2" v-for="client in clients" :key="client.id">
        <Connection :client="client"></Connection>
      </div>
    </div>
  </div>
  <!--Modal-->
  <div class="modal fade" id="create-client" tabindex="-1" aria-labelledby="create-client" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ $t('wp.actions.create') }}</h5>
          <button type="button" id="closeEditPasswordModalButton" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <Form @submit="create" :validation-schema="schema" autocomplete="off">
            <div class="form-group">
              <label>{{ $t('wp.fields.alias') }}</label>
              <Field name="alias" type="text" class="form-control" id="alias" :placeholder="$t('wp.fields.alias')"
                     v-model="newClient.alias" aria-label="Alias" aria-describedby="alias-addon" />
              <ErrorMessage name="alias"/>
            </div>
            <div class="form-group">
              <label>{{ $t('wp.fields.id') }}</label>
              <Field name="id" type="phone" class="form-control" id="id" :placeholder="$t('wp.fields.id')"
                     v-model="newClient.id" aria-label="Phone" aria-describedby="phone-addon" />
              <ErrorMessage name="id"/>
            </div>
            <div class="card-footer text-end">
              <button class="btn btn-info" type="submit">{{ $t('common.actions.submit') }}</button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>

</template>
<script setup lang="ts">
import {useWpClientsStore} from "@/services/stores/WpClientStore"
import Connection from "@/views/whatsapp/Connection.vue"
import {storeToRefs} from "pinia"
import {reactive, watch} from "vue";
import {WpClient} from "@/types/WpClient";
import {ErrorMessage, Field, Form, FormActions} from "vee-validate";
import * as yup from "yup";
import {StrHelper} from "@/helpers/StrHelper";
import {hide} from "@/helpers/ModalHelper";
import { useI18n } from "vue-i18n";

const {clients} = storeToRefs(useWpClientsStore())
const {createClient} = useWpClientsStore()
const {t} = useI18n()

const newClient = reactive<WpClient>({
  id: '',
  alias: '',
  wpNotifications: false,
  chatBot: false,
  assistant: false
})
const schema = yup.object().shape({
  id: yup.string()
    .required(`${t('validations.required')}`)
    .matches(/^\d+$/, `${t('validations.requiredNumbers')}`)
    .matches(/^\S*$/, `${t('validations.NotSpaces')}`)
    .length(10, `${t('validations.requiredMaxTen')}`),
  alias: yup.string()
    .required(`${t('validations.required')}`)
    .min(3, `${t('validations.requiredMinTree')}`)
});

watch(newClient, (clientNew) => {
  newClient.alias = StrHelper.toCamelCase(clientNew.alias?? '')
}, {deep: true})

function create(_values: WpClient, event: FormActions<any>): void {
  createClient(newClient).finally(() => {
    hide('create-client')
    event.resetForm()
  })
}
</script>