<template>
  <div>
    <Field :name="props.fieldName ?? '12345'"  v-model="searchElement"
           v-slot="{ errorMessage, meta }">
      <input :name="props.fieldName ?? '12345'" :id="idField?? 'search'" :class="classes?? 'form-control'" type="text" @input="onChange"
             :placeholder="props.placeholder" autocomplete="none" v-model="searchElement"/>
      <span class="is-invalid" v-if="errorMessage && meta.dirty">{{ errorMessage }}</span>
    </Field>
    <ErrorMessage :name="props.fieldName?? '12345'" v-slot="{ message }">
      <span class="is-invalid">{{ message }}</span>
    </ErrorMessage>
  </div>
</template>
<script setup lang="ts">

import {ErrorMessage, Field} from 'vee-validate'
import {onMounted, Ref, ref} from 'vue'
import {RemoteAutocomplete} from '@/services/maps/RemoteAutocomplete'

interface Props {
  classes?: string
  fieldName?: string
  placeholder?: string
  idField: string
  normalizer?: (str: string) => string
}

const props = defineProps<Props>()
const searchElement: Ref<string> = ref('')
const emit = defineEmits(['on-change', 'selected'])


onMounted(async () => {
  const autocomplete = new RemoteAutocomplete()
  await autocomplete.initPlaces(props.idField).catch(e => console.log(e))
  autocomplete.onPlaceChanged(function (place) {
    emit('selected', place)
  })
})

function onChange(): void {
  emit('on-change', searchElement.value)
}
</script>