<template>
  <!-- Modal -->
  <div class="modal fade" :id="id" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" >{{ $t('users.forms.upload') }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Form @submit="uploadImg" :validation-schema="schemaImg">
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">{{ $t('users.forms.select_img') }}</label>
              <Field name="image" class="form-control" type="file" accept="image/*" v-model="image" multiple/>
              <ErrorMessage name="image" class="is-invalid"/>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">{{ $t('common.actions.close') }}</button>
            <button type="submit" class="btn bg-gradient-primary">{{ $t('common.actions.submit') }}</button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component'
import CustomValidator from '@/assets/validatiions/validators'
import * as yup from 'yup'
import StorageService from "@/services/StorageService";
import {ErrorMessage, Field, Form} from 'vee-validate'
import { hide } from '@/helpers/ModalHelper';
import i18n from "@/plugins/i18n";


class Props {
  id: string
  event: string
  path: string
  resourceId: string
}

@Options({
  components: {
    Form,
    Field,
    ErrorMessage
  },
})
export default class ImageLoader extends Vue.with(Props) {
  image: File[] = []
  schemaImg: yup.ObjectSchema<any> = yup.object().shape({})

  mounted(): void {
    this.schemaImg = yup.object().shape({
      image: CustomValidator.isImage(i18n.global.t('validations.image'), i18n.global.t('validations.size')).required()
    })
  }

  uploadImg(): void {
    const ref = StorageService.getStorageReference(this.path, this.resourceId, this.image[0]?.name)
    StorageService.uploadFile(ref, this.image[0]).then(url => {
      this.$emit(this.event, url)
      hide(this.id)
    })
  }
}
</script>