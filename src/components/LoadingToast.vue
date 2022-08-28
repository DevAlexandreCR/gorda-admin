<template>
  <div class="modal bg-opacity" id="dialogModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle"
       aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalTitle">{{ $t('common.messages.waiting') }}</h5>
        </div>
        <div class="modal-body text-center py-5">
          <em class="fa-solid fa-spinner fa-10x circle"></em>
        </div>
        <div class="modal-footer py-4">
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import {onMounted, watch} from 'vue'
import {Modal} from 'bootstrap'

interface Props {
  isLoading: boolean
}

const props = defineProps<Props>()
let dialog: Modal

watch(props, (prop) => {
  if (!dialog) return

  if (prop.isLoading) {
    dialog.show()
  } else {
    dialog.hide()
  }
})

onMounted(() => {
  const element = document.getElementById('dialogModal') as HTMLElement;
  if (element) dialog = new Modal(element, {
    backdrop: false,
    keyboard: false
  })
})
</script>

<style scoped lang="scss">
.bg-opacity {
  background-color: hsla(0, 0%, 100%, 0.6);
}
</style>